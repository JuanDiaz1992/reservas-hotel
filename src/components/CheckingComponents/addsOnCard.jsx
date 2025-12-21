import { useState } from "react";
import {
  Button,
  Input,
  useDisclosure,
  Tooltip,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";

import BasicModal from "../basicModal";
import AddsOnModalContent from "./addsOnModalContent";
import { useCurrency } from "../../context/currencyContext";

function StandardImage({ src, alt, className }) {
  const fallback = "/images/no_picture.webp";
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
}

export default function AddsOnCard({ addsOnInfo, onAddToCart, isInCart }) {
  const { id, name, price, image } = addsOnInfo;

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    const itemToAdd = {
      ...addsOnInfo,
      id: `${id}-${Date.now()}`,
      originalId: id,
      type: "addon",
      quantity: quantity,
      totalPrice: price * quantity,
      image: image,
    };

    // Verificamos si el padre realmente lo añadió
    const success = onAddToCart(itemToAdd);

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      setQuantity(1);
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm py-0 flex flex-col">
        <CardBody className="p-0 overflow-hidden flex-grow">
          <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
            <StandardImage
              src={image}
              alt={`Portada de ${name}`}
              className="object-cover w-full h-full rounded-t-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <Tooltip content="Ver detalles del servicio" placement="top">
              <Button
                onClick={onOpen}
                variant="solid"
                color="gray"
                className="absolute top-4 right-4 text-xs font-semibold bg-black/60 hover:bg-black/80 text-white rounded-full p-2 h-auto z-10"
                size="sm"
              >
                Ver Más
              </Button>
            </Tooltip>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <h3
              className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1 leading-tight"
              title={name}
            >
              {name}
            </h3>
            <p className="text-gray-600 text-xs mb-4 line-clamp-2 h-8">
              {addsOnInfo.shortDescription ||
                "Servicio adicional de alta calidad. Haz clic en 'Ver Más' para detalles."}
            </p>

            <div className="flex flex-col items-start flex-grow">
              <span className="text-xl font-bold text-[#22222] mt-auto">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-[#476d15] font-medium">
                por unidad
              </span>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100 px-5 pb-5">
          {/* Contenedor del Selector de Cantidad */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              isIconOnly
              variant="light"
              size="sm"
              isDisabled={isInCart}
              className="h-7 w-7 min-w-7 rounded-md hover:bg-white text-gray-600"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>

            {/* Reemplazamos el Input por un div/span controlado */}
            <div className="w-8 flex justify-center items-center">
              <span className="text-sm font-bold text-gray-800 select-none">
                {quantity}
              </span>
            </div>

            <Button
              onClick={() => setQuantity((prev) => prev + 1)}
              isIconOnly
              variant="light"
              size="sm"
              isDisabled={isInCart}
              className="h-7 w-7 min-w-7 rounded-md hover:bg-white text-gray-600"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Botón Añadir */}
          <Button
            onClick={handleAddToCart}
            isDisabled={isInCart}
            className={`flex-grow font-semibold h-9 ml-3 text-white transition-all duration-300 shadow-sm ${
              isInCart
                ? "bg-gray-400 opacity-70 cursor-not-allowed"
                : isAdded
                  ? "bg-green-600"
                  : "bg-[#476d15] hover:shadow-md active:scale-95"
            }`}
            variant="solid"
            startContent={
              isInCart ? null : isAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )
            }
          >
            {isInCart ? "En carrito" : isAdded ? "Listo" : "Añadir"}
          </Button>
        </CardFooter>
      </Card>

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        Content={() => <AddsOnModalContent addsOnInfo={addsOnInfo} />}
      />
    </>
  );
}
