import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ResumenCompra } from "@/components/resumen-compra/ResumenCompra";

export const FloatingCartButton = () => {
  const { getTotalItems } = useCart();
  const [showResumen, setShowResumen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      {/* Botón flotante - siempre visible */}
      <button
        onClick={() => setShowResumen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-teal-700 hover:to-teal-800 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      >
        <svg
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {/* Badge con número de items - solo visible cuando hay items */}
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white ring-2 ring-white">
            {totalItems}
          </span>
        )}
      </button>

      {/* Modal de Resumen de Compra */}
      {showResumen && <ResumenCompra onClose={() => setShowResumen(false)} />}
    </>
  );
};
