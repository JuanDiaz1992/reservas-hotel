import { useState, useEffect } from "react";
import AddsOnListing from "../components/CheckingComponents/addsOnListing";
import CheckOutCart from "../components/CheckingComponents/cartCheckOut";
import { scrollToTop } from "../utils/scrollToTop";
import FormCheckOut from "../components/CheckingComponents/formCheckOut";

export default function Checkout() {
  const [title, setTitle] = useState("Finaliza tu Reserva");
  const [view, setView] = useState(1);
  const [hasAddons, setHasAddons] = useState(true); // Estado compartido

  const handleLocationChange = () => {
    const path = window.location.pathname;
    if (path.includes("/details")) {
      setView(2);
    } else {
      setView(1);
    }
    scrollToTop();
  };

  useEffect(() => {
    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateViews = (data) => {
    setView(data);
    scrollToTop();
    if (data === 2) {
      window.history.pushState({}, "", "/checkout/details");
    } else {
      window.history.pushState({}, "", "/checkout");
    }
  };

  return (
    <div className="bg-gray-50">
      <header className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img
          src="/images/home-2.webp"
          alt="Lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-white text-5xl lg:text-6xl font-extrabold tracking-wide">
            Checkout
          </h1>
        </div>
      </header>

      <section className="container max-w-[1200px] mx-auto py-12">
        <h2 className="text-2xl md:text-4xl font-serif italic mb-8">{title}</h2>
        <div className="flex flex-col lg:flex-row gap-[24px]">
          <div className="w-full lg:w-8/12">
            {view === 1 ? (
              <AddsOnListing
                setTitle={setTitle}
                navigateViews={navigateViews}
                setHasAddons={setHasAddons}
              />
            ) : view === 2 ? (
              <FormCheckOut
                setTitle={setTitle}
                navigateViews={navigateViews}
                hasAddons={hasAddons}
              />
            ) : null}
          </div>
          <div className="w-full lg:w-4/12">
            <CheckOutCart view={view} setView={navigateViews} />
          </div>
        </div>
      </section>
    </div>
  );
}
