import React from "react";
import {
  Users,
  Square,
  Star,
  DoorOpen
} from "lucide-react";
import { Divider, Chip as HeroChip } from "@heroui/react";
import ImageGallery from "../imageGallery";

export default function RoomDetail({ room }) {
  if (!room) {
    return <div className="p-8 text-center text-gray-500">Habitación no encontrada</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 h-full min-h-[500px] max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-hide pb-2 ">
      
      <div className="relative h-64 md:h-full overflow-y-auto ">
        <ImageGallery images={room.images} />
      </div>

      {/* Información de la Habitación */}
      <div className="flex flex-col p-6 md:py-8 md:pr-8">
        <div className="mb-6">
          <h2 className="text-3xl font-serif text-[#2c4549] mb-3">
            {room.name}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>Hasta {room.capacity} personas</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Square className="w-4 h-4" />
              <span>{room.size || '35'}m²</span> 
            </div>
            <div className="flex items-center gap-1 bg-[#476d15]/10 text-[#476d15] px-3 py-1 rounded-full font-medium">
              <DoorOpen className="w-4 h-4" />
              <span>{room.available_stock} disponibles</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
            {room.description}
          </p>
        </div>

        <Divider className="my-2" />

        {/* Sección de Servicios Actualizada */}
        <div className="mb-2 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Servicios Incluidos
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            {room.services && room.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#476d15]/10 rounded-lg text-[#476d15] w-9 h-9 flex items-center justify-center">
                  {/* Renderizamos el icono de Font Awesome que viene del back */}
                  <i className={`${service.icon} text-lg`}></i>
                </div>
                <span className="text-sm font-medium">{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Total por noche
            </p>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-bold text-[#476d15]">
                ${room.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}