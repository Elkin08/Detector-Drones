// pages/index.tsx
import { useState } from "react";
import Head from "next/head";
import { HeroGlowFinder } from "@/components/hero-glowfinder/HeroGlowFinder";
import { PopularTreatments } from "@/components/popular-treatments/PopularTreatments";
import { GiftCards } from "@/components/gift-cards/GiftCards";
import { FloatingCartButton } from "@/components/floating-cart-button/FloatingCartButton";
import { font } from "@/fonts";
import { generateMetaTags, siteConfig } from "@/lib/seo";

export default function Home() {
  const metaTags = generateMetaTags();
  const [searchFilters, setSearchFilters] = useState({
    treatment: "",
    location: "",
  });

  const handleSearch = (treatment: string, location: string) => {
    setSearchFilters({ treatment, location });
  };

  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />

        {/* Open Graph */}
        <meta property="og:type" content={metaTags.openGraph.type} />
        <meta property="og:locale" content={metaTags.openGraph.locale} />
        <meta property="og:url" content={metaTags.openGraph.url} />
        <meta property="og:site_name" content={metaTags.openGraph.siteName} />
        <meta property="og:title" content={metaTags.openGraph.title} />
        <meta
          property="og:description"
          content={metaTags.openGraph.description}
        />
        <meta property="og:image" content={metaTags.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metaTags.openGraph.images[0].width.toString()}
        />
        <meta
          property="og:image:height"
          content={metaTags.openGraph.images[0].height.toString()}
        />
        <meta
          property="og:image:alt"
          content={metaTags.openGraph.images[0].alt}
        />

        {/* Twitter */}
        <meta name="twitter:card" content={metaTags.twitter.card} />
        <meta name="twitter:title" content={metaTags.twitter.title} />
        <meta
          name="twitter:description"
          content={metaTags.twitter.description}
        />
        <meta name="twitter:image" content={metaTags.twitter.images[0]} />

        {/* Robots */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Canonical */}
        <link rel="canonical" href={siteConfig.url} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#0d9488" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="author" content="GlowFinder" />
      </Head>

      <main
        className={`${font.className} min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50`}
      >
        <HeroGlowFinder onSearch={handleSearch} />
        <PopularTreatments />
        <GiftCards searchFilters={searchFilters} />

        {/* Botón flotante del carrito */}
        <FloatingCartButton />
      </main>
    </>
  );
}
