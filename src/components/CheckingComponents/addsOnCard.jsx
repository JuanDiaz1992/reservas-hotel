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
import { Plus, Minus, ShoppingCart } from "lucide-react";

import BasicModal from "../basicModal";
import AddsOnModalContent from "./addsOnModalContent";
import { useCurrency } from "../../context/currencyContext";

function StandardImage({ src, alt, className }) {
  return <img src={src} alt={alt} className={className} />;
}

export default function AddsOnCard({ addsOnInfo }) {
  const { id, name, price, images } = addsOnInfo;

  const [quantity, setQuantity] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    console.log(`Añadiendo ${quantity} de ${name} al carrito.`);
  };

  return (
    <>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm py-0 flex flex-col">
        <CardBody className="p-0 overflow-hidden flex-grow">
          <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
            <StandardImage
              src={images[0]}
              alt={`Portada de ${name}`}
              className="object-cover w-full h-full rounded-t-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <Tooltip content="Ver detalles del servicio" placement="top">
              <Button
                onClick={onOpen}
                variant="solid"
                color="gray"
                className="absolute top-4 right-4 text-xs font-semibold bg-black/60 hover:bg-black/80 text-white rounded-full p-2 h-auto z-10" // z-10 para asegurar visibilidad
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
          <div className="flex items-center space-x-0 w-1/3">
            <Button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              isIconOnly
              variant="flat"
              color="gray"
              size="sm"
              className="rounded-r-none h-8 w-8 min-w-8"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full text-center text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              classNames={{ input: "text-center p-0 h-8" }}
              variant="bordered"
            />
            <Button
              onClick={() => setQuantity((prev) => prev + 1)}
              isIconOnly
              variant="flat"
              color="gray"
              size="sm"
              className="rounded-l-none h-8 w-8 min-w-8"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="flex-grow font-semibold h-9 bg-[#476d15] hover:bg-[#4a4e38] text-white ml-3"
            variant="solid"
            startContent={<ShoppingCart className="h-5 w-5" />}
          >
            Añadir
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
