import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import io, { Socket } from "socket.io-client";

type DroneProfile = {
  brand: string;
  model: string;
  marketName: string;
  category: string;
  description: string;
  estimatedBatteryMinutes: number;
  specs: string[];
  color?: string | null;
};

type AssignedDeviceProfile = {
  deviceId: string;
  assignedName: string;
  status: "connected" | "lost" | "reconnecting";
  drone: DroneProfile;
  createdAt: number;
  lastSeenAt: number;
  batteryLevel?: number | null;
  batteryCharging?: boolean | null;
};

type BatterySnapshot = {
  level: number;
  charging: boolean;
} | null;

function stableHash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getStableDeviceId() {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    `${window.screen.width}x${window.screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");

  return `device_${stableHash(fingerprint).slice(0, 10)}`;
}

export default function MobileTracker() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [deviceProfile, setDeviceProfile] =
    useState<AssignedDeviceProfile | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [batterySnapshot, setBatterySnapshot] = useState<BatterySnapshot>(null);
  const [error, setError] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const batterySnapshotRef = useRef<BatterySnapshot>(null);

  useEffect(() => {
    batterySnapshotRef.current = batterySnapshot;
  }, [batterySnapshot]);

  const getBatteryPayload = () => {
    const currentSnapshot = batterySnapshotRef.current;

    if (!currentSnapshot) {
      return {};
    }

    return {
      batteryLevel: Math.min(
        100,
        Math.max(0, Math.round(currentSnapshot.level * 100))
      ),
      batteryCharging: currentSnapshot.charging,
    };
  };

  const syncBatterySnapshot = async () => {
    if (typeof navigator === "undefined") {
      return;
    }

    const batteryApi = (
      navigator as Navigator & {
        getBattery?: () => Promise<{
          level: number;
          charging: boolean;
          addEventListener?: (event: string, handler: () => void) => void;
        }>;
      }
    ).getBattery;

    if (!batteryApi) {
      setBatterySnapshot(null);
      return;
    }

    try {
      const battery = await batteryApi();
      const updateSnapshot = () => {
        setBatterySnapshot({
          level: battery.level,
          charging: battery.charging,
        });
      };

      updateSnapshot();
      battery.addEventListener?.("levelchange", updateSnapshot);
      battery.addEventListener?.("chargingchange", updateSnapshot);
    } catch (error) {
      console.warn("No se pudo leer la batería del dispositivo", error);
      setBatterySnapshot(null);
    }
  };

  const syncDeviceProfile = async (currentDeviceId: string) => {
    try {
      const response = await fetch("/api/devices/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: currentDeviceId,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          ...getBatteryPayload(),
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        device?: AssignedDeviceProfile;
      };

      if (response.ok && payload.ok && payload.device) {
        setDeviceProfile(payload.device);
        setDeviceId(payload.device.deviceId);
      }
    } catch (error) {
      console.warn("No se pudo sincronizar el perfil del dispositivo", error);
    }
  };

  // Generar o recuperar ID persistente del dispositivo
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Intentar recuperar del localStorage
    let id = localStorage.getItem("deviceId");
    if (!id) {
      // Si no existe, generar uno estable para evitar duplicados frecuentes
      id = getStableDeviceId();
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

  // Inicializar conexión WebSocket
  useEffect(() => {
    if (!deviceId) return;

    // Usar la misma URL que la página actual
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    const host = window.location.hostname;
    const port = window.location.port;
    const socketUrl = port
      ? `${protocol}//${host}:${port}`
      : `${protocol}//${host}`;

    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity, // Intentar reconectar indefinidamente
    });

    socketRef.current = socket;

    // Al conectar, registrar el dispositivo
    socket.on("connect", () => {
      console.log("✓ Conectado al servidor", socket.id);
      setIsConnected(true);
      // Registrar dispositivo automáticamente
      socket.emit("device:register", { deviceId, ...getBatteryPayload() });
      void syncDeviceProfile(deviceId);
      console.log("✓ Dispositivo registrado:", deviceId);
    });

    socket.on("disconnect", () => {
      console.log("✗ Desconectado del servidor");
      setIsConnected(false);
    });

    socket.on("reconnect", () => {
      console.log("✓ Reconectado al servidor");
      // Re-registrar después de reconectar
      socket.emit("device:register", { deviceId, ...getBatteryPayload() });
      void syncDeviceProfile(deviceId);
    });

    socket.on("device:profile", (profile: AssignedDeviceProfile) => {
      setDeviceProfile(profile);
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceId]);

  useEffect(() => {
    void syncBatterySnapshot();
  }, []);

  // Heartbeat para mantener viva la señal aunque la geolocalización se retrase
  useEffect(() => {
    if (!isTracking || !deviceId) return;

    const interval = window.setInterval(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("device:heartbeat", {
          deviceId,
          ...getBatteryPayload(),
        });
      }
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isTracking, deviceId]);

  // Iniciar rastreo de ubicación
  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada en este navegador");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      setError(
        "Sin conexión al servidor. Espera unos segundos e intenta de nuevo."
      );
      return;
    }

    if (isTracking) {
      stopTracking();
      return;
    }

    setIsTracking(true);
    setError("");

    console.log("✓ Iniciando rastreo de ubicación...");

    // Enviar una posición inicial inmediata para sincronizar mapa/radar al primer inicio.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        if (socketRef.current && deviceId) {
          socketRef.current.emit("device:location", {
            deviceId,
            latitude,
            longitude,
          });
        }
      },
      () => {
        // Si falla el getCurrentPosition, watchPosition sigue intentando.
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Iniciar rastreo continuo
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Enviar ubicación al servidor
        if (socketRef.current && deviceId) {
          socketRef.current.emit("device:location", {
            deviceId,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setError(
            "Permiso de ubicación denegado. Activa GPS en configuración."
          );
        } else {
          setError(`Error de ubicación: ${error.message}`);
        }
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  // Detener rastreo
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLocation(null);
    if (socketRef.current && deviceId) {
      socketRef.current.emit("device:disconnect_request", { deviceId });
    }
  };

  // Limpieza al desmontar la página
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Detector de Drones - Tracker Móvil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-detector-grid flex min-h-screen flex-col items-center justify-center px-4 py-8 text-zinc-100">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-cyan-500/25 bg-zinc-950/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur">
            <h1 className="text-3xl font-black text-red-500">
              Simulador de Drones
            </h1>
            <p className="mt-2 text-sm text-zinc-300">
              Transmite tu ubicación GPS en tiempo real
            </p>

            {/* QR / Device ID */}
            <div className="mt-6 rounded-lg border border-cyan-400/30 bg-zinc-900/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                ID Dispositivo
              </p>
              <p className="mt-2 break-all font-mono text-sm text-white">
                {deviceId}
              </p>
            </div>

            {deviceProfile && (
              <div className="mt-4 rounded-lg border border-fuchsia-400/30 bg-fuchsia-950/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">
                  Modelo Detectado
                </p>
                <p className="mt-2 text-lg font-bold text-white">
                  {deviceProfile.assignedName}
                </p>
                <p className="text-sm text-zinc-300">
                  {deviceProfile.drone.marketName} · {deviceProfile.drone.model}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {deviceProfile.drone.description}
                </p>

                <div className="mt-3 rounded-lg border border-cyan-400/30 bg-zinc-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                    Batería
                  </p>
                  {(() => {
                    // Mostrar la batería real del celular si está disponible en el snapshot local,
                    // si no, caer en la última batería reportada por el servidor.
                    const snapshot = batterySnapshot;
                    const snapshotPercent =
                      snapshot && typeof snapshot.level === "number"
                        ? Math.min(
                            100,
                            Math.max(0, Math.round(snapshot.level * 100))
                          )
                        : null;

                    const displayLevel =
                      snapshotPercent ?? deviceProfile.batteryLevel ?? null;

                    if (typeof displayLevel === "number") {
                      return (
                        <p className="mt-2 text-sm text-zinc-200">
                          Nivel real detectado: {displayLevel}%
                          {(snapshot && snapshot.charging) ||
                          deviceProfile.batteryCharging
                            ? " (cargando)"
                            : ""}
                        </p>
                      );
                    }

                    return (
                      <p className="mt-2 text-sm text-zinc-200">
                        Estimación del modelo: ~
                        {deviceProfile.drone.estimatedBatteryMinutes} min de
                        vuelo
                      </p>
                    );
                  })()}
                  <p className="mt-1 text-xs text-zinc-500">
                    Categoría: {deviceProfile.drone.category}
                  </p>
                </div>

                <div className="mt-3 text-sm text-zinc-200">
                  <p className="font-medium text-cyan-200">Especificaciones</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
                    {deviceProfile.drone.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>

                  {deviceProfile.drone.color && (
                    <p className="mt-3 text-zinc-300">
                      Color:{" "}
                      <span className="text-white">
                        {deviceProfile.drone.color}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Estado de Conexión */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm">
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>

            {/* Ubicación Actual */}
            {location && (
              <div className="mt-4 rounded-lg border border-cyan-400/30 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Ubicación Actual
                </p>
                <div className="mt-2 font-mono text-sm">
                  <p>Lat: {location.latitude.toFixed(6)}</p>
                  <p>Lng: {location.longitude.toFixed(6)}</p>
                  <p className="mt-2 text-xs text-green-400">
                    ✓ Transmitiendo ubicación
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-400/30 bg-red-950/30 p-4">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={startTracking}
                disabled={isTracking}
                className="flex-1 rounded-lg border border-green-400 bg-green-500/20 px-4 py-3 font-semibold text-green-300 transition hover:bg-green-500/30 disabled:opacity-50"
              >
                {isTracking ? "Rastreando..." : "Iniciar"}
              </button>
              <button
                onClick={stopTracking}
                disabled={!isTracking}
                className="flex-1 rounded-lg border border-red-400 bg-red-500/20 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
              >
                Detener
              </button>
            </div>

            {/* Info */}
            <p className="mt-6 text-xs text-zinc-500">
              💡 Mantén esta pestaña abierta. Abre la aplicación de control en
              otra pantalla para ver tu ubicación en tiempo real.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
