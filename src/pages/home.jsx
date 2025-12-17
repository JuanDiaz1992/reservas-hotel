import { useState } from "react";
import RoomListing from "../components/RoomsComponents/roomListing";
import { galleryImages, testimonials } from "../data";

import HeroSection from "../components/HomeComponents/HeroSection";
import PhilosophySection from "../components/HomeComponents/PhilosophySection";
import ExperiencesSection from "../components/HomeComponents/ExperiencesSection";
import TestimonialsSection from "../components/HomeComponents/TestimonialsSection";
import GallerySection from "../components/HomeComponents/GallerySection";
import LocationSection from "../components/HomeComponents/LocationSection";
import AboutUsSection from "../components/HomeComponents/AboutUsSection";

export default function Home() {
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const initialPhotosCount = 9;
  const visiblePhotos = showAllPhotos
    ? galleryImages
    : galleryImages.slice(0, initialPhotosCount);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    setTimeout(() => {
      setHasSearchResults(true);
      setIsSearching(false);
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1000);
  };

  const getGridClass = (index) => {
    const patternIndex = index % 6;
    if (patternIndex === 0) return "md:col-span-2 md:row-span-2";
    if (patternIndex === 3) return "md:col-span-2";
    return "col-span-1";
  };

  return (
    <>
      <HeroSection
        onSearch={handleSearch}
        isSearching={isSearching}
        setResults={setResults}
        setGuests={setGuests}
      />
      {hasSearchResults && (
        <section id="results" className="w-full">
          <RoomListing results={results} guests={guests} />
        </section>
      )}
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
