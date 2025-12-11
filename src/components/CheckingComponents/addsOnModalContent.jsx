// src/components/AddsOnModalContent.jsx

// ⬇️ ELIMINAMOS la importación de "next/image"
// import Image from "next/image"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Controller } from "swiper/modules";

// ⬇️ COMPONENTE CORREGIDO: Usando <img> en lugar de <Image> de Next.js ⬇️
function ModalImageSlide({ data }) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      <img
        src={data}
        alt="Imagen de servicio adicional"
        // Clases de Tailwind para simular fill y object-cover en un contenedor relativo
        className="object-cover rounded-lg w-full h-full absolute top-0 left-0"
      />
    </div>
  );
}
// ⬆️ FIN COMPONENTE CORREGIDO ⬆️

export default function AddsOnModalContent({ addsOnInfo }) {
  const { name, description, images } = addsOnInfo;

  return (
    <div className="p-2">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{name}</h3>

      <div className="mb-6 rounded-xl overflow-hidden shadow-xl">
        <Swiper
          modules={[Navigation, EffectFade, Controller]}
          spaceBetween={10}
          slidesPerView={1}
          effect="fade"
          loop={true}
          navigation={true}
          style={{ 
            '--swiper-navigation-color': '#fff', 
            '--swiper-pagination-color': '#fff' 
          }}
        >
          {images.map((url, index) => (
            <SwiperSlide key={index}>
              <ModalImageSlide data={url} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h4 className="text-lg font-bold mb-2 text-gray-800">Descripción completa:</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}