import AddsOnCard from "./addsOnCard";
import { useCart } from "../../context/cartContext";
import { get } from "../../../api/get";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddsOnListing({ setTitle, navigateViews, setHasAddons }) {
  const [addsOnList, setAddsOnList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    setTitle("Selecciona tus Servicios Adicionales");

    const getAddsOn = async () => {
      try {
        setIsLoading(true);
        const endpoint = "/addons";
        const response = await get({ endpoint });
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setHasAddons(true);
          setAddsOnList(response.data.data);
          setIsLoading(false);
        } else {
          setHasAddons(false);
          navigateViews(2);
        }
      } catch (error) {
        console.error("Error cargando addons:", error);
        navigateViews(2);
      }
    };

    getAddsOn();
  }, [navigateViews, setTitle]);

  const handleAddService = (serviceItem) => {
    const hasRoom = cart.some((item) => item.type === "room");

    if (!hasRoom) {
      toast.error("Acción requerida. Debes seleccionar al menos una habitación antes de añadir servicios adicionales.");
      return false;
    }

    addToCart(serviceItem);
    toast.success(`${serviceItem.name} se agregó al carrito.`);
    return true;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] w-full">
        <Spinner
          label="Cargando opciones..."
          color="success"
          labelColor="success"
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8 animate-appearance-in">
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
