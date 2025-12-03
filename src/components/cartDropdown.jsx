import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
  ScrollShadow,
} from "@heroui/react";
import { ShoppingBag, Trash2, CalendarClock } from "lucide-react";
import { useCart } from "../context/cartContext";
import { useCurrency } from "../context/currencyContext";

export default function CartDropdown() {
  const { cart, removeFromCart, totalNights } = useCart();
  const { formatPrice } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);

  if (!cart || cart.length === 0) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * totalNights, 0);
  };

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

        {/* --- AVISO NOCHES --- */}
        {totalNights > 1 && (
          <div className="w-full bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center gap-2 text-amber-800 text-xs">
            <CalendarClock className="w-3 h-3" />
            <span>
              Calculado para <strong>{totalNights} noches</strong>
            </span>
          </div>
        )}

        {/* --- LISTA DE ITEMS --- */}
        <ScrollShadow className="w-full max-h-[300px] overflow-y-auto p-2 bg-gray-50/50">
          <div className="w-full flex flex-col gap-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex gap-3 relative group hover:border-gray-300 transition-all"
              >
                {/* Imagen Miniatura */}
                <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-200">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <h4 className="font-semibold text-gray-800 text-xs line-clamp-1 pr-6">
                    {item.name}
                  </h4>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500">
                      {formatPrice(item.price)} / noche
                    </span>
                    <span className="font-bold text-[#5C6046] text-sm">
                      {formatPrice(item.price * totalNights)}
                    </span>
                  </div>
                </div>

                {/* Botón Borrar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(item.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollShadow>

        {/* --- FOOTER --- */}
        <div className="w-full rounded-b-xl border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
          <div className="flex justify-between items-end mb-4">
            <span className="text-sm text-gray-600 font-medium">Total</span>
            <span className="text-xl font-bold text-[#5C6046]">
              {formatPrice(calculateTotal())}
            </span>
          </div>

          <Button
            className="w-full bg-[#5C6046] text-white font-medium py-2 shadow-md hover:bg-[#4a4e38]"
            size="md"
            onPress={() => {
              console.log("Ir al checkout", { cart, total: calculateTotal() });
              setIsOpen(false);
            }}
          >
            Pagar Ahora
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}