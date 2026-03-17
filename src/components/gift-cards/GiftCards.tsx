// src/components/gift-cards/GiftCards.tsx
import React, { useMemo } from "react";
import { useCart } from "@/context/CartContext";

export type GiftCardData = {
  id: string;
  clinicName: string;
  location: string;
  city: string;
  state: string;
  treatments: string;
  rating: number;
  reviews: number;
  price: number;
  image?: string;
};

type GiftCardsProps = {
  searchFilters?: { treatment: string; location: string };
};

export const GiftCards: React.FC<GiftCardsProps> = ({ searchFilters }) => {
  const { addToCart } = useCart();

  // Función para obtener la imagen según el tratamiento
  const getImageForTreatment = (treatment: string): string => {
    const treatmentLower = treatment.toLowerCase();
    if (treatmentLower.includes("botox")) return "/botox.jpg";
    if (treatmentLower.includes("medical")) return "/medical.jpg";
    if (treatmentLower.includes("skin")) return "/skin.png";
    if (treatmentLower.includes("laser")) return "/laser.jpg";
    return "/spa.jpg"; // imagen por defecto
  };

  const allGiftCards: GiftCardData[] = [
    {
      id: "radiant-aesthetics",
      clinicName: "Radiant Aesthetics",
      location: "Dallas, TX",
      city: "Dallas",
      state: "TX",
      treatments: "Botox & Fillers",
      rating: 4.9,
      reviews: 245,
      price: 150,
    },
    {
      id: "serene-medspa",
      clinicName: "Serene Med Spa",
      location: "Phoenix, AZ",
      city: "Phoenix",
      state: "AZ",
      treatments: "Medical Spa",
      rating: 4.8,
      reviews: 189,
      price: 200,
    },
    {
      id: "glow-aesthetic-center",
      clinicName: "Glow Aesthetic Center",
      location: "Miami, FL",
      city: "Miami",
      state: "FL",
      treatments: "Skin Rejuvenation",
      rating: 4.7,
      reviews: 312,
      price: 175,
    },
    {
      id: "bella-medical-spa",
      clinicName: "Bella Medical Spa",
      location: "Seattle, WA",
      city: "Seattle",
      state: "WA",
      treatments: "Laser Treatments",
      rating: 4.9,
      reviews: 428,
      price: 225,
    },
  ];

  // Filtrar tarjetas según búsqueda
  const filteredCards = useMemo(() => {
    if (
      !searchFilters ||
      (!searchFilters.treatment && !searchFilters.location)
    ) {
      return allGiftCards;
    }

    return allGiftCards.filter((card) => {
      const matchesTreatment =
        !searchFilters.treatment ||
        card.treatments
          .toLowerCase()
          .includes(searchFilters.treatment.toLowerCase());

      const matchesLocation =
        !searchFilters.location ||
        card.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase()) ||
        card.city
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase()) ||
        card.state.toLowerCase().includes(searchFilters.location.toLowerCase());

      return matchesTreatment && matchesLocation;
    });
  }, [searchFilters]);

  return (
    <section
      id="gift-cards"
      className="bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Aesthetic Centers Directory
          </h2>
          {searchFilters &&
            (searchFilters.treatment || searchFilters.location) && (
              <p className="text-lg text-gray-600">
                {filteredCards.length}{" "}
                {filteredCards.length === 1 ? "result" : "results"} found
                {searchFilters.treatment && ` for "${searchFilters.treatment}"`}
                {searchFilters.location && ` in "${searchFilters.location}"`}
              </p>
            )}
        </div>

        {/* Grid de Gift Cards - responsive */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl sm:rounded-3xl"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-4">
                  {/* Imagen del tratamiento */}
                  <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-40 sm:rounded-2xl">
                    <img
                      src={getImageForTreatment(card.treatments)}
                      alt={card.treatments}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {/* Header con nombre y gift icon */}
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                          {card.clinicName}
                        </h3>
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 sm:h-10 sm:w-10">
                          <svg
                            className="h-5 w-5 text-white sm:h-6 sm:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Ubicación */}
                      <p className="mb-2 text-sm text-gray-600">
                        {card.location}
                      </p>

                      {/* Tratamientos */}
                      <p className="mb-2 text-sm text-gray-700">
                        {card.treatments}
                      </p>

                      {/* Precio */}
                      <p className="mb-2 text-2xl font-bold text-teal-600">
                        ${card.price}
                      </p>

                      {/* Rating */}
                      <div className="mb-3 flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(card.rating)
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm font-bold text-gray-900">
                          {card.rating}
                        </span>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button className="group/btn relative flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:rounded-xl sm:px-4 sm:py-2.5">
                        <span className="relative z-10">Book Appointment</span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                      </button>
                      <button
                        onClick={() =>
                          addToCart({
                            id: card.id,
                            clinicName: card.clinicName,
                            treatment: card.treatments,
                            location: card.location,
                            price: card.price,
                            image: getImageForTreatment(card.treatments),
                          })
                        }
                        className="group/btn relative flex-1 overflow-hidden rounded-lg border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-white px-3 py-2 text-sm font-semibold text-amber-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-amber-600 hover:from-amber-100 hover:to-amber-50 hover:shadow-xl sm:rounded-xl sm:px-4 sm:py-2.5"
                      >
                        <span className="relative z-10">Buy Gift Card</span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              No results found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
