"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
} from "@heroui/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/cartContext";
import BasicCart from "./basicCart";
import { useNavigate, useLocation } from "react-router-dom";

export default function CartDropdown() {
  const { cart, setIsSidebarOpen, isSidebarOpen, isDropdownOpen, setIsDropdownOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutPath = "/checkout";

  // Sincronización con botón externo
  useEffect(() => {
    if (isDropdownOpen) {
      setIsOpen(true);
      setIsSidebarOpen(false);
      setIsDropdownOpen(false); 
    }
  }, [isDropdownOpen, setIsDropdownOpen, setIsSidebarOpen]);

  // Cerrar si se abre el sidebar (mobile)
  useEffect(() => {
    if (isSidebarOpen) {
      setIsOpen(false);
    }
  }, [isSidebarOpen]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) setIsSidebarOpen(false);
  };

  const isCheckoutPage = location.pathname.startsWith(checkoutPath);
  const shouldHide = !cart || cart.length === 0 || isCheckoutPage;

  if (shouldHide) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="bottom-end"
      offset={10}
      showArrow={true}
      shouldBlockScroll={false} // Permite scroll en la página mientras está abierto
      classNames={{
        base: "before:bg-white",
        // Añadimos overflow-hidden a content para que el scroll se maneje adentro
        content:
          "p-0 w-[320px] sm:w-[380px] border border-white/20 shadow-2xl bg-white/95 backdrop-blur-xl z-[9999] overflow-hidden",
      }}
    >
      <PopoverTrigger>
        <div className="flex items-center cursor-pointer select-none">
          <Badge
            content={cart.length}
            shape="circle"
            className="border-none bg-[#476d15] text-white font-medium shadow-sm"
          >
            <Button
              isIconOnly
              variant="light"
              className="text-white data-[hover=true]:bg-white/10 min-w-10 w-10 h-10"
              aria-label="Ver carrito"
              onPress={() => handleOpenChange(!isOpen)}
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </Badge>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        {/* Header fijo del Dropdown */}
        <div className="bg-[#222222] w-full rounded-t-xl text-white p-4 flex items-center justify-between shadow-sm z-10 relative">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <h3 className="font-medium text-sm">Tu Reserva</h3>
          </div>
          <span className="text-xs text-white/80 font-medium bg-white/10 px-2 py-0.5 rounded-full">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* CONTENEDOR DE SCROLL: Aquí es donde permitimos el scroll si hay muchos items */}
        <div className="overflow-y-auto w-full" style={{ maxHeight: "400px" }}>
          <BasicCart
            checkoutLabel="Pagar Ahora"
            onCheckout={(data) => {
              navigate("/checkout");
              setIsOpen(false);
            }}
            // maxHeight se le pasa a la lista interna de items en BasicCart
            maxHeight="none" 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}