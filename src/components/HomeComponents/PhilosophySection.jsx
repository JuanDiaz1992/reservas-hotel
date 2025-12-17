import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PhilosophySection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#111111] text-white py-24 px-4 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute top-0 right-0 w-64 h-64 bg-[#476d15] blur-[120px] rounded-full pointer-events-none"
      />

      <div className="container mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <span className="text-[#476d15] uppercase tracking-[0.3em] text-xs font-bold block">
                Nuestra Filosofía
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                El lujo de lo esencial, <br />
                <span className="text-gray-400 italic">
                  la belleza de lo eterno.
                </span>
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-6 max-w-[450px]"
            >
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                En un mundo que nunca se detiene, ofrecemos el regalo más
                preciado: tiempo y silencio. Nuestra arquitectura se funde con
                la selva nativa, creando espacios donde la barrera entre el
                interior y el exterior se desvanece.
              </p>
              <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                Cada rincón ha sido curado no solo para ser visto, sino para ser
                sentido. Desde sábanas de algodón egipcio hasta aromas botánicos
                creados exclusivamente para nosotros.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Button
                className="bg-[#476d15] hover:bg-[#5a8a1a] text-white px-8 py-6 rounded-none text-sm font-bold transition-all uppercase tracking-widest"
                endContent={<ArrowRight className="w-4 h-4 ml-2" />}
              >
                Conoce nuestra historia
              </Button>
            </motion.div>
          </motion.div>

          {/* Bloque de Imagen */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <motion.div
              variants={imageReveal}
              className="aspect-[4/5] w-full overflow-hidden shadow-2xl"
            >
              <img
                src="/images/590840603_17864427183532582_8924480613698638280_n.webp"
                alt="Arquitectura"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-[#111111] p-6 max-w-[220px] border border-gray-800 hidden md:block shadow-2xl"
            >
              <p className="text-[11px] text-gray-400 font-serif italic leading-relaxed">
                "Un diseño que respira al ritmo de la naturaleza que lo rodea."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
