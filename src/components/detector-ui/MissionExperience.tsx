import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type View = "home" | "detection" | "tracking";

export const MissionExperience = () => {
  const [view, setView] = useState<View>("home");
  const [signalLost, setSignalLost] = useState(false);

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

                <motion.div
                  className="absolute"
                  animate={{ x: [70, -55, 40, 70], y: [-65, 25, 70, -65] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <img
                    src="/drone.svg"
                    alt="Objetivo detectado"
                    className="h-12 w-12 opacity-90"
                  />
                </motion.div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Modo Escaneo
                </p>
                <h2 className="text-2xl font-black text-red-400 md:text-3xl">
                  Barrido activo y adquisición
                </h2>
                <p className="text-sm text-zinc-300 md:text-base">
                  La interfaz reproduce ondas, pulsos y barrido angular para una
                  transición cinematográfica hacia seguimiento.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSignalLost(false);
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
                  onClick={() => setSignalLost(true)}
                  className="rounded-md border border-red-400 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                >
                  Simular pérdida
                </button>
                <button
                  onClick={() => setView("detection")}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200"
                >
                  Radar
                </button>
              </div>
            </div>

            <div className="bg-map-grid relative h-[360px] overflow-hidden rounded-2xl border border-cyan-500/30">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points="8,80 18,68 30,70 42,58 52,62 64,48 74,52 88,35"
                  fill="none"
                  stroke="rgba(34,211,238,0.7)"
                  strokeWidth="0.7"
                  strokeDasharray="2 2"
                />
              </svg>

              <motion.div
                className="absolute h-4 w-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.95)]"
                animate={{
                  left: ["8%", "18%", "30%", "42%", "52%", "64%", "74%", "88%"],
                  top: ["80%", "68%", "70%", "58%", "62%", "48%", "52%", "35%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <div className="absolute bottom-3 left-3 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-200">
                Señal: {signalLost ? "Perdida" : "Estable"}
              </div>
            </div>

            {signalLost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-zinc-950/85"
              >
                <div className="rounded-xl border border-red-500/40 bg-zinc-900 p-6 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-red-300">
                    Enlace interrumpido
                  </p>
                  <h3 className="mt-2 text-xl font-black text-zinc-100">
                    Conexión perdida con el dron
                  </h3>
                  <button
                    onClick={() => setSignalLost(false)}
                    className="mt-4 rounded-md border border-cyan-300 bg-cyan-300/20 px-6 py-2 font-semibold text-cyan-100 transition hover:scale-[1.03]"
                  >
                    Reconectar
                  </button>
                </div>
              </motion.div>
            )}
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
};
