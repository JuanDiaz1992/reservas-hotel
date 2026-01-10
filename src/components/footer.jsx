import { Link, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Code2,
} from "lucide-react";
import { scrollToTopInstant } from "../utils/scrollToTop";

export default function Footer() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/admin");
  if (hideFooter) {
    return;
  }
  return (
    <footer className="bg-[#424436] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        {/* Grid Principal: 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Columna 1: Marca y Sobre Nosotros */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link to="/" onClick={scrollToTopInstant}>
                <img
                  src="/images/logo.svg"
                  alt="Hotel Catleya Royal Club"
                  className="w-[150px]"
                />
              </Link>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Un santuario de lujo y tranquilidad donde cada detalle está
              diseñado para su confort. Bienvenido a la excelencia hotelera.
            </p>
            <div className="flex gap-4 pt-2">
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open("https://instagram.com", "_blank")}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open("https://facebook.com", "_blank")}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open("https://twitter.com", "_blank")}
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wider">Explorar</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors block"
                  onClick={scrollToTopInstant}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/my-reservation"
                  className="hover:text-white transition-colors block"
                  onClick={scrollToTopInstant}
                >
                  Mis Reservas
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre-nosotros"
                  className="hover:text-white transition-colors block"
                  onClick={scrollToTopInstant}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="hover:text-white transition-colors block"
                  onClick={scrollToTopInstant}
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-[#D4AF37] transition-colors block"
                  onClick={scrollToTopInstant}
                >
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wider">Contacto</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  Vereda Pénjamo | Corregimiento de Combia | Finca La Waira,
                  Pereira, Risaralda
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>+57 (1) 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>reservas@catleyahotel.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Suscripción / Newsletter (Espacio que estaba vacío) */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-[0.2em]">
              Reserva con confianza
            </h4>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Nuestra plataforma utiliza tecnología de encriptación avanzada
              para proteger todos sus pagos.
            </p>
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <img
                src="/images/epayco.webp"
                className="h-4 grayscale brightness-200 opacity-50"
                alt="ePayco"
              />
            </div>
          </div>
        </div>

        {/* Separador Renovado con Créditos a Site Pixel Studio */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">
              Propiedad
            </p>
            <p className="text-xs text-white/50">
              © 2024 Hotel Catleya Royal Club. Todos los derechos reservados.
            </p>
          </div>

          <div className="text-center md:text-right group">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-[#D4AF37] transition-colors">
              Desarrollo Tecnológico
            </p>
            <a
              href="https://sitepixelstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-all"
            >
              <span>Crafted by</span>
              <span className="font-bold tracking-tight text-white group-hover:text-[#D4AF37]">
                SITE PIXEL STUDIO
              </span>
              <Code2 size={14} className="text-[#D4AF37]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
