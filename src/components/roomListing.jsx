import { useState } from "react";
import {
  Users,
  Square,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  CalendarX,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  useDisclosure,
} from "@heroui/react";
import viewElement from "../utils/scrollToObject";
import BasicModal from "./basicModal";
import RoomDetail from "./roomDetail";
import ReservationCart from "./reservationCart";

const iconMap = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
  coffee: Coffee,
  default: CheckCircle2,
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || iconMap.default;
};

export default function RoomListing({ results, guests = 1 }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const rooms = results;
  
  // Lógica del aviso
  const showCapacityAlert = guests > 2;

  const handleReserve = (room) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === room.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === room.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...room, quantity: 1 }];
      }
    });
    setShowCart(true); // Activa la columna del carrito
    onClose(); // Cierra el modal si estaba abierto
  };

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    onOpen();
  };

  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50/30 min-h-[60vh]">
      <div className="container mx-auto max-w-[1200px] px-4">
        
        {/* ENCABEZADO */}
        {rooms.length > 0 && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-[#2c4549] mb-4 font-serif">
              Habitaciones Disponibles
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-light">
              Descubre nuestra selección de suites y habitaciones diseñadas para
              tu confort y lujo
            </p>
          </div>
        )}

        {/* --- AVISO DE CAPACIDAD (DISCRETO ARRIBA) --- */}
        {showCapacityAlert && rooms.length > 0 && (
          <div className="max-w-4xl mx-auto mb-10 animate-appearance-in">
            <div className="bg-amber-50 border border-amber-200/60 rounded-full px-6 py-3 flex items-center justify-center gap-3 text-amber-800 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <p className="text-sm font-medium">
                Para <strong>{guests} huéspedes</strong>, recomendamos reservar múltiples habitaciones (Máximo 2 personas por cuarto).
              </p>
            </div>
          </div>
        )}

        {/* --- GRID MAESTRO (12 Columnas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* COLUMNA DE RESULTADOS:
             - Si el carrito está oculto o vacío: Ocupa las 12 columnas (lg:col-span-12).
             - Si el carrito está visible: Ocupa 8 columnas (lg:col-span-8).
          */}
          <div className={`${showCart && cart.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-500`}>
            {rooms.length === 0 ? (
              <div className="flex justify-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                <Button onPress={() => viewElement("disponibilidad")} className="bg-[#5C6046] text-white">
                  Modificar Búsqueda
                </Button>
              </div>
            ) : (
              // GRID INTERNO DE TARJETAS
              // - Si hay carrito (espacio reducido): 2 columnas.
              // - Si NO hay carrito (espacio completo): 3 columnas.
              <div className={`grid gap-6 ${showCart && cart.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm py-0"
                  >
                    <CardBody className="p-0 overflow-hidden">
                      <div className="relative overflow-hidden h-56">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Chip className="bg-[#5C6046] text-white border-0 text-xs">
                            {room.available} disp.
                          </Chip>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {room.name}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-xs mb-4 line-clamp-2 h-8">
                          {room.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" /> {room.capacity} pers.
                          </div>
                          <div className="flex gap-2">
                            {room.amenities.slice(0, 3).map((amenity, idx) => {
                              const IconComponent = getIconComponent(amenity.icon);
                              return <IconComponent key={idx} className="w-4 h-4 text-[#5C6046]" />;
                            })}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          fullWidth
                          size="sm"
                          onPress={() => handleOpenModal(room)}
                          className="mb-0"
                        >
                          Ver Detalles
                        </Button>
                      </div>

                      <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100 px-5 pb-5">
                        <div className="flex flex-col items-start">
                          <span className="text-xl font-bold text-[#5C6046]">
                            ${room.price}
                          </span>
                        </div>
                        <Button 
                          className="bg-[#5C6046] hover:bg-[#4a4e38] text-white px-6"
                          size="sm"
                          onPress={() => handleReserve(room)}
                        >
                          Reservar
                        </Button>
                      </CardFooter>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DEL CARRITO (STICKY) 
              Ocupa 4 columnas.
          */}
          {showCart && cart.length > 0 && (
             <div className="lg:col-span-4 hidden lg:block h-full">
                <ReservationCart
                  cart={cart}
                  setCart={setCart}
                  isVisible={showCart}
                  setShowCart={setShowCart}
                />
             </div>
          )}

        </div>

        {/* MODAL Y FOOTER */}
        <BasicModal
          isOpen={isOpen}
          onOpenChange={onClose}
          size="4xl"
          Content={() => (
            <RoomDetail
              room={selectedRoom}
              onReserve={() => handleReserve(selectedRoom)}
            />
          )}
        />
        
        {/* Carrito Flotante (Solo Móvil) */}
        {showCart && cart.length > 0 && (
           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center mb-2">
                 <span className="font-bold text-[#5C6046]">Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                 <Button size="sm" variant="flat" onPress={() => setShowCart(false)}>Ocultar</Button>
              </div>
              <Button className="w-full bg-[#5C6046] text-white">Ver Reserva ({cart.length})</Button>
           </div>
        )}

        {rooms.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="bordered" className="border-[#5C6046] text-[#5C6046]">
              Ver todas las habitaciones
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}