import { Utensils, Sparkles, Compass, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

export default function ExperiencesSection() {
  const experiences = [
    {
      icon: Utensils,
      title: "Gastronomía de Autor",
      desc: "El Chef Alessandro M. reinterpreta los sabores locales con técnicas de vanguardia en nuestro restaurante 'Raíces'.",
      link: "Ver Menú",
    },
    {
      icon: Sparkles,
      title: "Wellness & Spa",
      desc: "Tratamientos holísticos inspirados en rituales ancestrales, utilizando aceites orgánicos cultivados en nuestro jardín.",
      link: "Reservar Tratamiento",
    },
    {
      icon: Compass,
      title: "Expediciones Privadas",
      desc: "Descubre los secretos mejor guardados de la región con nuestros guías expertos en tours totalmente personalizados.",
      link: "Explorar Rutas",
    },
  ];

  return (
    <section className="bg-[#F9F9F7] py-24 px-4">
      <div className="container mx-auto max-w-[1200px]">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2c4549] mb-4 animate-fade-up animate-duration-700">
            Experiencias Elevadas
          </h2>
          <p className="text-gray-600 font-light animate-fade-up animate-duration-700 animate-delay-100">
            Más allá de una estancia, una colección de momentos diseñados para despertar tus sentidos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="group relative bg-white p-8 hover:shadow-2xl transition-all duration-500 ease-out-expo border border-gray-100 hover:border-[#476d15]/30 rounded-xl hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-up animate-duration-700"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <div
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-15 transition-opacity duration-700 bg-cover bg-center"
                style={{ backgroundImage: `url(${exp.image})` }}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#476d15]/10 to-[#2c4549]/10 rounded-full flex items-center justify-center mb-6 text-[#476d15] group-hover:from-[#476d15] group-hover:to-[#2c4549] group-hover:text-white transition-all duration-500 ease-out-back group-hover:scale-110 group-hover:rotate-3">
                  <exp.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2c4549] transition-colors duration-300">
                  {exp.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed mb-6 transition-colors duration-300 group-hover:text-gray-700">
                  {exp.desc}
                </p>

{/*                 <a
                  href={exp.linkUrl || "#"}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#476d15] hover:gap-3 transition-all duration-300"
                >
                  {exp.linkText || "Más información"}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </a> */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/sobre-nosotros">
            <Button
              className="bg-[#476d15] text-white font-medium px-8 py-4 rounded-full hover:bg-[#3a5a10] transition-all duration-300 shadow-lg hover:shadow-xl"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              Conoce Más Sobre Nosotros
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
