import { ShoppingBag, X } from "lucide-react";
import { Button } from "@heroui/react";
import { useCart } from "../context/cartContext";
import BasicCart from "./basicCart";
import { useNavigate } from "react-router-dom";

export default function ReservationCart() {
  const { cart, isSidebarOpen, setIsSidebarOpen } = useCart();

  const navigate = useNavigate();
  if (!isSidebarOpen || cart.length === 0) return null;

  return (
    <aside className="h-full animate-appearance-in">
      <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        <div className="bg-[#222222] text-white p-4 flex items-center justify-between shrink-0 z-20">
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

        <BasicCart
          checkoutLabel="Continuar Reserva"
          onCheckout={(data) => navigate("/checkout")}
          maxHeight="flex-1 min-h-0"
        />
      </div>
    </aside>
  );
}
