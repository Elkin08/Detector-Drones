// Configuración SEO centralizada
export const siteConfig = {
  name: "Detector de Drones",
  title: "Detector de Drones - Demo de Detección y Seguimiento",
  description:
    "Plataforma demo para simular detección de drones en red local, escaneo táctico y seguimiento en tiempo real.",
  url: "https://detector-drones.local",
  locale: "es_CO",
  siteName: "Detector de Drones",
  keywords: [
    "detector de drones",
    "rastreo en tiempo real",
    "radar táctico",
    "seguridad perimetral",
    "simulación de detección",
    "next.js",
    "react",
    "telemetría",
    "seguimiento de objetivos",
    "vigilancia tecnológica",
  ],
  social: {
    whatsapp: "",
  },
  ogImage: "/og-image.jpg",
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
