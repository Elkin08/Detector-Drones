import React from "react";
import { FiAlertCircle, FiX, FiCheckCircle } from "react-icons/fi";

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error"; // Nuevo prop para el tipo de alerta
}

export const Alert: React.FC<AlertProps> = ({
  message,
  onClose,
  type = "error",
}) => {
  // Configuración de estilos según el tipo
  const config =
    type === "success"
      ? {
          bgGradient: "from-teal-50 via-emerald-50 to-teal-50",
          iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
          iconColor: "text-white",
          titleColor: "text-teal-900",
          messageColor: "text-teal-700",
          buttonBg: "bg-gradient-to-r from-teal-600 to-emerald-600",
          buttonHover:
            "hover:from-teal-500 hover:to-emerald-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.6)]",
          borderGlow: "shadow-[0_0_40px_rgba(20,184,166,0.3)]",
          title: "¡Compra Exitosa!",
          icon: FiCheckCircle,
          particles: true,
        }
      : {
          bgGradient: "from-amber-50 via-yellow-50 to-amber-50",
          iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
          iconColor: "text-white",
          titleColor: "text-amber-900",
          messageColor: "text-amber-700",
          buttonBg: "bg-gradient-to-r from-amber-600 to-orange-600",
          buttonHover:
            "hover:from-amber-500 hover:to-orange-500 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]",
          borderGlow: "shadow-[0_0_40px_rgba(251,191,36,0.3)]",
          title: "⚠️ Atención",
          icon: FiAlertCircle,
          particles: false,
        };

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div
        className={`animate-scale-in relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br ${config.bgGradient} p-8 shadow-2xl ${config.borderGlow} border-2 border-white`}
      >
        {/* Partículas de confeti para success */}
        {config.particles && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-2 w-2 animate-bounce rounded-full bg-teal-400 opacity-70" />
            <div className="absolute right-[15%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-emerald-400 opacity-60" />
            <div className="absolute bottom-[25%] left-[20%] h-2 w-2 animate-bounce rounded-full bg-teal-500 opacity-50 delay-150" />
            <div className="absolute bottom-[35%] right-[25%] h-3 w-3 animate-pulse rounded-full bg-emerald-500 opacity-70 delay-300" />
          </div>
        )}

        {/* Ícono con animación */}
        <div className="mb-6 flex justify-center">
          <div
            className={`relative flex h-20 w-20 items-center justify-center rounded-full ${config.iconBg} animate-bounce shadow-2xl ring-4 ring-white`}
          >
            <IconComponent className={`h-10 w-10 ${config.iconColor}`} />
            {/* Resplandor pulsante */}
            <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-20" />
          </div>
        </div>

        {/* Contenido */}
        <div className="text-center">
          <h3 className={`mb-3 text-2xl font-extrabold ${config.titleColor}`}>
            {config.title}
          </h3>
          <p
            className={`mb-8 text-base leading-relaxed ${config.messageColor} font-medium`}
          >
            {message}
          </p>
        </div>

        {/* Botón Aceptar con efectos */}
        <button
          onClick={onClose}
          className={`group relative w-full overflow-hidden rounded-2xl ${config.buttonBg} px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 ${config.buttonHover}`}
        >
          <span className="relative z-10 text-lg">Aceptar</span>
          {/* Efecto de brillo */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          {/* Pulso de fondo */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </button>
      </div>
    </div>
  );
};
