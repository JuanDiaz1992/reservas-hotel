import { useState } from "react";
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

export default function CartDropdown() {
  const { cart, setIsSidebarOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (!cart || cart.length === 0) return null;
  if(isOpen) setIsSidebarOpen(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="bottom-end"
      offset={10}
      showArrow={true}
      shouldBlockScroll={false}
      classNames={{
        base: "before:bg-white",
        content: "p-0 w-[320px] sm:w-[380px] border border-white/20 shadow-2xl bg-white/95 backdrop-blur-xl z-[9999]",
      }}
    >
      <PopoverTrigger>
        <div className="flex items-center cursor-pointer select-none">
          <Badge
            content={cart.length}
            color="danger"
            shape="circle"
            className="border-none"
          >
            <Button
              isIconOnly
              variant="light"
              className="text-white data-[hover=true]:bg-white/10 min-w-10 w-10 h-10"
              aria-label="Ver carrito"
              onPress={() => setIsOpen(!isOpen)}
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </Badge>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        {/* --- HEADER --- */}
        <div className="bg-[#5C6046] w-full rounded-t-xl text-white p-4 flex items-center justify-between shadow-sm z-10 relative">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <h3 className="font-medium text-sm">Tu Reserva</h3>
          </div>
          <span className="text-xs text-white/80 font-medium bg-white/10 px-2 py-0.5 rounded-full">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        <BasicCart 
          checkoutLabel="Pagar Ahora"
          onCheckout={(data) => {
            console.log("Ir al checkout", data);
            setIsOpen(false);
          }}
          maxHeight="max-h-[300px]"
        />
      </PopoverContent>
    </Popover>
  );
}