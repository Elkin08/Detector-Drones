import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { font } from "@/fonts";
import { generateMetaTags } from "@/lib/seo";

interface GiftCardInfo {
  codigoCard: string;
  codigoReferencia: string;
  nombreClinica: string;
  tratamiento: string;
  precioUnitario: string;
  nombreCompleto: string;
  cedula: string;
  email: string;
  telefono: string;
  fechaCompra: string;
  horaCompra: string;
  estadoPago: string;
  qrActivo: boolean;
}

export default function VerificarGiftCard() {
  const router = useRouter();
  const { codigo } = router.query;
  const [giftCard, setGiftCard] = useState<GiftCardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const metaTags = generateMetaTags({
    title: "Verificar Gift Card - GlowFinder",
    description:
      "Verifica la autenticidad de tu gift card para tratamientos estéticos en clínicas afiliadas.",
  });

  // Función para verificar/actualizar código
  const verificarCodigo = async () => {
    if (!codigo || typeof codigo !== "string") return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/verificar-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setGiftCard(data.giftCard);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setGiftCard(null);
        setError(
          data.message || "Código de gift card no válido o no encontrado"
        );
      }
    } catch (error) {
      setGiftCard(null);
      setError("Error al verificar el código. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || !codigo || typeof codigo !== "string") {
      setError("Código de gift card no válido");
      setLoading(false);
      return;
    }
    verificarCodigo();
    // eslint-disable-next-line
  }, [router.isReady, codigo]);

  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main
        className={`${font.className} flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4`}
      >
        <div className="w-full max-w-2xl">
          {loading && (
            <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-lg">
              <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-teal-400"></div>
              <p className="text-xl font-semibold text-teal-700">
                Verificando gift card...
              </p>
            </div>
          )}
          {!loading && error && (
            <div className="rounded-2xl border-2 border-rose-400/60 bg-white/10 p-8 shadow-xl backdrop-blur-lg">
              <div className="text-center">
                <div className="mb-4 text-6xl">❌</div>
                <h2 className="mb-4 text-2xl font-bold text-rose-700">
                  QR inválido o eliminado
                </h2>
                <p className="mb-6 text-lg font-semibold text-rose-600">
                  {error}
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3 font-semibold text-white transition-all hover:from-rose-600 hover:to-amber-600"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          )}
          {!loading && giftCard && (
            <div className="rounded-2xl border-2 border-teal-200 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
              <div className="mb-8 text-center">
                <div className="mb-4 text-6xl">✅</div>
                <h1 className="mb-4 text-3xl font-bold text-teal-700">
                  Gift Card Verificada
                </h1>
                <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${giftCard.qrActivo ? "bg-teal-500" : "bg-amber-500"}`}
                  >
                    <span>{giftCard.qrActivo ? "✓" : "✕"}</span>
                    {giftCard.qrActivo ? "Activa" : "Inactiva"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${giftCard.estadoPago === "Pagado" ? "bg-emerald-500" : "bg-amber-500"}`}
                  >
                    {giftCard.estadoPago}
                  </span>
                </div>
                {lastUpdated && (
                  <p className="mb-4 text-sm text-teal-700">
                    Última actualización: {lastUpdated}
                  </p>
                )}
                <button
                  onClick={verificarCodigo}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loading ? "Actualizando..." : "Actualizar Estado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border border-teal-200 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-teal-700">
                    Información del Tratamiento
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-teal-600">Clínica</p>
                      <p className="text-xl font-bold text-teal-900">
                        {giftCard?.nombreClinica}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-teal-600">Tratamiento</p>
                      <p className="text-xl font-bold text-teal-900">
                        {giftCard?.tratamiento}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-teal-600">Valor</p>
                      <p className="text-2xl font-bold text-emerald-500">
                        {giftCard?.precioUnitario}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-teal-600">
                        Fecha de Compra
                      </p>
                      <p className="text-lg font-semibold text-teal-900">
                        {giftCard?.fechaCompra}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-teal-200 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-teal-700">
                    Información del Comprador
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-teal-600">Nombre</p>
                      <p className="text-lg font-semibold text-teal-900">
                        {giftCard?.nombreCompleto}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-teal-600">Email</p>
                      <p className="text-lg font-semibold text-teal-900">
                        {giftCard?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-teal-200 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-teal-700">
                    Códigos de Verificación
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-sm text-teal-600">
                        Código de Gift Card
                      </p>
                      <p className="rounded bg-black/30 px-3 py-2 font-mono text-teal-100">
                        {giftCard?.codigoCard}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-teal-600">
                        Código de Referencia
                      </p>
                      <p className="rounded bg-black/30 px-3 py-2 font-mono text-teal-100">
                        {giftCard?.codigoReferencia}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-emerald-700"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
