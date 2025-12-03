import ReservationForm from "../components/reservationForm";
import { useState } from "react";
import RoomListing from "../components/RoomsComponents/roomListing";

export default function Home() {
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(0);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    setTimeout(() => {
      setHasSearchResults(true);
      setIsSearching(false);
      setTimeout(() => {
        const resultsElement = document.getElementById("results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }, 1000);
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
          <source src="/videos/video1.mp4" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 container mx-auto max-w-[1200px] flex items-center justify-center py-20" id="disponibilidad">
          <div className="text-center w-full flex flex-col justify-center items-center text-white px-4">
            <h1 className=" text-4xl md:text-[60px] font-bold mb-8 leading-tight md:leading-[55px]">
              Tu refugio para desconectar del mundo y reconectar contigo mismo.
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-[600px]">
              Un santuario privado entre jardines ancestrales, donde cada
              detalle está diseñado para ofrecer una escapada de lujo íntimo.
            </p>

            <ReservationForm
              onSearch={handleSearch}
              isSearching={isSearching}
              setResults={setResults}
              setGuests={setGuests}
            />
          </div>
        </div>
      </section>
      {hasSearchResults && (
        <section id="results" className="w-full">
          <RoomListing results={results} guests={guests}/>
        </section>
      )}
      <section className="min-h-[800px] w-full">
        <h1>Esto es otra sección</h1>
      </section>
    </>
  );
}