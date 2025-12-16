import AddsOnCard from "./addsOnCard";
import { sampleAddsOn } from "../../data";
import { useCart } from "../../context/cartContext";

export default function AddsOnListing({ setTitle }) {
  setTitle("Selecciona tus Servicios Adicionales");

  const getAddsOn = () => {
    return sampleAddsOn;
  };

  const addsOnList = getAddsOn();
  const { addToCart, cart } = useCart();

  const handleAddService = (serviceItem) => {
    addToCart(serviceItem);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
      {addsOnList.map((addOn) => {
        const isInCart = cart.some(
          (item) =>
            item.type === "addon" &&
            (item.id === addOn.id || item.originalId === addOn.id)
        );

        return (
          <AddsOnCard
            key={addOn.id}
            addsOnInfo={addOn}
            onAddToCart={handleAddService}
            isInCart={isInCart}
          />
        );
      })}
    </div>
  );
}