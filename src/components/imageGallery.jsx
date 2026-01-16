import React, { useState } from "react";
import { ImageIcon, ZoomIn } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageGallery({ images = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Si no hay imágenes, definimos el placeholder
  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : ["/images/no_picture.webp"];
  
  // Convertir imágenes a formato compatible con Lightbox
  const lightboxSlides = displayImages.map((img) => ({ src: img }));

  const handleOpen = (index) => {
    if (!hasImages) return; // No abrir modal si no hay fotos reales
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Vista Principal */}
        <div
          className={`relative w-full h-64 md:h-80 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none ${
            hasImages ? "cursor-pointer group" : "cursor-default"
          }`}
          onClick={() => handleOpen(0)}
        >
          <img
            src={displayImages[0]}
            alt="Vista principal"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {hasImages ? (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="text-white w-8 h-8 drop-shadow-lg" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <ImageIcon className="text-gray-400 w-10 h-10 opacity-50" />
            </div>
          )}
        </div>

        {/* Miniaturas (Solo si hay más de 1 imagen real) */}
        {hasImages && images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative h-32 cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => handleOpen(idx + 1)}
              >
                <img
                  src={img}
                  alt={`Galería ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox - Solo se activa si hasImages es true */}
      {hasImages && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={lightboxSlides}
          index={currentIndex}
          on={{
            view: ({ index }) => setCurrentIndex(index),
          }}
        />
      )}
    </>
  );
}
