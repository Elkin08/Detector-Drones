export const Features = () => {
  const features = [
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      title: "Browse Top Clinics",
      description: "Explore a curated directory of leading aesthetic clinics",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Book Appointments",
      description:
        "Schedule your next visit with ease, directly through our platform",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
      title: "Purchase Gift Cards",
      description:
        "Give the gift of beauty with convenient, digital gift cards",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <section
      id="features"
      className="bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-xl"
            >
              {/* Icon */}
              <div
                className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-4 text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-5`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
