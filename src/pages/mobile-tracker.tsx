import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import io, { Socket } from "socket.io-client";

export default function MobileTracker() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Inicializar conexión WebSocket
  useEffect(() => {
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
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Conectado al servidor", socket.id);
      setIsConnected(true);
      if (deviceId) {
        socket.emit("device:register", { deviceId });
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceId]);

  // Generar ID único del dispositivo
  useEffect(() => {
    const id = `device_${Math.random().toString(36).slice(2, 11)}`;
    setDeviceId(id);
  }, []);

  // Iniciar rastreo de ubicación
  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada en este navegador");
      return;
    }

    setIsTracking(true);
    setError("");

    // Registrar dispositivo
    if (socketRef.current && deviceId) {
      socketRef.current.emit("device:register", { deviceId });
      setIsConnected(true);
    }

    // Iniciar rastreo continuo
    const watchId = navigator.geolocation.watchPosition(
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

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  // Detener rastreo
  const stopTracking = () => {
    setIsTracking(false);
    setLocation(null);
    if (socketRef.current && deviceId) {
      socketRef.current.emit("device:disconnect_request", { deviceId });
    }
  };

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
              Rastreador Móvil
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
