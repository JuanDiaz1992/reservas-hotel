import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@heroui/react";
import { useCart } from "../../context/cartContext";
import BasicCart from "../basicCart";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../../utils/scrollToTop";

export default function CheckOutCart({ view, setView, onFinalSubmit }) {
  const { cart } = useCart();
  const navigate = useNavigate();

const handleCheckoutAction = () => {
    if (view === 1) {
      setView(2);
      scrollToTop();
    } else {
      onFinalSubmit();
    }
  };

  return (
    <aside className="h-full animate-appearance-in">
      {cart.length === 0 ? (
        <div className="sticky top-24 flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl h-auto min-h-[400px] text-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 group transition-all duration-300 hover:bg-[#476d15]/10">
            <ShoppingBag className="h-10 w-10 text-gray-300 group-hover:text-[#476d15] transition-colors duration-300" />
          </div>

          <h3 className="text-2xl font-serif text-[#2c4549] mb-3">
            Tu carrito está vacío
          </h3>

          <p className="text-gray-500 mb-8 max-w-[260px] leading-relaxed">
            Aún no has seleccionado habitaciones o servicios para tu estadía.
          </p>

          <Button
            className="bg-[#476d15] text-white font-semibold shadow-lg shadow-[#476d15]/20 hover:shadow-xl hover:bg-[#3a5a10] transition-all"
            size="lg"
            startContent={<ArrowLeft className="w-4 h-4" />}
            onPress={() => {
              navigate("/");
              scrollToTop();
            }}
          >
            Explorar Habitaciones
          </Button>
        </div>
      ) : (
        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
          <div className="bg-[#222222] text-white p-4 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h3 className="font-semibold">Tu Reserva</h3>
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>
          </div>

          <BasicCart
            checkoutLabel={view === 2 ? "Finalizar Reserva" : "Continuar Reserva"}
            onCheckout={handleCheckoutAction}
            maxHeight="flex-1 min-h-0"
            hideCheckoutButton={view === 2}
          />
        </div>
      )}
    </aside>
  );
}