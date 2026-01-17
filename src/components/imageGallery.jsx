import { useState } from "react";
import { ImageIcon, ZoomIn, Plus } from "lucide-react"; // Añadí Plus
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Image } from "@unpic/react";

export default function ImageGallery({ images = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images && images.length > 0;
  // Mostramos solo las primeras 3 en el diseño
  const visibleImages = images.slice(0, 3);
  const lightboxSlides = images.map((img) => ({ src: img }));

  const handleOpen = (index) => {
    if (!hasImages) return;
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* IMAGEN PRINCIPAL (Índice 0) */}
        <div
          className={`relative w-full h-64 overflow-hidden rounded-t-2xl ${
            hasImages ? "cursor-pointer group" : "cursor-default"
          }`}
          onClick={() => handleOpen(0)}
        >
          <img
            src={hasImages ? images[0] : "/images/no_picture.webp"}
            alt="Vista principal"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="text-white w-8 h-8 drop-shadow-lg" />
          </div>
        </div>

        {/* GRILLA INFERIOR (Máximo 2 imágenes más) */}
        {hasImages && images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 3).map((img, idx) => {
              const realIndex = idx + 1;
              const isLastVisible = realIndex === 2; // Es el tercer cuadro de la galería total
              const remainingCount = images.length - 3;

              return (
                <div
                  key={idx}
                  className="relative h-32 cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => handleOpen(realIndex)}
                >
                  <Image
                    src={img}
                    alt={`Galería ${realIndex}`}
                    layout="fullWidth"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* OVERLAY DE "VER MÁS" EN LA TERCERA IMAGEN */}
                  {isLastVisible && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-bg duration-300 group-hover:bg-black/60">
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-sm font-bold uppercase tracking-wider">
                        Ver {remainingCount} más
                      </span>
                    </div>
                  )}

                  {/* Icono de zoom normal si no es la última con contador */}
                  {(!isLastVisible || remainingCount <= 0) && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                      <ZoomIn className="text-white w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hasImages && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={lightboxSlides}
          index={currentIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
          on={{
            view: ({ index }) => setCurrentIndex(index),
          }}
        />
      )}
    </>
  );
}