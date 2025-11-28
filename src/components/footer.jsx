import { Link } from "react-router-dom";
import { 
  Button,
  Input
} from "@heroui/react";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#424436] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        
        {/* Grid Principal: 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca y Sobre Nosotros */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.webp" 
                alt="Hotel Catleya Royal Club" 
                className="w-12 h-12 rounded-full"
              />
              <h3 className="text-2xl font-bold">Hotel Catleya Royal Club</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Un santuario de lujo y tranquilidad donde cada detalle está diseñado para su confort. 
              Bienvenido a la excelencia hotelera.
            </p>
            <div className="flex gap-4 pt-2">
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open('https://facebook.com', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-white data-[hover=true]:text-[#D4AF37] min-w-8 w-8 h-8"
                onPress={() => window.open('https://twitter.com', '_blank')}
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/rooms" className="hover:text-white transition-colors block">
                  Suites & Habitaciones
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors block">
                  Restaurante & Bar
                </Link>
              </li>
              <li>
                <Link to="/spa" className="hover:text-white transition-colors block">
                  Spa & Bienestar
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors block">
                  Eventos Privados
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors block">
                  Galería
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Av. del Mar 123, Zona Exclusiva,<br />
                  Ciudad Paraíso, CP 90210
                </span>
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

          {/* Columna 4: Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Suscríbase para recibir ofertas exclusivas y noticias de temporada.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Su correo electrónico"
                className="max-w-xs"
                classNames={{
                  input: "text-white placeholder:text-white/30",
                  inputWrapper: "bg-white/5 border border-white/10 data-[hover=true]:border-[#D4AF37] data-[focus=true]:border-[#D4AF37]"
                }}
              />
              <Button
                type="submit"
                className="bg-[#5C6046] text-white data-[hover=true]:bg-[#5C6046]/80 w-full max-w-xs"
                endContent={<ArrowRight className="w-4 h-4" />}
                onPress={(e) => {
                  e.preventDefault();
                  // Lógica para suscribirse
                  console.log("Suscribirse al newsletter");
                }}
              >
                Suscribirse
              </Button>
            </form>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2024 Hotel Catleya Royal Club. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}