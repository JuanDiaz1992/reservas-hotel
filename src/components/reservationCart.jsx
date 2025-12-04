import { ShoppingBag, X } from "lucide-react";
import { Button } from "@heroui/react";
import { useCart } from "../context/cartContext";
import BasicCart from "./basicCart";

export default function ReservationCart() {
  const { cart, isSidebarOpen, setIsSidebarOpen } = useCart();

  if (!isSidebarOpen || cart.length === 0) return null;

  return (
    <aside className="h-full animate-appearance-in">
      {/* IMPORTANTE: 
         1. max-h-[calc(100vh-120px)]: Limita la altura para que no se salga de la pantalla.
         2. flex-col: Organiza Header - Lista - Footer verticalmente.
      */}
      <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        
        {/* HEADER (Fijo, no scrollea) */}
        <div className="bg-[#5C6046] text-white p-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h3 className="font-semibold">Tu Reserva</h3>
          </div>
          <Button
            isIconOnly
            variant="light"
            className="text-white min-w-8 w-8 h-8"
            onPress={() => setIsSidebarOpen(false)} 
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* BODY (BasicCart) 
           Le pasamos "flex-1 min-h-0" para que ocupe todo el espacio restante 
           y active su propio scroll interno.
        */}
        <BasicCart 
          checkoutLabel="Continuar Reserva"
          onCheckout={(data) => console.log("Checkout Data:", data)}
          maxHeight="flex-1 min-h-0" 
        />
      </div>
    </aside>
  );
}