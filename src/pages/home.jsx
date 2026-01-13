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
        <title>Catleya Royal Club | Lujo y Naturaleza en [Tu Ubicación]</title>
        <meta
          name="description"
          content="Descubre el santuario privado de Catleya Royal Club. Experiencias de lujo, hospedaje exclusivo y reconexión natural. Reserva tu escapada hoy."
        />
        <link rel="canonical" href="https://tudominio.com/" />
        <meta
          property="og:title"
          content="Catleya Royal Club - Experiencia de Lujo"
        />
        <meta property="og:image" content="/images/about-catleya-4.webp" />
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
