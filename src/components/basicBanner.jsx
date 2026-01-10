"use client";
import { motion } from "framer-motion";

export default function BasicBanner({ title, imgSrc, subtitleColor = "text-[#476d15]" }) {
  return (
    <header className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-[#111111]">
      {/* Contenedor de la imagen con animación de escala lenta */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Overlay con degradado sofisticado para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      </motion.div>

      {/* Contenido Central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center"
        >
          {/* Línea de acento superior opcional para el toque "Royal" */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-[1px] bg-[#476d15] mb-6"
          />

          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif text-center px-4 tracking-tight">
            {title.split(" ").map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "italic text-gray-300 ml-3" : "ml-3"}>
                {word}
              </span>
            ))}
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className={`mt-4  uppercase tracking-[0.4em] text-[10px] font-bold ${subtitleColor}`}
          >
            Catleya Royal Club
          </motion.div>
        </motion.div>
      </div>
      
      {/* Luz ambiental sutil en la esquina inferior */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#476d15]/20 blur-[100px] rounded-full" />
    </header>
  );
}