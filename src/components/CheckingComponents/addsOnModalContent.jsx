import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Controller } from "swiper/modules";

function ModalImageSlide({ data }) {
  const fallback = "/images/no_picture.webp";
  const [imgSrc, setImgSrc] = useState(data || fallback);

  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      <img
        src={imgSrc}
        alt="Imagen de servicio adicional"
        className="object-cover rounded-lg w-full h-full absolute top-0 left-0"
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
}

export default function AddsOnModalContent({ addsOnInfo }) {
  const { name, description, image } = addsOnInfo;

  return (
    <div className="p-2">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{name}</h3>

      <div className="mb-6 rounded-xl overflow-hidden shadow-xl">
        <ModalImageSlide data={image} />
      </div>

      <h4 className="text-lg font-bold mb-2 text-gray-800">
        Descripción completa:
      </h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
