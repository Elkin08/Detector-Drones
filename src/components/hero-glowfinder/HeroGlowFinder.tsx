import { useState, useEffect } from "react";

type HeroGlowFinderProps = {
  onSearch: (treatment: string, location: string) => void;
};

export const HeroGlowFinder = ({ onSearch }: HeroGlowFinderProps) => {
  const [treatment, setTreatment] = useState("");
  const [location, setLocation] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(treatment, location);
    // Scroll a la sección de gift cards cuando se busca
    const giftCardsSection = document.getElementById("gift-cards");
    if (giftCardsSection) {
      giftCardsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Navegación separada con fondo blanco que cambia a teal */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "border-teal-700 bg-teal-600 shadow-lg"
            : "border-gray-200 bg-white/95 shadow-sm"
        } backdrop-blur-sm`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Logo como texto grande */}
          <button
            onClick={scrollToTop}
            className="transition-opacity hover:opacity-80"
          >
            <span
              className={`text-xl font-bold transition-all duration-300 sm:text-2xl ${
                isScrolled ? "text-white drop-shadow-md" : "text-teal-600"
              }`}
            >
              GlowFinder
            </span>
          </button>
          {/* Menú hamburguesa para móviles */}
          <button
            className={`rounded-lg p-2 transition-colors md:hidden ${
              isScrolled
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Links de navegación con fuentes más grandes */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <button
              onClick={scrollToTop}
              className={`rounded-lg px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/10 hover:text-teal-100 hover:shadow-lg"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md"
              }`}
            >
              Home
            </button>
            <a
              href="#treatments"
              className={`rounded-lg px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/10 hover:text-teal-100 hover:shadow-lg"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md"
              }`}
            >
              Treatments
            </a>
            <a
              href="#gift-cards"
              className={`rounded-lg px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/10 hover:text-teal-100 hover:shadow-lg"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md"
              }`}
            >
              Gift Cards
            </a>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div
            className={`border-t transition-all duration-300 md:hidden ${
              isScrolled
                ? "border-teal-700 bg-teal-600"
                : "border-gray-200 bg-white/95"
            } backdrop-blur-sm`}
          >
            <div className="space-y-2 px-4 py-4">
              <button
                onClick={() => {
                  scrollToTop();
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full rounded-lg px-4 py-3 text-left text-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-white hover:bg-white/10 hover:text-teal-100"
                    : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                }`}
              >
                Home
              </button>
              <a
                href="#treatments"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full rounded-lg px-4 py-3 text-left text-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-white hover:bg-white/10 hover:text-teal-100"
                    : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                }`}
              >
                Treatments
              </a>
              <a
                href="#gift-cards"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full rounded-lg px-4 py-3 text-left text-lg font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-white hover:bg-white/10 hover:text-teal-100"
                    : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                }`}
              >
                Gift Cards
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden sm:h-[600px] lg:h-[700px]">
        {/* Imagen de fondo con efecto overlay */}
        <div className="group absolute inset-0">
          {/* Imagen del consultorio */}
          <img
            src="/spa.jpg"
            alt="Aesthetic Clinic"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay gradient oscuro */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />

          {/* Overlay que se intensifica en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Decorative floating elements */}
          <div className="absolute left-4 top-10 h-20 w-20 rounded-full bg-teal-400/20 blur-3xl transition-transform duration-700 group-hover:scale-150 sm:left-10 sm:top-20 sm:h-32 sm:w-32 lg:left-20" />
          <div className="absolute bottom-10 right-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl transition-transform duration-700 group-hover:scale-150 sm:bottom-20 sm:right-10 sm:h-40 sm:w-40 lg:right-20" />

          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </div>

        {/* Contenido encima de la imagen */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-teal-400 drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Gift Beauty and Wellness
            </h1>
            <p className="mt-4 text-lg text-white/90 drop-shadow-lg sm:mt-6 sm:text-xl">
              Gift cards for premium aesthetic treatments. The perfect
              experience for those you love.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4 lg:mt-10 lg:flex-row"
            >
              <input
                type="text"
                placeholder="Enter treatment or service"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="flex-1 rounded-xl border-2 border-white/30 bg-white/95 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-2xl backdrop-blur-sm transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/30 sm:px-5 sm:py-4"
              />
              <input
                type="text"
                placeholder="City or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 rounded-xl border-2 border-white/30 bg-white/95 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-2xl backdrop-blur-sm transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/30 sm:px-5 sm:py-4"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800 sm:px-8 sm:py-4 lg:px-10"
              >
                <span className="relative z-10">Search</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
