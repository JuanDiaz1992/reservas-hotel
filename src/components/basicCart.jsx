import { Button, ScrollShadow } from "@heroui/react";
import { Trash2, CalendarClock, Minus, Plus, Users, Baby, Info } from "lucide-react";
import { useCurrency } from "../context/currencyContext";
import { useCart } from "../context/cartContext";

export default function BasicCart({ 
  onCheckout, 
  checkoutLabel = "Pagar Ahora",
  showFooter = true,
  maxHeight = "max-h-[calc(100vh-120px)]"
}) {
  const { cart, removeFromCart, totalNights, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  const calculateItemPricing = (item) => {
    const basePrice = Number(item.price) || 0;
    const extraAdultPrice = Number(item.extraAdult) || 0;
    const extraChildPrice = Number(item.extraChild) || 0;

    const extraAdultsCount = item.selectedExtras?.adults || 0;
    const extraChildrenCount = item.selectedExtras?.children || 0;

    const totalExtraAdultsCost = extraAdultsCount * extraAdultPrice;
    const totalExtraChildrenCost = extraChildrenCount * extraChildPrice;

    const pricePerNight = basePrice + totalExtraAdultsCost + totalExtraChildrenCost;
    const totalPrice = pricePerNight * item.quantity * totalNights;

    return {
      basePrice,
      extraAdultsCount,
      extraChildrenCount,
      totalExtraAdultsCost,
      totalExtraChildrenCost,
      pricePerNight,
      totalPrice
    };
  };

  const calculateGrandTotal = () => {
    return cart.reduce((total, item) => {
      const { totalPrice } = calculateItemPricing(item);
      return total + totalPrice;
    }, 0);
  };

  if (!cart || cart.length === 0) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      {totalNights > 1 && (
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center gap-2 text-amber-800 text-xs font-medium shrink-0">
          <CalendarClock className="w-3.5 h-3.5" />
          <span>Cotizando <strong>{totalNights} noches</strong></span>
        </div>
      )}

      <ScrollShadow className={`w-full ${maxHeight} overflow-y-auto p-4 custom-scrollbar grow bg-gray-50/50`}>
        <div className="space-y-3">
          {cart.map((item) => {
            const pricing = calculateItemPricing(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-300 transition-colors shadow-sm relative group"
              >
                <div className="flex justify-between items-start gap-3">
                  {item.images && item.images.length > 0 && (
                     <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-200 hidden sm:block">
                       <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[#5C6046]">
                            {formatPrice(pricing.pricePerNight)}
                        </span>
                        <span className="text-[10px] text-gray-500">/noche</span>
                      </div>

                      {(pricing.extraAdultsCount > 0 || pricing.extraChildrenCount > 0) ? (
                        <div className="bg-orange-50/50 border border-orange-100 rounded p-1.5 mt-1">
                            <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                                <Info className="w-3 h-3"/> Incluye:
                            </div>
                            
                            {pricing.extraAdultsCount > 0 && (
                                <div className="flex justify-between text-[10px] text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3"/> +{pricing.extraAdultsCount} Adulto(s)
                                    </span>
                                    <span className="font-medium">+{formatPrice(pricing.totalExtraAdultsCost)}</span>
                                </div>
                            )}

                            {pricing.extraChildrenCount > 0 && (
                                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <Baby className="w-3 h-3"/> +{pricing.extraChildrenCount} Niño(s)
                                    </span>
                                    <span className="font-medium">+{formatPrice(pricing.totalExtraChildrenCost)}</span>
                                </div>
                            )}
                            
                            <div className="border-t border-orange-200 mt-1 pt-0.5 flex justify-between text-[9px] text-gray-400">
                                <span>Precio Base:</span>
                                <span>{formatPrice(pricing.basePrice)}</span>
                            </div>
                        </div>
                      ) : (
                         <span className="text-[10px] text-gray-400">Tarifa base estándar</span>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                         <div className="flex items-center gap-1 bg-gray-50 rounded-md border border-gray-200 p-0.5">
                          <Button isIconOnly size="sm" variant="light" className="h-6 w-6 min-w-6"
                            isDisabled={item.quantity <= 1}
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          > <Minus className="h-3 w-3" /> </Button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <Button isIconOnly size="sm" variant="light" className="h-6 w-6 min-w-6"
                            isDisabled={item.quantity >= item.inventory}
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          > <Plus className="h-3 w-3" /> </Button>
                        </div>
                        <span className="text-[10px] text-gray-400">habitaciones</span>
                      </div>
                    </div>
                  </div>

                  <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-red-500 -mt-1 -mr-2"
                    onPress={() => removeFromCart(item.id)}
                  > <Trash2 className="h-4 w-4" /> </Button>
                </div>

                <div className="flex justify-end mt-2 pt-2 border-t border-gray-200 border-dashed">
                  <div className="text-right">
                    <span className="font-bold text-[#5C6046] text-sm block">
                      {formatPrice(pricing.totalPrice)}
                    </span>
                    {totalNights > 1 && (
                      <span className="text-[10px] text-gray-400 block leading-none">
                        Total ({totalNights} noches)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>

      {showFooter && (
        <div className="border-t border-gray-200 p-4 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Habitaciones</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-bold text-lg">Total a Pagar</span>
              <span className="text-xl font-bold text-[#5C6046]">
                {formatPrice(calculateGrandTotal())}
              </span>
            </div>
          </div>
          <Button className="w-full bg-[#5C6046] text-white font-medium py-3 shadow-lg"
            onPress={() => onCheckout && onCheckout({ cart, total: calculateGrandTotal() })}
          >
            {checkoutLabel}
          </Button>
        </div>
      )}
    </div>
  );
}