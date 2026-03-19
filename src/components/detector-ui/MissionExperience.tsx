import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLocation } from "@/context/LocationContext";
import { Device } from "@/types/location";

const MapViewer = dynamic(
  () => import("./MapViewer").then((mod) => ({ default: mod.MapViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-cyan-500/30 bg-zinc-950">
        <p className="text-sm text-zinc-400">Cargando mapa...</p>
      </div>
    ),
  }
);

type View = "home" | "detection" | "tracking";
type LocationPoint = { x: number; y: number; time: string };

export const MissionExperience = () => {
  const [view, setView] = useState<View>("home");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [signalLostAlert, setSignalLostAlert] = useState<{
    deviceId: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<
    Array<{
      deviceId: string;
      action: "detected" | "lost" | "reconnected";
      timestamp: number;
      latitude?: number;
      longitude?: number;
    }>
  >([]);
  const { devices } = useLocation();
  const prevDeviceCountRef = useRef(0);
  const prevDevicesRef = useRef<Map<string, Device>>(new Map());

  // Auto ir al mapa cuando se detecta el primer dispositivo
  useEffect(() => {
    if (devices.size > 0 && prevDeviceCountRef.current === 0) {
      setView("tracking");
      const firstDevice = Array.from(devices.values())[0];
      setSelectedDeviceId(firstDevice.id);
    }
    prevDeviceCountRef.current = devices.size;
  }, [devices.size]);

  // Detectar cambios de estado y agregar al historial
  useEffect(() => {
    devices.forEach((device) => {
      const prevDevice = prevDevicesRef.current.get(device.id);

      // Nueva detección
      if (!prevDevice) {
        setDetectionHistory((prev) => [
          ...prev,
          {
            deviceId: device.id,
            action: "detected",
            timestamp: Date.now(),
            latitude: device.latitude,
            longitude: device.longitude,
          },
        ]);
      }
      // Cambio de estado a perdido
      else if (
        prevDevice.signalStatus !== "lost" &&
        device.signalStatus === "lost"
      ) {
        setDetectionHistory((prev) => [
          ...prev,
          {
            deviceId: device.id,
            action: "lost",
            timestamp: Date.now(),
            latitude: device.latitude,
            longitude: device.longitude,
          },
        ]);
      }
      // Reconexión
      else if (
        prevDevice.signalStatus !== "connected" &&
        device.signalStatus === "connected"
      ) {
        setDetectionHistory((prev) => [
          ...prev,
          {
            deviceId: device.id,
            action: "reconnected",
            timestamp: Date.now(),
            latitude: device.latitude,
            longitude: device.longitude,
          },
        ]);
      }
    });

    // Actualizar mapa anterior
    prevDevicesRef.current = new Map(devices);
  }, [devices]);

  // Detectar cuando se pierde señal y mostrar aviso
  useEffect(() => {
    const lostDevices = Array.from(devices.values()).filter(
      (d) => d.signalStatus === "lost"
    );

    if (lostDevices.length > 0) {
      const device = lostDevices[0];
      setSignalLostAlert({
        deviceId: device.id,
        latitude: device.latitude,
        longitude: device.longitude,
      });
    }
  }, [devices]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-12 pt-8 sm:gap-6 sm:px-5 sm:pb-16 sm:pt-10 md:px-8">
      <header className="rounded-2xl border border-cyan-500/25 bg-zinc-950/75 p-4 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
          Centro de Comando
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-red-500 sm:mt-3 sm:text-3xl md:text-5xl">
          Detector de Drones
        </h1>
        <p className="mt-2 max-w-3xl text-xs text-zinc-300 sm:mt-4 sm:text-sm md:text-base">
          Demo visual de vigilancia táctica con secuencia de escaneo, radar
          animado y seguimiento de objetivo en tiempo real simulado.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.article
            key="home"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-red-500/20 bg-zinc-900/80 p-8"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="drone-glow-wrap">
                <motion.img
                  src="/drone.svg"
                  alt="Dron táctico"
                  className="h-40 w-40 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] md:h-52 md:w-52"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3.4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </div>

              <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
                El sistema iniciará un barrido de señal local para detectar un
                objetivo no identificado y moverlo al modo de seguimiento.
              </p>

              <button
                onClick={() => setView("detection")}
                className="group relative overflow-hidden rounded-lg border border-red-300 bg-red-500 px-8 py-3 text-base font-extrabold uppercase tracking-wider text-black transition hover:scale-[1.03]"
              >
                <span className="relative z-10">Detectar Dron</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition group-hover:translate-x-full" />
              </button>
            </div>
          </motion.article>
        )}

        {view === "detection" && (
          <motion.article
            key="detection"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-cyan-400/25 bg-zinc-900/80 p-6 md:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative mx-auto flex h-[300px] w-[300px] items-center justify-center rounded-full border border-cyan-400/40 bg-zinc-950 md:h-[360px] md:w-[360px]">
                <div className="radar-ring radar-ring-1" />
                <div className="radar-ring radar-ring-2" />
                <div className="radar-ring radar-ring-3" />
                <div className="radar-sweep" />

                {/* Mostrar dispositivos detectados en el radar */}
                {devices.size > 0 ? (
                  Array.from(devices.values()).map((device, index) => {
                    // Calcular posición en el radar (ángulo basado en índice)
                    const angle = (index * 360) / Math.max(devices.size, 1);
                    const radius = 60; // píxeles del centro
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    const isConnected = device.signalStatus === "connected";
                    const dotColor = isConnected ? "#06b6d4" : "#ef4444";

                    return (
                      <motion.div
                        key={device.id}
                        className="absolute"
                        animate={{ x, y }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            background: dotColor,
                            borderRadius: "50%",
                            border: "2px solid white",
                            boxShadow: `0 0 12px ${dotColor}`,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedDeviceId(device.id);
                            setView("tracking");
                          }}
                          title={`${device.id.slice(0, 8)} - ${device.signalStatus}`}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  // Mostrar animación de escaneo cuando no hay dispositivos
                  <motion.div
                    className="absolute"
                    animate={{ x: [70, -55, 40, 70], y: [-65, 25, 70, -65] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <img
                      src="/drone.svg"
                      alt="Objetivo detectado"
                      className="h-12 w-12 opacity-90"
                    />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Modo Escaneo
                </p>
                <h2 className="text-2xl font-black text-red-400 md:text-3xl">
                  Barrido activo y adquisición
                </h2>
                <p className="text-sm text-zinc-300 md:text-base">
                  {devices.size > 0
                    ? `${devices.size} dispositivo(s) detectado(s). Haz clic en un punto del radar para verlo en el mapa.`
                    : "La interfaz reproduce ondas, pulsos y barrido angular para una transición cinematográfica hacia seguimiento."}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {devices.size > 0 && (
                    <button
                      onClick={() => setView("tracking")}
                      className="rounded-md border border-green-400 bg-green-500/20 px-5 py-2 text-sm font-semibold text-green-100 transition hover:scale-[1.03] hover:bg-green-500/30"
                    >
                      ✓ Ver en el mapa
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setView("tracking");
                    }}
                    className="rounded-md border border-cyan-300 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:scale-[1.03] hover:bg-cyan-300/30"
                  >
                    Objetivo detectado
                  </button>
                  <button
                    onClick={() => setView("home")}
                    className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-300"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {view === "tracking" && (
          <motion.article
            key="tracking"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.45 }}
            className="relative rounded-3xl border border-red-500/25 bg-zinc-900/85 p-6 md:p-8"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Seguimiento
                </p>
                <h2 className="text-2xl font-black text-red-400">
                  Mapa en vivo
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("detection")}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200"
                >
                  Radar
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-[400px] lg:col-span-2">
                <MapViewer />
              </div>

              {/* Panel de Dispositivos e Historial con pestañas */}
              <div className="rounded-2xl border border-cyan-400/25 bg-zinc-950/60 p-4">
                <div className="mb-3 flex gap-2 border-b border-zinc-700">
                  <button
                    onClick={() => setSelectedDeviceId("__devices")}
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                      selectedDeviceId !== "__history"
                        ? "border-b-2 border-cyan-400 text-cyan-300"
                        : "text-zinc-500"
                    }`}
                  >
                    Dispositivos ({devices.size})
                  </button>
                  <button
                    onClick={() => setSelectedDeviceId("__history")}
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                      selectedDeviceId === "__history"
                        ? "border-b-2 border-cyan-400 text-cyan-300"
                        : "text-zinc-500"
                    }`}
                  >
                    Historial ({detectionHistory.length})
                  </button>
                </div>

                {/* Tab: Dispositivos */}
                {selectedDeviceId !== "__history" && (
                  <div className="flex max-h-[350px] flex-col gap-2 overflow-y-auto">
                    {devices.size === 0 ? (
                      <p className="text-xs italic text-zinc-500">
                        Esperando conexión de celulares...
                      </p>
                    ) : (
                      Array.from(devices.values()).map((device) => (
                        <motion.div
                          key={device.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`cursor-pointer rounded-md border p-2 text-xs transition hover:bg-opacity-50 ${
                            device.signalStatus === "connected"
                              ? "border-cyan-400/40 bg-cyan-950/30 hover:bg-cyan-950/50"
                              : device.signalStatus === "lost"
                                ? "border-red-400/40 bg-red-950/30 hover:bg-red-950/50"
                                : "border-yellow-400/40 bg-yellow-950/30 hover:bg-yellow-950/50"
                          }`}
                          onClick={() => setSelectedDeviceId(device.id)}
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-cyan-300">
                              {device.id.slice(0, 8)}
                            </span>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                device.signalStatus === "connected"
                                  ? "bg-green-500"
                                  : device.signalStatus === "lost"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-zinc-400">
                            <p>Lat: {device.latitude.toFixed(4)}</p>
                            <p>Lng: {device.longitude.toFixed(4)}</p>
                            <p className="mt-1 text-zinc-500">
                              Detección hace{" "}
                              {Math.round(
                                (Date.now() - device.detectionTime) / 1000
                              )}
                              s
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Historial */}
                {selectedDeviceId === "__history" && (
                  <div className="flex max-h-[350px] flex-col gap-2 overflow-y-auto">
                    {detectionHistory.length === 0 ? (
                      <p className="text-xs italic text-zinc-500">
                        Sin historial aún...
                      </p>
                    ) : (
                      [...detectionHistory].reverse().map((entry, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`rounded-md border p-2 text-xs ${
                            entry.action === "detected"
                              ? "border-green-400/40 bg-green-950/30"
                              : entry.action === "lost"
                                ? "border-red-400/40 bg-red-950/30"
                                : "border-blue-400/40 bg-blue-950/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {entry.action === "detected"
                                ? "🟢 Detectado"
                                : entry.action === "lost"
                                  ? "🔴 Perdido"
                                  : "🔵 Reconectado"}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-cyan-300">
                            {entry.deviceId.slice(0, 8)}
                          </p>
                          {entry.latitude && entry.longitude && (
                            <p className="mt-1 text-[10px] text-zinc-400">
                              {entry.latitude.toFixed(4)},{" "}
                              {entry.longitude.toFixed(4)}
                            </p>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* Modal: Aviso de pérdida de señal */}
      <AnimatePresence>
        {signalLostAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSignalLostAlert(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-2xl border border-red-500/40 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400">
                    Pérdida de Señal Detectada
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300">
                    Se perdió la conexión con el dispositivo{" "}
                    <code className="text-cyan-300">
                      {signalLostAlert.deviceId.slice(0, 8)}
                    </code>
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Última ubicación conocida:
                  </p>
                  <div className="mt-2 rounded bg-zinc-800/50 p-2 font-mono text-xs text-cyan-300">
                    <p>Lat: {signalLostAlert.latitude.toFixed(6)}</p>
                    <p>Lng: {signalLostAlert.longitude.toFixed(6)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setSignalLostAlert(null)}
                  className="rounded bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-600"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
