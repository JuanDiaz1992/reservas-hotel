import { Button } from "@heroui/react";
import { Instagram, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Image } from "@unpic/react";

export default function GallerySection({
  visiblePhotos,
  showAllPhotos,
  setShowAllPhotos,
  getGridClass,
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = visiblePhotos.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <section className="py-24 bg-white px-4" id="gallery-section">
      <div className="container mx-auto max-w-[1200px]">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-5 h-5 text-[#476d15]" />
              <span className="text-sm font-bold tracking-widest text-[#476d15] uppercase">
                Social
              </span>
            </div>
            <h2 className="text-3xl font-serif text-[#2c4549]">
              @Catleyaroyalclub
            </h2>
            <p className="text-gray-500 mt-2">
              Síguenos para tu dosis diaria de calma.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-4 transition-all duration-500">
          {visiblePhotos.map((img, i) => (
            <div
              key={i}
              className={`relative group overflow-hidden rounded-lg animate-appearance-in cursor-pointer ${getGridClass(i)}`}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                layout="fullWidth"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="text-white w-5 h-5 drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            variant="flat"
            className="bg-[#476d15]/10 text-[#476d15] font-medium px-10 py-6 rounded-full hover:bg-[#476d15] hover:text-white transition-all"
            onClick={() => {
              if (showAllPhotos)
                document
                  .getElementById("gallery-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              setShowAllPhotos(!showAllPhotos);
            }}
            endContent={
              showAllPhotos ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )
            }
          >
            {showAllPhotos ? "Mostrar menos" : "Ver galería completa"}
          </Button>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
      />
    </section>
  );
}
