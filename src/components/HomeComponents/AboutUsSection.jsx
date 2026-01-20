import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { scrollToTop } from "../../utils/scrollToTop";
import { Image } from "@unpic/react";

export default function AboutUsSection() {
  const leftImageReveal = {
    hidden: { clipPath: "inset(0 80% 0 0)", opacity: 0 },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const textFade = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const rightColumnSlide = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#111111] text-white">
      <div className="container mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[650px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={leftImageReveal}
            className="lg:col-span-4 relative h-[450px] lg:h-auto overflow-hidden"
          >
            <Image
              src="/images/about-catleya-3-1.webp"
              alt="Jardines botánicos y zonas de relajación en Catleya Royal Club Pereira"
              className="absolute inset-0 w-full h-full object-cover"
              layout="fullWidth"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textFade}
            className="lg:col-span-4 px-8 py-16 lg:py-24 flex flex-col justify-end lg:pb-32"
          >
            <div className="space-y-6 max-w-[380px]">
              <p className="text-[#476d15] text-xs uppercase tracking-[0.3em] font-bold">
                Lujo Sostenible
              </p>
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                Un refugio de alta gama inmerso en un entorno botánico
                preservado. Nuestra propuesta de valor se centra en el lujo
                discreto y la atención al detalle. Una atmósfera diseñada para
                propiciar el bienestar a través de la integración fluida entre
                el confort interior y la majestuosidad del paisaje.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button
                  onPress={scrollToTop}
                  aria-label="Reservar su estadía en Catleya Royal Club"
                  className="bg-[#476d15] hover:bg-[#5a8a1a] text-white px-8 py-6 text-sm font-bold transition-all uppercase tracking-widest rounded-none border-none"
                >
                  Reservar Ahora
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rightColumnSlide}
            className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-between items-end"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-[1px] bg-gray-700"
              />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold whitespace-nowrap">
                Sobre Nosotros
              </span>
            </div>

            <div className="w-full space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="text-3xl md:text-[42px] font-serif leading-tight text-right lg:pl-10"
              >
                Descubre <br />
                <span className="italic text-gray-400">Catleya Royal Club</span>
              </motion.h2>

              <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[300px] overflow-hidden group">
                <img
                  src="/images/about-catleya-4.webp"
                  alt="Arquitectura moderna integrada con la naturaleza en Risaralda"
                  className="w-full h-full object-cover rounded-sm shadow-2xl transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}