import { Star, ExternalLink, BadgeCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Image } from "@unpic/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Button } from "@heroui/react";

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="h-[500px] bg-[#111111]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full testimonial-swiper"
        style={{
          "--swiper-pagination-color": "#D4AF37",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.5",
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative h-full w-full flex items-center justify-center overflow-hidden"
              itemScope
              itemType="https://schema.org/Review"
            >
              <meta itemProp="reviewRating" content="5" />

              <Image
                src={item.image}
                alt={`Experiencia en Catleya Royal Club - Reseña de ${item.author}`}
                layout="fullWidth"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/60"></div>

              <div className="relative z-10 container mx-auto px-4 text-center py-10 animate-appearance-in flex flex-col items-center">
                <div
                  className="flex justify-center gap-1 mb-6"
                  role="img"
                  aria-label="Calificación de 5 estrellas"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="max-w-4xl mx-auto mb-6">
                  <p
                    className="text-2xl md:text-4xl font-serif text-white italic leading-relaxed"
                    itemProp="reviewBody"
                  >
                    "{item.quote}"
                  </p>
                </blockquote>

                <cite className="not-italic flex flex-col items-center gap-2">
                  <p
                    className="text-white/90 uppercase tracking-widest font-medium text-sm flex items-center gap-2"
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    — <span itemProp="name">{item.author}</span>
                    {item.link && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                  </p>

                  {item.link && (
                    <Button
                      as="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="light"
                      className="text-white/70 hover:text-white mt-2"
                      startContent={<ExternalLink size={14} />}
                    >
                      Ver reseña en Google
                    </Button>
                  )}
                </cite>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}