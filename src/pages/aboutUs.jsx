import { motion } from "framer-motion";
import { Leaf, HeartHandshake, Users, Sparkles, Quote } from "lucide-react";
import { Helmet } from "react-helmet-async";

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

export default function AboutUs() {
  return (
    <main className="bg-[#111111] text-white">
      <Helmet>
        <title>
          Sobre Nosotros | Historia y Propósito de Catleya Royal Club
        </title>
        <meta
          name="description"
          content="Conozca el origen de Catleya Royal Club. Un sueño familiar nacido en el corazón del Eje Cafetero, enfocado en el lujo sereno, la sostenibilidad y la calidez humana."
        />
        <link
          rel="canonical"
          href="https://catleyaroyalclub.com/sobre-nosotros"
        />
        <meta
          property="og:title"
          content="La Historia detrás de Catleya Royal Club"
        />
        <meta
          property="og:description"
          content="Descubre nuestra misión, nuestro compromiso con la tierra y el equipo apasionado que hace realidad el lujo sostenible."
        />
        <meta
          property="og:url"
          content="https://catleyaroyalclub.com/sobre-nosotros"
        />
      </Helmet>
      <section className="relative py-32 px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-4 md:left-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#476d15] blur-[100px] md:blur-[150px] rounded-full pointer-events-none"
        />

        <div className="container mx-auto max-w-[1200px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <span className="text-[#476d15] uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-2">
                  <Sparkles size={14} /> El Origen
                </span>
                <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                  La materialización de <br />
                  <span className="text-gray-400 italic">
                    un sueño personal.
                  </span>
                </h1>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="space-y-6 max-w-[500px] text-gray-400 font-light leading-relaxed text-lg"
              >
                <p>
                  Catleya Royal Club nace como la materialización de un sueño:
                  crear un refugio donde la naturaleza, la hospitalidad y las
                  celebraciones convivieran en absoluta armonía.
                </p>
                <p>
                  Más que una oportunidad detectada, surge de la sensibilidad
                  por el territorio del Eje Cafetero y del deseo de ofrecer un
                  lujo sereno, auténtico y lejos de lo convencional.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageReveal}
              className="aspect-[4/5] relative rounded-lg overflow-hidden shadow-2xl"
            >
              <img
                src="/images/AboutUs/AboutUs-1-1.webp"
                alt="Origen Catleya"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-[#F9F9F7] text-[#1a1a1a] relative">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageReveal}
              className="aspect-square relative rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1"
            >
              <img
                src="/images/AboutUs/AboutUs-2-1.webp"
                alt="Experiencia Misión"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm p-6 max-w-[200px] shadow-lg">
                <Quote className="text-[#476d15] mb-2" size={20} />
                <p className="text-xs font-serif italic text-gray-600">
                  "Creamos escenarios para compartir, celebrar y reconectar."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <span className="text-[#476d15] uppercase tracking-[0.3em] text-xs font-bold block">
                  Nuestra Misión
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#2c4549]">
                  Más que hospedaje, <br />
                  <span className="italic text-gray-400 font-light">
                    sentido de pertenencia.
                  </span>
                </h2>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="space-y-6 text-gray-600 font-light leading-relaxed text-lg"
              >
                <p>
                  Buscamos ofrecer mucho más que servicios; creamos los
                  escenarios ideales donde cada huésped se sienta atendido con
                  calidez.
                </p>
                <p>
                  Nuestro propósito es que el paisaje sea parte inseparable de
                  la experiencia, expresando el lujo a través del silencio, la
                  tranquilidad y el cuidado obsesivo por cada detalle.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-gray-200">
                  <div>
                    <p className="text-[#476d15] font-bold text-2xl font-serif">
                      01
                    </p>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
                      Calidez
                    </p>
                  </div>
                  <div>
                    <p className="text-[#476d15] font-bold text-2xl font-serif">
                      02
                    </p>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
                      Paisajismo
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-[#111111]">
        <div className="container mx-auto max-w-[1200px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="text-[#476d15] uppercase tracking-[0.3em] text-xs font-bold block mb-4">
              Detrás de la visión
            </span>
            <h2 className="text-4xl md:text-5xl font-serif">
              Un equipo{" "}
              <span className="italic text-gray-400">apasionado.</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto font-light">
              Detrás de Catleya hay una visión familiar y un equipo
              interdisciplinario que cree en el valor del tiempo y el respeto
              por el entorno.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Diseño & Arquitectura",
                img: "/images/AboutUs/AboutUs-4-1.webp",
                desc: "Arquitectura que rinde homenaje al paisaje cafetero, integrando líneas orgánicas y espacios abiertos diseñados para la reconexión y el descanso absoluto.",
              },
              {
                title: "Eventos & Experiencias",
                img: "/images/AboutUs/AboutUs-7-1.webp",
                offset: true,
                desc: "Creamos atmósferas únicas donde la elegancia y la funcionalidad convergen, nuestra dedicación asegura que cada evento sea una experiencia a medida, marcada por la distinción y una ejecución excepcional.",
              },
              {
                title: "Gastronomía de Autor",
                img: "/images/AboutUs/AboutUs-6-1.webp",
                desc: "Cocina innovadora que honra los sabores locales, transformando ingredientes frescos en experiencias culinarias únicas y sofisticadas.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`space-y-4 ${item.offset ? "md:mt-12" : ""}`}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <h3 className="text-xl font-serif italic text-gray-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32 px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#476d15] blur-[180px] rounded-full pointer-events-none"
        />

        <div className="container mx-auto max-w-[1200px] relative z-10 border-t border-gray-800 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-[#476d15] uppercase tracking-[0.3em] text-xs font-bold block">
                Sostenibilidad
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Compromiso con la <br />
                <span className="italic text-gray-400 font-light">
                  tierra que habitamos.
                </span>
              </h2>
              <p className="text-gray-400 font-light leading-relaxed">
                Trabajamos con productores locales, promovemos el uso consciente
                de los recursos y garantizamos trazabilidad en cada ingrediente.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <HeartHandshake className="text-[#476d15]" size={32} />
                <h4 className="text-xl font-serif">Comunidad Local</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  Apoyamos de manera directa la economía regional, integrando
                  talentos de la Vereda Pénjamo y alrededores.
                </p>
              </div>
              <div className="space-y-4">
                <Leaf className="text-[#476d15]" size={32} />
                <h4 className="text-xl font-serif">Recursos Conscientes</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  Implementamos procesos de mejora constante para minimizar
                  nuestro impacto y proteger la biodiversidad del Eje Cafetero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
