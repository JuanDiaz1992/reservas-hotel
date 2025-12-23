import { useState, useEffect } from "react";
import { Button, ScrollShadow } from "@heroui/react";
import {
  Trash2,
  CalendarClock,
  Minus,
  Plus,
  AlertTriangle,
  AlertCircle,
  ShoppingBag,
  BedDouble,
} from "lucide-react";
import { useCurrency } from "../context/currencyContext";
import { useCart } from "../context/cartContext";
import { Link, useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/scrollToTop";

function CartImage({ src, alt }) {
  const fallback = "/images/no_picture.webp";
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImgSrc(fallback)}
    />
  );
}

export default function BasicCart({
  onCheckout,
  checkoutLabel = "Pagar Ahora",
  showFooter = true,
  maxHeight = "max-h-[calc(100vh-120px)]",
  hideCheckoutButton = false,
}) {
  const {
    cart,
    removeFromCart,
    totalNights,
    updateQuantity,
    guestCount,
    clearCart,
  } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (cart.length > 0) {
      const hasRoom = cart.some((item) => item.type === "room");
      if (!hasRoom) {
        clearCart();
      }
    }
  }, [cart, clearCart]);

  const calculateItemPricing = (item) => {
    if (item.type === "addon") {
      const basePrice = Number(item.price) || 0;
      return {
        basePrice,
        priceDisplay: basePrice,
        totalPrice: basePrice * item.quantity,
        isAddon: true,
      };
    }

    const basePrice = Number(item.price) || 0;
    const extraAdultPrice = Number(item.extraAdult) || 0;
    const extraChildPrice = Number(item.extraChild) || 0;

    const extraAdultsCount = item.selectedExtras?.adults || 0;
    const extraChildrenCount = item.selectedExtras?.children || 0;

    const pricePerNight =
      basePrice +
      extraAdultsCount * extraAdultPrice +
      extraChildrenCount * extraChildPrice;

    return {
      basePrice,
      priceDisplay: pricePerNight,
      totalPrice: pricePerNight * item.quantity * totalNights,
      isAddon: false,
    };
  };

  const calculateGrandTotal = () => {
    return cart.reduce(
      (total, item) => total + calculateItemPricing(item).totalPrice,
      0
    );
  };

  const calculateTotalCapacity = () => {
    return cart.reduce((total, item) => {
      if (item.type === "room") {
        const baseOccupancyForPricing = 2;
        const extras =
          (item.selectedExtras?.adults || 0) +
          (item.selectedExtras?.children || 0);
        return total + (baseOccupancyForPricing * item.quantity + extras);
      }
      return total;
    }, 0);
  };

  const currentCapacity = calculateTotalCapacity();
  const missingGuests = guestCount - currentCapacity;
  const extraSpots = currentCapacity - guestCount;
  const isCapacitySufficient = missingGuests <= 0;
  const isOverCapacity = isCapacitySufficient && extraSpots > 2;
  const location = useLocation();

  if (!cart || cart.length === 0) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      {totalNights > 1 && (
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center gap-2 text-amber-800 text-xs font-medium shrink-0">
          <CalendarClock className="w-3.5 h-3.5" />
          <span>
            Cotizando <strong>{totalNights} noches</strong>
          </span>
        </div>
      )}

      {!isCapacitySufficient && (
        <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-start gap-3 text-red-800 text-xs shrink-0 animate-appearance-in">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold">Capacidad insuficiente</span>
            <span className="opacity-90">
              Grupo de <strong>{guestCount}</strong>, espacio para{" "}
              <strong>{currentCapacity}</strong>.{" "}
              {location.pathname !== "/" && (
                <Link to="/" className="underline" onClick={scrollToTop}>
                  Regresa a la página de reservas
                </Link>
              )}
            </span>
          </div>
        </div>
      )}

      {isOverCapacity && (
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-start gap-3 text-blue-800 text-xs shrink-0 animate-appearance-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold">¿Demasiado espacio?</span>
            <span className="opacity-90">
              Sobran <strong>{extraSpots}</strong> lugares.
            </span>
          </div>
        </div>
      )}

      <ScrollShadow
        className={`w-full ${maxHeight} overflow-y-auto p-4 custom-scrollbar grow bg-gray-50/50`}
      >
        <div className="space-y-3">
          {cart.map((item) => {
            const pricing = calculateItemPricing(item);
            const displayImage =
              item.type === "room" ? item.images && item.images[0] : item.image;

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-300 transition-colors shadow-sm relative group"
              >
                <div className="absolute top-2 right-2 opacity-50">
                  {item.type === "room" ? (
                    <BedDouble size={14} />
                  ) : (
                    <ShoppingBag size={14} />
                  )}
                </div>

                <div className="flex justify-between items-start gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-200 hidden sm:block">
                    <CartImage src={displayImage} alt={item.name} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate pr-6">
                      {item.name}
                    </h4>

                    {item.type === "room" && (
                      <p className="text-[10px] text-gray-400">
                        {item.capacity} Pers. • {item.size}m²
                      </p>
                    )}

                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[#476d15]">
                          {formatPrice(pricing.priceDisplay)}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {item.type === "room" ? " /noche" : " /unidad"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-md border border-gray-200 p-0.5">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-6 w-6 min-w-6"
                            isDisabled={item.quantity <= 1}
                            onPress={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-6 w-6 min-w-6"
                            isDisabled={
                              item.available_stock &&
                              item.quantity >= item.available_stock
                            }
                            onPress={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-gray-400 hover:text-red-500 ml-auto"
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>

      {showFooter && (
        <div className="border-t border-gray-200 p-4 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 rounded-b-3xl">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Huéspedes requeridos</span>
              <span className="font-medium">{guestCount}</span>
            </div>

            <div
              className={`flex justify-between text-sm ${
                !isCapacitySufficient
                  ? "text-red-600 font-bold"
                  : isOverCapacity
                    ? "text-blue-600 font-bold"
                    : "text-green-600"
              }`}
            >
              <span>Capacidad actual</span>
              <span>{currentCapacity}</span>
            </div>

            <div className="flex justify-between items-end pt-2 border-t border-gray-200">
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-lg">Total</span>
                {totalNights > 1 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-green-700 font-semibold uppercase tracking-wider">
                      Anticipo del 50% para reservar
                    </span>
                    <span className="text-[10px] text-gray-500 font-normal leading-tight">
                      Pago hoy: 50% del valor base.{" "}
                      {cart.some((i) => i.type === "addon")
                        ? "Incluye extras."
                        : ""}
                      <br />
                      Los impuestos (IVA) se cancelan directamente en el hotel.
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xl font-bold text-[#476d15]">
                {formatPrice(calculateGrandTotal())}
              </span>
            </div>
          </div>

          {!hideCheckoutButton && (
            <Button
              className={`w-full text-white font-medium py-3 shadow-lg ${
                !isCapacitySufficient
                  ? "bg-gray-400 opacity-50"
                  : "bg-[#476d15]"
              }`}
              onPress={() =>
                onCheckout && onCheckout({ cart, total: calculateGrandTotal() })
              }
              isDisabled={!isCapacitySufficient}
            >
              {!isCapacitySufficient
                ? "Agrega más habitaciones"
                : checkoutLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
