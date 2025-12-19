import ReservationForm from "../reservationForm";
import RoomListing from "../RoomsComponents/roomListing";
import { useState } from "react";
import scrollToObject from "../../utils/scrollToObject";
export default function HeroSection() {
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(0);
  const onSearch = async (searchData) => {
    console.log(searchData);
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
      <section className="relative pt-[80px] pb-[60px]">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
        <div
          className="relative z-10 container mx-auto max-w-[1200px] flex items-center justify-center py-20"
          id="disponibilidad"
        >
          <div className="text-center w-full flex flex-col justify-center items-center text-white px-4">
            <h1 className=" text-4xl md:text-[60px] font-bold mb-8 leading-tight md:leading-[55px]">
              Tu refugio para desconectar del mundo y reconectar contigo mismo.
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-[600px]">
              Un santuario privado entre jardines ancestrales, donde cada
              detalle está diseñado para ofrecer una escapada de lujo íntimo.
            </p>
            <ReservationForm
              onSearch={onSearch}
              isSearching={isSearching}
              setGuests={setGuests}
            />
          </div>
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
