import { Button } from "@heroui/react";
import { MapPin, Plane, Compass, ExternalLink } from "lucide-react";

export default function LocationSection() {
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.438610127137!2d-75.7453238!3d4.865939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e387f70e4a9d1f3%3A0xfdba7186374b0adf!2sCatleya%20Royal%20Club!5e0!3m2!1ses!2sco!4v1765938839380!5m2!1ses!2sco";
    
  return (
    <section className="bg-white py-24 px-4">
      <div className="container mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#476d15]" />
                <span className="text-sm font-bold tracking-[0.2em] text-[#476d15] uppercase">Ubicación</span>
              </div>
              <h2 className="text-4xl font-serif text-[#2c4549] leading-tight">
                Vereda Pénjamo, <br />
                <span className="italic text-gray-400">Combia, Pereira</span>
              </h2>
            </div>

            <p className="text-gray-600 font-light leading-relaxed text-lg">
              Situado en el corazón de Combia, una zona reconocida por su clima privilegiado y su vocación cafetera. Estamos en un punto estratégico que combina la paz del campo con un acceso rápido a la capital de Risaralda.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-[#476d15]/10 p-2 rounded-full text-[#476d15]">
                  <Plane size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Conexión Aérea</h4>
                  <p className="text-sm text-gray-500">
                    A solo 25 minutos del Aeropuerto Internacional Matecaña (PEI).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-[#476d15]/10 p-2 rounded-full text-[#476d15]">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Entorno y Ciudad</h4>
                  <p className="text-sm text-gray-500">
                    A 20 minutos del centro de Pereira y cerca de las principales rutas gastronómicas de Combia.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#476d15] text-white rounded-none px-8 py-6 font-medium"
                endContent={<ExternalLink size={16} />}
                onClick={() => window.open("https://maps.app.goo.gl/vFDnQUwaPDTw84Wp8", "_blank")}
              >
                Cómo llegar
              </Button>
              <div className="flex items-center px-4">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold leading-tight">
                  Pereira, Risaralda <br /> Zona Rural de Combia
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-[450px] md:h-[550px] w-full relative">
            <div className="absolute inset-0 bg-[#476d15]/5 -rotate-1 rounded-2xl"></div>
            <div className="relative h-full w-full overflow-hidden rounded-xl shadow-2xl border border-gray-100">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) brightness(1)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Finca La Waira"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}