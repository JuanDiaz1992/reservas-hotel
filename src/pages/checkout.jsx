import AddsOnListing from "../components/CheckingComponents/addsOnListing";
import CheckOutCart from "../components/CheckingComponents/cartCheckOut";
import { useState, useEffect } from "react";
import { scrollToTop } from '../utils/scrollToTop';
import FormCheckOut from "../components/CheckingComponents/formCheckOut";
export default function Checkout() {
  const [title, setTitle] = useState("Finaliza tu Reserva");
  const [view, setView] = useState(1);
  useEffect(() => {
        scrollToTop();
    }, []);
  const navigateViews =(view)=>{
    setView(view);
    scrollToTop();
  }
  return (
    <div className="bg-gray-50">
      <header className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596436889146-c215d2a21b33?q=80&w=2000&auto=format&fit=crop"
          alt="Habitación de hotel lujosa"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-5xl lg:text-6xl font-extrabold tracking-wide">
            Checkout
          </h1>
        </div>
      </header>

      <section className="container max-w-[1200px] mx-auto py-12">
        <h2 className="text-2xl md:text-4xl font-serif italic leading-relaxed max-w-4xl mx-auto mb-8">{title}</h2>
        <div className=" flex gap-[24px]  ">
          <div className="w-8/12">
            {view === 1 ?(
              <AddsOnListing setTitle={setTitle}/>
              ):
              view === 2 ? (
                <FormCheckOut setTitle={setTitle} navigateViews={navigateViews}/>
              ):(<></>)}
          </div>
          <div className="w-4/12">
            <CheckOutCart view={view} setView={setView} />
          </div>
        </div>
      </section>
    </div>
  );
}
