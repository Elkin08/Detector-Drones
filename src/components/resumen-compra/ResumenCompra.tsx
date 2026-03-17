import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Infocomprador } from "@/components/info-comprador/Infocomprador";

type ResumenCompraProps = {
  onClose: () => void;
};

export const ResumenCompra = ({ onClose }: ResumenCompraProps) => {
  const { items, addToCart, removeFromCart, getTotalPrice, clearCart } =
    useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showEmptyCartAlert, setShowEmptyCartAlert] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      // Mostrar alerta elegante si el carrito está vacío
      setShowEmptyCartAlert(true);
      return;
    }
    setShowCheckout(true);
  };

  const handlePurchaseComplete = () => {
    clearCart();
    onClose();
  };

  const handleRemoveItem = (id: string) => {
    // Remover todas las cantidades del item
    const item = items.find((i) => i.id === id);
    if (item) {
      for (let i = 0; i < item.quantity; i++) {
        removeFromCart(id);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {showCheckout ? "Checkout" : "Shopping Cart"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 active:bg-gray-300 sm:h-8 sm:w-8 sm:bg-transparent sm:hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!showCheckout ? (
            <>
              {/* Lista de items */}
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all hover:border-teal-200 hover:bg-teal-50/50 sm:flex-row sm:gap-4 sm:p-4"
                  >
                    {/* Imagen */}
                    <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                      <img
                        src={item.image}
                        alt={item.treatment}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.treatment}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.clinicName}
                        </p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>

                      {/* Controles de cantidad y precio */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Botón menos */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-all hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>

                          {/* Cantidad */}
                          <span className="min-w-[2rem] text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          {/* Botón más */}
                          <button
                            onClick={() =>
                              addToCart({
                                id: item.id,
                                clinicName: item.clinicName,
                                treatment: item.treatment,
                                location: item.location,
                                price: item.price,
                                image: item.image,
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-all hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Precio y botón eliminar */}
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-teal-600">
                            ${item.price * item.quantity}
                          </span>

                          {/* Botón basura */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="group flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                          >
                            <svg
                              className="h-5 w-5 text-gray-400 transition-colors group-hover:text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total y botón de checkout */}
              <div className="mt-6 rounded-xl border-2 border-teal-600 bg-teal-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-3xl font-bold text-teal-600">
                    ${getTotalPrice()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800"
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Resumen antes del formulario */}
              <div className="mb-6 rounded-xl bg-teal-50 p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.treatment} x{item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-teal-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-teal-600">
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de información del comprador */}
              <Infocomprador
                onSuccess={handlePurchaseComplete}
                cartItems={items}
                total={getTotalPrice()}
              />
            </>
          )}
        </div>
      </div>

      {/* Alerta de carrito vacío */}
      {showEmptyCartAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-2xl border-2 border-pink-200 bg-white p-8 shadow-2xl">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-purple-100">
                <span className="text-3xl">🛒</span>
              </div>

              {/* Title */}
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Tu carrito está vacío
              </h3>

              {/* Message */}
              <p className="mb-6 text-gray-600">
                💎 Agrega algunas gift cards para continuar con el checkout y
                disfrutar de increíbles tratamientos de belleza.
              </p>

              {/* Buttons */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowEmptyCartAlert(false);
                    onClose(); // Cerrar modal para que puedan agregar items
                  }}
                  className="w-full transform rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
                >
                  ✨ Explorar Gift Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
