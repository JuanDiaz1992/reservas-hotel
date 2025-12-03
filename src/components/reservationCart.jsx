import { ShoppingBag, X, Trash2, CalendarClock } from "lucide-react";
import { Button } from "@heroui/react";
import { useCurrency } from "../context/currencyContext";
import { useCart } from "../context/cartContext";

export default function ReservationCart() {
  const { formatPrice } = useCurrency();

  const { cart, removeFromCart, isSidebarOpen, setIsSidebarOpen, totalNights } = useCart();

  // Si no está abierto el sidebar o no hay items, no mostramos nada
  if (!isSidebarOpen || cart.length === 0) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * totalNights, 0);
  };

  return (
    <aside className="h-full animate-appearance-in">
      <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        
        <div className="bg-[#5C6046] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h3 className="font-semibold">Tu Reserva</h3>
          </div>
          <Button
            isIconOnly
            variant="light"
            className="text-white min-w-8 w-8 h-8"
            // Cierra el sidebar al hacer click
            onPress={() => setIsSidebarOpen(false)} 
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {totalNights > 1 && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center gap-2 text-amber-800 text-xs font-medium">
            <CalendarClock className="w-3.5 h-3.5" />
            <span>
              Cotizando para <strong>{totalNights} noches</strong>
            </span>
          </div>
        )}

        <div className="overflow-y-auto p-4 custom-scrollbar grow">
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price)} / noche
                      </p>
                      <span className="text-[10px] bg-white border border-gray-200 px-1.5 rounded text-gray-400">
                        x1
                      </span>
                    </div>
                  </div>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-gray-400 hover:text-red-500 -mt-1 -mr-2"
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-end mt-2 pt-2 border-t border-gray-200 border-dashed">
                  <div className="text-right">
                    <span className="font-bold text-[#5C6046] text-sm block">
                      {formatPrice(item.price * totalNights)}
                    </span>
                    {totalNights > 1 && (
                      <span className="text-[10px] text-gray-400 block leading-none">
                        Total ({totalNights} noches)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50/50 shrink-0">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Habitaciones</span>
              <span>{cart.length}</span>
            </div>
            {totalNights > 1 && (
               <div className="flex justify-between text-sm text-gray-600">
                 <span>Estancia</span>
                 <span>{totalNights} noches</span>
               </div>
            )}
            <div className="flex justify-between items-end pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-bold text-lg">Total</span>
              <span className="text-xl font-bold text-[#5C6046]">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-[#5C6046] text-white font-medium py-3 shadow-lg shadow-[#5C6046]/20"
            onPress={() =>
              console.log("Checkout Data:", {
                items: cart,
                nights: totalNights,
                totalCOP: calculateTotal(),
              })
            }
          >
            Continuar Reserva
          </Button>
        </div>
      </div>
    </aside>
  );
}