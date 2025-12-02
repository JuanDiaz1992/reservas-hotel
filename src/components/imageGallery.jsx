import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";

export default function ImageGallery({ images = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={`flex flex-col gap-2 ${className}`}>
        <div
          className="relative w-full h-64 md:h-80 cursor-pointer group overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          onClick={() => handleOpen(0)}
        >
          <img
            src={images[0]}
            alt="Vista principal"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="text-white w-8 h-8 drop-shadow-lg" />
          </div>
        </div>
        {images.length > 1 && (
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

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="full"
        classNames={{
          base: "bg-black/90 text-white",
          closeButton:
            "hover:bg-white/20 active:bg-white/30 text-white z-50 top-4 right-4 p-2",
        }}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0 overflow-hidden flex items-center justify-center h-full relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 z-40 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-all hidden md:block"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* Imagen Central */}
              <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                <img
                  src={images[currentIndex]}
                  alt="Galería ampliada"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-appearance-in"
                />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full text-sm font-medium tracking-widest backdrop-blur-md">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-40 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-all hidden md:block"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
