// Configuración SEO centralizada
export const siteConfig = {
  name: "GlowFinder",
  title: "GlowFinder - Directorio de Clínicas Estéticas y Gift Cards",
  description:
    "Descubre las mejores clínicas estéticas y centros de belleza. Compra gift cards para tratamientos de belleza, spa y bienestar. Sistema seguro con códigos QR únicos.",
  url: "https://www.glowfinder.com",
  locale: "es_CO",
  siteName: "GlowFinder",
  keywords: [
    "clínicas estéticas",
    "gift cards",
    "centros de belleza",
    "spa",
    "tratamientos estéticos",
    "Colombia",
    "tarjetas regalo",
    "bienestar",
    "código QR",
    "gift cards digitales",
    "clínicas spa",
    "tratamientos faciales",
    "estética",
    "belleza",
    "cuidado personal",
  ],
  social: {
    whatsapp: "573106138120",
  },
  ogImage: "/og-image.jpg", // Deberás crear esta imagen
};

export const generateMetaTags = (options?: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) => {
  const title = options?.title
    ? `${options.title} | ${siteConfig.name}`
    : siteConfig.title;
  const description = options?.description || siteConfig.description;
  const image = options?.image || `${siteConfig.url}${siteConfig.ogImage}`;
  const url = options?.url || siteConfig.url;

  return {
    title,
    description,
    keywords: siteConfig.keywords.join(", "),
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.siteName,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Agrega aquí tus códigos de verificación cuando los tengas
      // google: 'tu-codigo-google',
      // yandex: 'tu-codigo-yandex',
      // bing: 'tu-codigo-bing',
    },
  };
};
