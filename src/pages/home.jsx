import { useState, lazy, Suspense } from "react";
import { galleryImages, testimonials } from "../data";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/HomeComponents/HeroSection";
import PhilosophySection from "../components/HomeComponents/PhilosophySection";
import ExperiencesSection from "../components/HomeComponents/ExperiencesSection";
import TestimonialsSection from "../components/HomeComponents/TestimonialsSection";
import LocationSection from "../components/HomeComponents/LocationSection";
import AboutUsSection from "../components/HomeComponents/AboutUsSection";
const GallerySection = lazy(
  () => import("../components/HomeComponents/GallerySection")
);

export default function Home() {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const initialPhotosCount = 9;
  const visiblePhotos = showAllPhotos
    ? galleryImages
    : galleryImages.slice(0, initialPhotosCount);

  const getGridClass = (index) => {
    const patternIndex = index % 6;
    if (patternIndex === 0) return "md:col-span-2 md:row-span-2";
    if (patternIndex === 3) return "md:col-span-2";
    return "col-span-1";
  };

  return (
    <main>
      <Helmet>
        <title>
          Catleya Royal Club | Hotel de Lujo y Eventos en el Eje Cafetero
        </title>

        <meta
          name="description"
          content="Descubra Catleya Royal Club en Pereira. Un refugio de lujo sereno en el Eje Cafetero con hospedaje exclusivo, gastronomía de autor y escenarios inolvidables para eventos y bodas."
        />

        <link rel="canonical" href="https://catleyaroyalclub.com/" />

        <meta
          property="og:title"
          content="Catleya Royal Club | Refugio de Lujo Sereno"
        />
        <meta
          property="og:description"
          content="Hospedaje de alta gama, experiencias gastronómicas y eventos memorables en el corazón del Eje Cafetero."
        />
        <meta
          property="og:image"
          content="https://catleyaroyalclub.com/images/about-catleya-4.webp"
        />
        <meta property="og:url" content="https://catleyaroyalclub.com/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hotel",
            name: "Catleya Royal Club",
            description:
              "Refugio de lujo sereno en Pereira, Eje Cafetero. Hospedaje exclusivo y experiencias naturales.",
            image: "https://catleyaroyalclub.com/images/about-catleya-4.webp",
            url: "https://catleyaroyalclub.com/",
            telephone: "+573215957743",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Vereda Pénjamo | Corregimiento de Combia | Finca La Waira",
              addressLocality: "Pereira",
              addressRegion: "Risaralda",
              addressCountry: "CO",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 4.866159798434354,
              longitude: -75.7453277191281,
            },
            priceRange: "$450,000 - $500,000 COP por noche",
            amenityFeature: [
              {
                "@type": "LocationFeatureSpecification",
                name: "Naturaleza",
                value: true,
              },
              {
                "@type": "LocationFeatureSpecification",
                name: "Lujo Sostenible",
                value: true,
              },
            ],
          })}
        </script>
      </Helmet>
      <HeroSection />
      <AboutUsSection />
      <PhilosophySection />
      <ExperiencesSection />
      <Suspense fallback={<div>Cargando...</div>}>
        <GallerySection
          visiblePhotos={visiblePhotos}
          showAllPhotos={showAllPhotos}
          setShowAllPhotos={setShowAllPhotos}
          getGridClass={getGridClass}
        />
      </Suspense>

      <LocationSection />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
