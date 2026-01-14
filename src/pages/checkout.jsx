import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddsOnListing from "../components/CheckingComponents/addsOnListing";
import CheckOutCart from "../components/CheckingComponents/cartCheckOut";
import { scrollToTop } from "../utils/scrollToTop";
import FormCheckOut from "../components/CheckingComponents/formCheckOut";
import DetailReservation from "../components/CheckingComponents/detailReservation";
import BasicBanner from "../components/basicBanner";

export default function Checkout() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Finaliza tu Reserva");
  const [view, setView] = useState(1);
  const [hasAddons, setHasAddons] = useState(true);

  const handleLocationChange = () => {
    const path = window.location.pathname;

    if (path.includes("/success") || uuid) {
      setView(3);
    } else if (path.includes("/details")) {
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
  }, [uuid]);

  const navigateViews = (data, reservationUuid = null) => {
    setView(data);
    scrollToTop();

    if (data === 2) {
      navigate("/checkout/details");
    } else if (data === 3) {
      const targetUuid = reservationUuid || uuid;
      if (targetUuid) {
        navigate(`/checkout/success/${targetUuid}`);
      } else {
        navigate("/checkout/success");
      }
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-gray-50">

      <BasicBanner title={title} imgSrc="/images/Habitaciones(12).webp" subtitleColor="text-white"/>

      <section className="container max-w-[1200px] mx-auto py-12 px-4">
        <h2
          className={`text-2xl md:text-4xl font-serif italic mb-8 ${view === 3 ? "text-center" : ""}`}
        >
          {title}
        </h2>{" "}
        <div className="flex flex-col lg:flex-row gap-[24px]">
          <div className={`${view === 3 ? "w-full" : "w-full lg:w-8/12"} ${view === 2 ? 'order-2' : 'order-1'}`}>
            {view === 1 && (
              <AddsOnListing
                setTitle={setTitle}
                navigateViews={navigateViews}
                setHasAddons={setHasAddons}
              />
            )}
            {view === 2 && (
              <FormCheckOut
                setTitle={setTitle}
                navigateViews={navigateViews}
                hasAddons={hasAddons}
              />
            )}

            {view === 3 && (
              <>
                <div div className="container mx-auto max-w-[800px]">
                  <DetailReservation setTitle={setTitle} />
                </div>
              </>
            )}
          </div>
          {view !== 3 && (
            <div className={`w-full lg:w-4/12 ${view === 2 ? 'order-1 md:order-2' : 'order-2 md:order-1'}`}>
              <CheckOutCart view={view} setView={navigateViews} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
