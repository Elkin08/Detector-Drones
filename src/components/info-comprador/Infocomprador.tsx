import React, { useState } from "react";
import { GiftCardItem } from "@/context/CartContext";
import { Alert } from "@/components/shared/Alert";

interface FieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  numericOnly?: boolean;
  lettersOnly?: boolean;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface InfocompradorProps {
  onSuccess: () => void;
  cartItems: GiftCardItem[];
  total: number;
}

export const Infocomprador: React.FC<InfocompradorProps> = ({
  onSuccess,
  cartItems,
  total,
}) => {
  const [formData, setFormData] = useState({
    cc: "",
    nombre: "",
    email: "",
    telefono: "",
  });
  const [aceptaProteccionDatos, setAceptaProteccionDatos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState("");
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "error" });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertConfig({ show: true, message, type });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validar si todos los campos están completos
  const isFormComplete = () => {
    return (
      formData.cc.trim() !== "" &&
      formData.nombre.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.telefono.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aceptaProteccionDatos) {
      showAlert(
        "Para garantizar la seguridad de tus datos y completar tu compra, necesitamos que aceptes nuestra política de protección de datos personales.",
        "error"
      );
      return;
    }

    // Mostrar modal de confirmación de email
    setShowEmailConfirm(true);
  };

  const handleConfirmEmail = async () => {
    if (emailConfirm !== formData.email) {
      showAlert(
        "Los correos electrónicos no coinciden. Por favor, verifica que ambos emails sean idénticos antes de continuar.",
        "error"
      );
      return;
    }

    setShowEmailConfirm(false);
    setIsSubmitting(true);

    try {
      console.log("🛒 Procesando compra de gift cards...");

      // Registrar en Airtable via API route
      const response = await fetch("/api/crear-giftcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cc: formData.cc,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          items: cartItems.map((item) => ({
            id: item.id,
            clinicName: item.clinicName,
            treatment: item.treatment,
            location: item.location,
            price: item.price,
            quantity: item.quantity,
          })),
          total: total,
        }),
      });

      const airtableResult = await response.json();

      if (!response.ok || !airtableResult.success) {
        throw new Error(
          airtableResult.error || "Error al registrar en Airtable"
        );
      }

      console.log(
        "✅ Gift cards registradas en Airtable:",
        airtableResult.giftCards?.length
      );

      // Enviar email con las gift cards
      console.log("📧 Enviando email con gift cards...");
      const emailResponse = await fetch("/api/enviar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCliente: formData.nombre,
          email: formData.email,
          giftCards: airtableResult.giftCards,
          totalCompra: `$${total.toLocaleString("es-CO")}`,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok || !emailResult.success) {
        console.error("⚠️ Error al enviar email:", emailResult.error);
        showAlert(
          `¡Gift cards creadas exitosamente! Sin embargo, hubo un problema al enviar el email. Por favor contacta con soporte mencionando tu nombre: ${formData.nombre}`,
          "error"
        );
        return;
      }

      console.log("✅ Email enviado exitosamente");

      showAlert(
        `🎉 ¡Compra registrada exitosamente!\n\n📧 Recibirás ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} gift card(s) en tu correo ${formData.email}\n\n⏰ IMPORTANTE: Tienes 24 horas para confirmar el pago por WhatsApp. Después de ese tiempo, los códigos QR se desactivarán automáticamente.\n\n💳 Estado: PENDIENTE (hasta confirmar pago)`,
        "success"
      );

      // No ejecutar onSuccess() automáticamente - dejar que el usuario cierre el alert
    } catch (error: any) {
      console.error("❌ Error al procesar compra:", error);
      showAlert(
        error.message ||
          "Hubo un problema al procesar tu compra. Por favor, intenta nuevamente o contacta con nuestro soporte.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      {/* Contenido */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4">
        {/* Títulos */}
        <div className="max-w-2xl text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Información del comprador
          </h2>
          <p className="text-sm text-gray-600 md:text-base">
            Estos datos se usarán para enviarte tus gift cards por email.
          </p>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="grid w-full gap-4 text-sm md:grid-cols-4"
          >
            {/* CC */}
            <Field
              label="CC"
              placeholder="Número de documento"
              required
              numericOnly
              value={formData.cc}
              onChange={(value) => handleFormChange("cc", value)}
            />

            {/* Nombre */}
            <Field
              label="Nombre completo"
              placeholder="Tu nombre y apellidos"
              required
              lettersOnly
              value={formData.nombre}
              onChange={(value) => handleFormChange("nombre", value)}
            />

            {/* Email */}
            <Field
              label="Email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
              value={formData.email}
              onChange={(value) => handleFormChange("email", value)}
            />

            {/* Teléfono */}
            <Field
              label="Teléfono"
              placeholder="Número de contacto"
              type="tel"
              required
              numericOnly
              value={formData.telefono}
              onChange={(value) => handleFormChange("telefono", value)}
            />
          </form>
        </div>

        {/* Protección de datos */}
        <div className="w-full max-w-4xl">
          <div className="rounded-xl border-2 border-teal-200 bg-white p-4 shadow-md">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={aceptaProteccionDatos}
                onChange={(e) => setAceptaProteccionDatos(e.target.checked)}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600 transition-colors focus:ring-2 focus:ring-teal-500/50"
              />
              <span className="flex-1 text-xs leading-relaxed text-gray-700">
                Acepto el tratamiento de mis datos personales de acuerdo con la{" "}
                <strong className="text-gray-900">
                  Ley 1581 de 2012 de Protección de Datos Personales
                </strong>{" "}
                de Colombia. Autorizo el uso de mi información para el
                procesamiento de la compra, generación de gift cards y envío por
                email. Mis datos serán almacenados de forma segura y no serán
                compartidos con terceros sin mi consentimiento.
              </span>
            </label>
          </div>
        </div>

        {/* Botón de compra con efecto brillante - solo activo si completan campos */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormComplete() || isSubmitting}
          className="group relative w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-teal-500 hover:to-emerald-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="relative z-10">
            {isSubmitting ? "Procesando..." : `Comprar por $${total}`}
          </span>
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </button>

        <p className="text-center text-xs text-gray-500">
          Todos los campos son obligatorios para completar la compra.
        </p>
      </div>

      {/* Modal de confirmación de email */}
      {showEmailConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <svg
                  className="h-8 w-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Confirmar Email
              </h3>
              <p className="text-sm text-gray-600">
                Por favor, confirma tu correo electrónico para continuar con la
                compra.
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Confirmar Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Confirma tu correo"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailConfirm(false);
                  setEmailConfirm("");
                }}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEmail}
                className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-teal-500 hover:to-emerald-500"
              >
                <span className="relative z-10">Confirmar</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      {alertConfig.show && (
        <Alert
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => {
            setAlertConfig({ ...alertConfig, show: false });
            // Si es alerta de éxito, ejecutar onSuccess al cerrar
            if (alertConfig.type === "success") {
              onSuccess();
            }
          }}
        />
      )}
    </section>
  );
};
/* -------------------------------------------------- */
/* CAMPO DEL FORMULARIO                               */
/* -------------------------------------------------- */

const Field = ({
  label,
  placeholder,
  type = "text",
  required = false,
  numericOnly = false,
  lettersOnly = false,
  value,
  onChange,
  disabled = false,
}: FieldProps) => {
  const [error, setError] = React.useState<string>("");

  const handleChange = (val: string) => {
    setError("");

    if (numericOnly) {
      if (/[^0-9]/.test(val)) {
        setError("Solo se permiten números");
      }
      val = val.replace(/[^0-9]/g, "");
    }

    if (lettersOnly) {
      if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(val)) {
        setError("Solo se permiten letras");
      }
      val = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
    }

    onChange(val);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* LABEL */}
      <label className="text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* INPUT */}
      <input
        type={numericOnly ? "text" : type}
        inputMode={numericOnly ? "numeric" : undefined}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full rounded-lg border-2 
          bg-white px-3 py-2 
          text-sm text-gray-900 placeholder-gray-400 
          shadow-sm
          transition-all 
          focus:outline-none 
          focus:ring-2 
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
              : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/30"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      />

      {/* ERROR MESSAGE */}
      {error && (
        <span className="animate-scale-in text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};
