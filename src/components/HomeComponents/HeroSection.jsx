"use client";

import ReservationForm from "../reservationForm";
import RoomListing from "../RoomsComponents/roomListing";
import { useState } from "react";
import scrollToObject from "../../utils/scrollToObject";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(0);

  const onSearch = async (searchData) => {
    if (searchData.length > 0) {
      setIsSearching(true);
      setResults(searchData);
      setTimeout(() => {
        setHasSearchResults(true);
        setIsSearching(false);
        setTimeout(() => {
          scrollToObject("results");
        }, 100);
      }, 1000);
    } else {
      setHasSearchResults(true);
      setResults([]);
      setTimeout(() => {
        scrollToObject("no-results");
      }, 100);
    }
  };

  return (
    <>
      <section className="relative pt-[80px] pb-[60px] min-h-[80vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-label="Video ambiental experiencia Catleya"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
        </video>

        <div className="hidden md:block absolute inset-0 w-full h-full">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/images/banner-1.webp"
            className="w-full h-full object-cover"
            alt="Jardines y arquitectura de lujo en Catleya Royal Club Pereira"
            fetchpriority="high"
          />
        </div>

        <div className="absolute inset-0 bg-black/40"></div>

        <div
          className="relative z-10 container mx-auto max-w-[1200px] flex items-center justify-center py-20"
          id="disponibilidad"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center w-full flex flex-col justify-center items-center text-white px-4"
          >
            <h1 className="text-4xl md:text-[60px] font-bold mb-8 leading-tight md:leading-[55px] drop-shadow-lg">
              Tu refugio para desconectar del mundo y reconectar contigo mismo.
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-[600px] drop-shadow-md">
              Un santuario privado entre jardines ancestrales, donde cada
              detalle está diseñado para ofrecer una escapada de lujo íntimo.
            </p>
            {/* Formulario sin envoltorios extra para mantener el tamaño original */}
            <ReservationForm
              onSearch={onSearch}
              isSearching={isSearching}
              setGuests={setGuests}
            />
          </motion.div>
        </div>
      </section>

      {hasSearchResults && (
        <section id="results" className="w-full">
          <RoomListing results={results} guests={guests} />
        </section>
      )}
    </>
  );
}