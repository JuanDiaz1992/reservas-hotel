import React from "react";
import {
  Users,
  Square,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  CheckCircle2,
  Star
} from "lucide-react";
import { Button, Divider, Chip as HeroChip } from "@heroui/react";
import ImageGallery from "./imageGallery";

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

export default function RoomDetail({ room }) {
  if (!room) {
    return <div className="p-8 text-center text-gray-500">Habitación no encontrada</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 h-full min-h-[500px] max-h-[85vh] pb-2">

      <div className="relative h-64 md:h-full overflow-y-auto scrollbar-hide">
        <ImageGallery images={room.images} />
        <div className="absolute top-4 left-4 pointer-events-none z-10">
           <HeroChip className="bg-white/90 backdrop-blur text-[#5C6046] font-medium shadow-sm border-0">
              <Star className="w-3 h-3 inline mr-1 fill-[#D4AF37] text-[#D4AF37]" />
              Premium Suite
           </HeroChip>
        </div>
      </div>

      <div className="flex flex-col p-6 md:py-8 md:pr-8 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-serif text-[#2c4549] mb-3">
            {room.name}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>Hasta {room.capacity} personas</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Square className="w-4 h-4" />
              <span>{room.size}m²</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
            {room.description}
            <span className="hidden md:inline">
               Esta habitación exclusiva combina diseño contemporáneo con materiales naturales.
            </span>
          </p>
        </div>

        <Divider className="my-2" />

        <div className="mb-2 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Servicios Incluidos
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            {room.amenities &&
              room.amenities.map((amenity, index) => {
                const IconComponent = getIconComponent(amenity.icon);
                return (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-[#5C6046]/10 rounded-lg text-[#5C6046]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{amenity.name}</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Total por noche
              </p>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-3xl font-bold text-[#5C6046]">
                  ${room.price}
                </span>
              </div>
            </div>
            <Button className="w-full sm:w-auto bg-[#5C6046] text-white px-8 py-6">
              Reservar Ahora
            </Button>
        </div>
      </div>
    </div>
  );
}