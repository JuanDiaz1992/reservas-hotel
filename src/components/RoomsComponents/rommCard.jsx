import {
  Users,
  Square,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { useCurrency } from "../../context/currencyContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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

export default function RoomCard({ room, onOpenModal, onReserve }) {
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
                  <img
                    src={img}
                    alt={`${room.name} - foto ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </SwiperSlide>
              ))
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </Swiper>

          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <Chip className="bg-[#5C6046] text-white border-0 text-xs shadow-sm">
              {room.available} disp.
            </Chip>
          </div>

          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <Chip
              className="bg-black/60 text-white border-0 backdrop-blur-sm"
              startContent={<Square className="h-3 w-3" />}
            >
              {room.size}m²
            </Chip>
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
              {room.amenities.slice(0, 3).map((amenity, idx) => {
                const IconComponent = getIconComponent(amenity.icon);
                return (
                  <IconComponent key={idx} className="w-4 h-4 text-[#5C6046]" />
                );
              })}
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
            <span className="text-xl font-bold text-[#5C6046]">
              {formatPrice(room.price)}
            </span>
            <span className="text-xs text-[#5C6046] font-medium">
              por noche
            </span>
          </div>
          <Button
            className="bg-[#5C6046] hover:bg-[#4a4e38] text-white px-6"
            size="sm"
            onPress={onReserve}
          >
            Reservar
          </Button>
        </CardFooter>
      </CardBody>
    </Card>
  );
}
