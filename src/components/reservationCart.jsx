import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@heroui/react";

export default function ReservationCart({ cart, setCart, isVisible, setShowCart }) {
  // Si no es visible, no renderizamos nada (esto permite que la columna desaparezca en el padre)
  if (!isVisible || cart.length === 0) return null;

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) setShowCart(false);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    // ELIMINADO: fixed left-4 top-1/2 ...
    // AÑADIDO: h-full para ocupar la columna
    <aside className="h-full animate-appearance-in">
      {/* AÑADIDO: sticky top-24 para que flote al hacer scroll */}
      <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-[#5C6046] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h3 className="font-semibold">Tu Reserva</h3>
          </div>
          <Button
            isIconOnly
            variant="light"
            className="text-white min-w-8 w-8 h-8"
            onPress={() => setShowCart(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">${item.price} x noche</p>
                  </div>
                  <Button
                    isIconOnly
                    variant="light"
                    className="text-gray-400 min-w-6 w-6 h-6 hover:text-red-500"
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      className="min-w-6 w-6 h-6 bg-white border border-gray-200"
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      className="min-w-6 w-6 h-6 bg-white border border-gray-200"
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-[#5C6046] text-sm">
                    ${item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50/50">
          <div className="flex justify-between mb-4">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-xl font-bold text-[#5C6046]">
              ${calculateTotal()}
            </span>
          </div>

          <Button
            className="w-full bg-[#5C6046] text-white font-medium py-3 shadow-lg shadow-[#5C6046]/20"
            onPress={() => console.log("Checkout", cart)}
          >
            Continuar Reserva
          </Button>
        </div>
      </div>
    </aside>
  );
}