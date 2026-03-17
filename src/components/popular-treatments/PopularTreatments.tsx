export const PopularTreatments = () => {
  const treatments = [
    {
      icon: "💉",
      name: "Botox",
      description: "Smooth wrinkles, and fine lines with expert injectables",
    },
    {
      icon: "👄",
      name: "Dermal Fillers",
      description: "Restore volume and enhance facial contours with fillers",
    },
    {
      icon: "🪒",
      name: "Laser Hair Removal",
      description:
        "Achieve long lasting hair reduction with advanced laser technology",
    },
    {
      icon: "💧",
      name: "Chemical Peels",
      description:
        "Reveal fresher, clear skin with professional peeling treatments",
    },
  ];

  return (
    <section
      id="treatments"
      className="bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Popular Treatments
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most sought-after aesthetic procedures
          </p>
        </div>

        {/* Treatments Grid - 2x2 en móvil, 4 columnas en desktop */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border-2 border-teal-200/50 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-teal-400 hover:shadow-2xl sm:rounded-3xl sm:p-6 md:p-8"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-transparent to-emerald-50 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon */}
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-2xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl sm:text-4xl md:h-20 md:w-20 md:text-5xl">
                {treatment.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="mb-2 text-sm font-bold text-gray-900 sm:mb-3 sm:text-lg md:text-xl">
                  {treatment.name}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {treatment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
