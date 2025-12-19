import { useState } from "react";
import { galleryImages, testimonials } from "../data";

import HeroSection from "../components/HomeComponents/HeroSection";
import PhilosophySection from "../components/HomeComponents/PhilosophySection";
import ExperiencesSection from "../components/HomeComponents/ExperiencesSection";
import TestimonialsSection from "../components/HomeComponents/TestimonialsSection";
import GallerySection from "../components/HomeComponents/GallerySection";
import LocationSection from "../components/HomeComponents/LocationSection";
import AboutUsSection from "../components/HomeComponents/AboutUsSection";

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
    <>
      <HeroSection />
      <AboutUsSection />
      <PhilosophySection />
      <ExperiencesSection />
      <GallerySection
        visiblePhotos={visiblePhotos}
        showAllPhotos={showAllPhotos}
        setShowAllPhotos={setShowAllPhotos}
        getGridClass={getGridClass}
      />
      <LocationSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
