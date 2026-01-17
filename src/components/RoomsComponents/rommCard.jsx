import { useState } from "react";
import {
  Users,
  Square,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { useCurrency } from "../../context/currencyContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Image } from "@unpic/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const iconMap = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
  coffee: Coffee,
  default: CheckCircle2,
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || iconMap.default;
};

const GuestSelectionPopover = ({
  room,
  onReserve,
  formatPrice,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const totalGuests = adults + children;

  const extraAdultsCount = Math.max(0, adults - 2);
  const remainingFreeSlots = Math.max(0, 2 - adults);
  const extraChildrenCount = Math.max(0, children - remainingFreeSlots);

  const extraAdultCost = extraAdultsCount * (room.extraAdult || 0);
  const extraChildCost = extraChildrenCount * (room.extraChild || 0);

  const previewPricePerNight = room.price + extraAdultCost + extraChildCost;

  const hasExtras = extraAdultsCount > 0 || extraChildrenCount > 0;

  const handleConfirm = () => {
    onReserve({
      ...room,
      type: "room",
      selectedExtras: {
        adults: extraAdultsCount,
        children: extraChildrenCount,
      },
      extraAdult: room.extraAdult || 0,
      extraChild: room.extraChild || 0,
    });
    setIsOpen(false);
  };

  return (
    <Popover
isOpen={isOpen}
  onOpenChange={(open) => setIsOpen(open)}
  placement="bottom-end"
  offset={10}
  showArrow
  shouldFlip={true}
  containerPadding={15}
    >
      <PopoverTrigger>
        <Button
          className={`px-6 text-white ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-[#476d15] hover:bg-[#4a4e38]"
          }`}
          size="sm"
          isDisabled={isDisabled}
        >
          {isDisabled ? "En el carrito" : "Reservar"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-[280px] xs:w-72">
        <div className="w-full space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-medium">Seleccionar Huéspedes</h4>
            <p className="text-xs text-gray-500">
              Capacidad máxima: {room.capacity} personas
            </p>
          </div>

          <div className="space-y-3">
            {/* Adultos */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Adultos</span>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="h-6 w-6 min-w-6"
                  isDisabled={adults <= 1}
                  onPress={() => setAdults((prev) => prev - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-4 text-center">{adults}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="h-6 w-6 min-w-6"
                  isDisabled={totalGuests >= room.capacity}
                  onPress={() => setAdults((prev) => prev + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Niños */}
            {/* <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Niños</span>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="h-6 w-6 min-w-6"
                  isDisabled={children <= 0}
                  onPress={() => setChildren(prev => prev - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-4 text-center">{children}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="h-6 w-6 min-w-6"
                  isDisabled={totalGuests >= room.capacity}
                  onPress={() => setChildren(prev => prev + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div> */}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col justify-center h-8">
                {" "}
                <span className="text-xs text-gray-500 leading-none">
                  Total por noche
                </span>
                <span
                  className={`text-[10px] text-orange-600 font-medium leading-tight transition-opacity ${
                    hasExtras ? "opacity-100" : "opacity-0"
                  }`}
                >
                  (Incluye extras)
                  {!hasExtras && <span className="invisible">.</span>}
                </span>
              </div>
              <span className="text-lg font-bold text-[#476d15]">
                {formatPrice(previewPricePerNight)}
              </span>
            </div>
            <Button
              className="w-full bg-[#476d15] text-white"
              onPress={handleConfirm}
            >
              Confirmar Reserva
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function RoomCard({ room, onOpenModal, onReserve, isInCart }) {
  const { formatPrice } = useCurrency();

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm py-0">
      <CardBody className="p-0 overflow-hidden">
        <div className="relative h-56 group/slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="h-full w-full"
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
              "--swiper-navigation-size": "20px",
            }}
          >
            {room.images && room.images.length > 0 ? (
              room.images.map((img, index) => (
                <SwiperSlide
                  key={index}
                  onClick={onOpenModal}
                  className="cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${room.name} - foto ${index + 1}`}
                    layout="fullWidth"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src="/images/no_picture.webp"
                    alt="No disponible"
                    layout="fullWidth"
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <Chip className="bg-[#476d15] text-white border-0 text-xs shadow-sm">
              {room.available_stock} disp.
            </Chip>
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            {/* <Chip
              className="bg-black/60 text-white border-0 backdrop-blur-sm"
              startContent={<Square className="h-3 w-3" />}
            >
              {room.size}m²
            </Chip> */}
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {room.name}
            </h3>
          </div>

          <p className="text-gray-600 text-xs mb-4 line-clamp-2 h-8">
            {room.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" /> {room.capacity} pers.
            </div>
            <div className="flex gap-2">
              {room.services &&
                room.services.slice(0, 4).map((service, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    <i
                      className={`${service.icon} text-[#476d15]`}
                      style={{ fontSize: "14px" }}
                      title={service.name}
                    ></i>
                  </div>
                ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onPress={onOpenModal}
            className="mb-0"
          >
            Ver Detalles
          </Button>
        </div>

        <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100 px-5 pb-5">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-[#22222]">
              {formatPrice(room.price)}
            </span>
            <span className="text-xs text-[#476d15] font-medium">
              por noche
            </span>
          </div>

          <GuestSelectionPopover
            room={room}
            onReserve={onReserve}
            formatPrice={formatPrice}
            isDisabled={isInCart}
          />
        </CardFooter>
      </CardBody>
    </Card>
  );
}
