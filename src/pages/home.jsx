import ReservationForm from "../components/reservationForm";
import { useState } from "react";
import RoomListing from "../components/RoomsComponents/roomListing";
import { Button } from "@heroui/react";
import { Utensils, Sparkles, Compass, ArrowRight, Star } from "lucide-react";

// Importaciones de Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Datos para el slider de reviews
const testimonials = [
  {
    id: 1,
    quote: "Nunca había experimentado un nivel de detalle y serenidad como este. No es solo un hotel, es un estado mental al que siempre querré volver.",
    author: "Conde Nast Traveler, Editor's Pick 2024",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80" // Resort pool evening
  },
  {
    id: 2,
    quote: "Un santuario arquitectónico que logra desaparecer entre la selva. El servicio es impecable, casi invisible, pero siempre presente.",
    author: "Travel + Leisure, Best New Hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" // Resort luxury view
  },
  {
    id: 3,
    quote: "La gastronomía por sí sola justifica el viaje. Cada plato cuenta la historia de la región con una elegancia sorprendente.",
    author: "Michelin Guide, 2024 Review",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80" // Cocktails/Dining mood
  }
];

export default function Home() {
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [guests, setGuests] = useState(0);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    setTimeout(() => {
      setHasSearchResults(true);
      setIsSearching(false);
      setTimeout(() => {
        const resultsElement = document.getElementById("results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }, 1000);
  };

  return (
    <>
      <section className="relative pt-[80px] pb-[60px]">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
        <div
          className="relative z-10 container mx-auto max-w-[1200px] flex items-center justify-center py-20"
          id="disponibilidad"
        >
          <div className="text-center w-full flex flex-col justify-center items-center text-white px-4">
            <h1 className=" text-4xl md:text-[60px] font-bold mb-8 leading-tight md:leading-[55px]">
              Tu refugio para desconectar del mundo y reconectar contigo mismo.
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-[600px]">
              Un santuario privado entre jardines ancestrales, donde cada
              detalle está diseñado para ofrecer una escapada de lujo íntimo.
            </p>

            <ReservationForm
              onSearch={handleSearch}
              isSearching={isSearching}
              setResults={setResults}
              setGuests={setGuests}
            />
          </div>
        </div>
      </section>

      {hasSearchResults && (
        <section id="results" className="w-full">
          <RoomListing results={results} guests={guests} />
        </section>
      )}

      {/* 1. SECCIÓN "EXPERIENCIA" (FONDO NEGRO) */}
      <section className="bg-[#222222] text-white py-24 px-4 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#476d15] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <div className="space-y-8">
              <span className="text-[#476d15] uppercase tracking-[0.2em] text-sm font-medium">
                Nuestra Filosofía
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                El lujo de lo esencial, <br />
                <span className="text-gray-400 italic">
                  la belleza de lo eterno.
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                En un mundo que nunca se detiene, ofrecemos el regalo más
                preciado: tiempo y silencio. Nuestra arquitectura se funde con
                la selva nativa, creando espacios donde la barrera entre el
                interior y el exterior se desvanece.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                Cada rincón ha sido curado no solo para ser visto, sino para ser
                sentido. Desde sábanas de algodón egipcio hasta aromas botánicos
                creados exclusivamente para nosotros.
              </p>

              <div className="pt-4">
                <Button
                  className="bg-[#476d15] text-white font-medium px-8 py-6 rounded-none hover:bg-gray-200 hover:text-[#476d15] transition-colors"
                  endContent={<ArrowRight className="w-4 h-4 ml-2" />}
                >
                  Conoce nuestra historia
                </Button>
              </div>
            </div>

            {/* Imagen Composición */}
            <div className="relative">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/images/590840603_17864427183532582_8924480613698638280_n.webp"
                  alt="Arquitectura oscura y elegante"
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] p-6 max-w-[200px] border border-gray-800 hidden md:block">
                <p className="text-xs text-gray-400 font-serif italic">
                  "Un diseño que respira al ritmo de la naturaleza que lo
                  rodea."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN AMENITIES (FONDO CLARO/BEIGE) */}
      <section className="bg-[#F9F9F7] py-24 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2c4549] mb-4">
              Experiencias Elevadas
            </h2>
            <p className="text-gray-600 font-light">
              Más allá de una estancia, una colección de momentos diseñados para
              despertar tus sentidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#476d15]/20">
              <div className="w-12 h-12 bg-[#476d15]/10 rounded-full flex items-center justify-center mb-6 text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-colors">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gastronomía de Autor
              </h3>
              <p className="text-gray-500 font-light leading-relaxed mb-6">
                El Chef Alessandro M. reinterpreta los sabores locales con
                técnicas de vanguardia en nuestro restaurante "Raíces".
              </p>
              <a
                href="#"
                className="text-sm font-medium text-[#476d15] hover:underline flex items-center gap-1"
              >
                Ver Menú <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#476d15]/20">
              <div className="w-12 h-12 bg-[#476d15]/10 rounded-full flex items-center justify-center mb-6 text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wellness & Spa
              </h3>
              <p className="text-gray-500 font-light leading-relaxed mb-6">
                Tratamientos holísticos inspirados en rituales ancestrales,
                utilizando aceites orgánicos cultivados en nuestro jardín.
              </p>
              <a
                href="#"
                className="text-sm font-medium text-[#476d15] hover:underline flex items-center gap-1"
              >
                Reservar Tratamiento <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#476d15]/20">
              <div className="w-12 h-12 bg-[#476d15]/10 rounded-full flex items-center justify-center mb-6 text-[#476d15] group-hover:bg-[#476d15] group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expediciones Privadas
              </h3>
              <p className="text-gray-500 font-light leading-relaxed mb-6">
                Descubre los secretos mejor guardados de la región con nuestros
                guías expertos en tours totalmente personalizados.
              </p>
              <a
                href="#"
                className="text-sm font-medium text-[#476d15] hover:underline flex items-center gap-1"
              >
                Explorar Rutas <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN TESTIMONIOS (AHORA CON SLIDER) */}
      <section className="h-[500px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
          style={{
            "--swiper-pagination-color": "#D4AF37",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.5",
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                className="relative h-full w-full flex items-center justify-center bg-center bg-cover"
                style={{ backgroundImage: `url("${item.image}")` }}
              >
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-black/50"></div>
                
                <div className="relative z-10 container mx-auto px-4 text-center py-10 animate-appearance-in">
                  <div className="flex justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-serif text-white italic leading-relaxed max-w-4xl mx-auto mb-8">
                    "{item.quote}"
                  </h2>
                  <p className="text-white/80 uppercase tracking-widest font-medium text-sm">
                    — {item.author}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 4. SECCIÓN INSTAGRAM/GALERÍA */}
      <section className="py-24 bg-white px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif text-[#2c4549]">
                @Catleyaroyalclub
              </h2>
              <p className="text-gray-500 mt-2">
                Síguenos para tu dosis diaria de calma.
              </p>
            </div>
            <Button
              variant="bordered"
              className="hidden md:flex border-[#476d15] text-[#476d15]"
            >
              Ver Galería Completa
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] md:h-[300px]">
            <div className="relative group overflow-hidden h-full rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Cocktail"
              />
            </div>
            <div className="relative group overflow-hidden h-full rounded-lg md:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Pool view"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="relative group overflow-hidden h-full rounded-lg">
              {/* IMAGEN CORREGIDA AQUÍ */}
              <img
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Interior detail"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}