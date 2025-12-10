import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import CurrencySelector from "./currencySelector";
import CartDropdown from "./cartDropdown";

export default function Component() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      position="sticky"
      isBlurred={false}
      className={`fixed top-0 transition-all duration-300 ${
        isScrolled
          ? "bg-[#424436]/30 backdrop-blur-md border-b border-white/10"
          : "bg-transparent backdrop-blur-none border-transparent"
      }`}
    >
      <NavbarContent>
        <NavbarBrand>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.webp"
              alt="Logo"
              className="rounded-full max-w-10"
            />
            <p className="text-xl font-bold text-white">
              Hotel Catleya Royal Club
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            as={Link}
            to="/"
            variant="light"
            className="text-white data-[hover=true]:bg-white/10"
          >
            Inicio
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            to="/"
            variant="light"
            className="text-white data-[hover=true]:bg-white/10"
          >
            Habitaciones
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            to="/about"
            variant="light"
            className="text-white data-[hover=true]:bg-white/10"
          >
            Nosotros
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            to="/contact"
            variant="light"
            className="text-white data-[hover=true]:bg-white/10"
          >
            Contacto
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="bordered"
            className="border-white hover:bg-[#5C6046]/20 text-white hover:border-[#5C6046]"
          >
            Reserva Ahora
          </Button>

          <Button
            as={Link}
            to="/loguin"
            className="bg-[#5C6046] text-white hover:bg-white/90 hover:text-[#5C6046]"
          >
            Miembros
          </Button>

          <div className="flex items-center border-l border-white/20 pl-2 ml-2 gap-1">
            <CurrencySelector />
            <CartDropdown />
          </div>
        </div>

        {/* --- MENU MÓVIL --- */}
        <div className="flex md:hidden items-center gap-2">
          <CartDropdown />

          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="text-white"
          />
        </div>
      </NavbarContent>

      <NavbarMenu className="bg-black/95 backdrop-blur-md border-l border-white/10 pt-8">
        <NavbarMenuItem>
          <Link
            to="/"
            className="w-full text-lg text-white hover:text-white/80 py-2 block"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            to="/habitaciones"
            className="w-full text-lg text-white hover:text-white/80 py-2 block"
            onClick={() => setIsMenuOpen(false)}
          >
            Habitaciones
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            to="/loguin"
            className="w-full text-lg text-white hover:text-white/80 py-2 block"
            onClick={() => setIsMenuOpen(false)}
          >
            Miembros
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
