import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Image } from "@unpic/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="h-[500px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        loop={true}
        className="h-full w-full"
        style={{ "--swiper-pagination-color": "#D4AF37", "--swiper-pagination-bullet-inactive-color": "#ffffff" }}
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
              <Image
                src={item.image}
                alt={item.author}
                layout="fullWidth"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 container mx-auto px-4 text-center py-10 animate-appearance-in">
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />)}
                </div>
                <h2 className="text-2xl md:text-4xl font-serif text-white italic leading-relaxed max-w-4xl mx-auto mb-8">"{item.quote}"</h2>
                <p className="text-white/80 uppercase tracking-widest font-medium text-sm">— {item.author}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}