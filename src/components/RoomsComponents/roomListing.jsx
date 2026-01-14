import { useState } from "react";
import { CalendarX, AlertCircle } from "lucide-react";
import { Button, useDisclosure } from "@heroui/react";
import { addToast } from "@heroui/toast";
import viewElement from "../../utils/scrollToObject";
import BasicModal from "../basicModal";
import RoomDetail from "./roomDetail";
import ReservationCart from "../reservationCart";
import RoomCard from "./rommCard";
import { useCart } from "../../context/cartContext";

export default function RoomListing({ results, guests = 1 }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { cart, isSidebarOpen, addToCart, setIsSidebarOpen, setIsDropdownOpen } = useCart();

  const rooms = results;
  const showCapacityAlert = guests > 2;

  const handleReserve = (roomWithExtras) => {
    console.log("Datos recibidos en RoomListing:", roomWithExtras);
    addToCart({ ...roomWithExtras, type: "room" });
    addToast({
      title: "Habitación añadida",
      description: `${roomWithExtras.name} se ha agregado a tu reserva.`,
      variant: "flat",
      color: "success",
    });
    onClose();
  };

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    onOpen();
  };

  const getRoomContainerSpan = () => {
    if (isSidebarOpen && cart.length > 0) return "lg:col-span-8";
    return "lg:col-span-12";
  };

  const getInnerGridCols = () => {
    if (isSidebarOpen && cart.length > 0) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50/30 min-h-[60vh]">
      <div className="container mx-auto max-w-[1400px] px-4">
        {rooms.length > 0 && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-[#2c4549] mb-4 font-serif">
              Habitaciones Disponibles
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-light">
              Descubre nuestra selección de suites y habitaciones diseñadas para
              tu confort y lujo
            </p>
            {showCapacityAlert && rooms.length > 0 && (
              <div className="max-w-4xl mx-auto mb-10 animate-appearance-in">
                <div className="bg-amber-50 border border-amber-200/60 rounded-full px-6 py-3 flex items-center justify-center gap-3 text-amber-800 shadow-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                  <p className="text-sm font-medium">
                    Para <strong>{guests} huéspedes</strong>, recomendamos
                    reservar múltiples habitaciones (Máximo 2 personas por
                    cuarto).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          <div
            className={`${getRoomContainerSpan()} transition-all duration-500`}
          >
            {rooms.length === 0 ? (
              <div id="no-results" className="flex justify-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                <div className="w-full max-w-2xl text-center px-4">
                  <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full animate-pulse" />
                    <div className="absolute inset-2 border border-[#476d15]/10 rounded-full" />
                    <div className="w-16 h-16 bg-[#476d15]/5 rounded-full flex items-center justify-center">
                      <CalendarX className="h-8 w-8 text-[#476d15]" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-[#2c4549] mb-3">
                    Sin disponibilidad
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Lo sentimos, no encontramos habitaciones con esos criterios.
                  </p>
                  <Button
                    onPress={() => viewElement("disponibilidad")}
                    className="bg-[#476d15] text-white"
                  >
                    Modificar Búsqueda
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${getInnerGridCols()}`}>
                {rooms.map((room) => {
                  const isRoomInCart = cart.some(
                    (item) => item.type === "room" && item.id === room.id
                  );

                  return (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onOpenModal={() => handleOpenModal(room)}
                      onReserve={(updatedRoomData) =>
                        handleReserve(updatedRoomData)
                      }
                      isInCart={isRoomInCart}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {isSidebarOpen && cart.length > 0 && (
            <div className="lg:col-span-4 hidden lg:block h-full">
              <ReservationCart />
            </div>
          )}
        </div>

        <BasicModal
          isOpen={isOpen}
          onOpenChange={onClose}
          size="4xl"
          Content={() => (
            <RoomDetail
              room={selectedRoom}
              onReserve={() => handleReserve(selectedRoom)}
              isInCart={
                selectedRoom &&
                cart.some(
                  (item) => item.type === "room" && item.id === selectedRoom.id
                )
              }
            />
          )}
        />

        {isSidebarOpen && cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#476d15]">Ver Carrito</span>
              <Button
                size="sm"
                variant="flat"
                onPress={() => setIsSidebarOpen(false)}
              >
                Ocultar
              </Button>
            </div>
            <Button onPress={() => setIsDropdownOpen(true) } className="w-full bg-[#476d15] text-white">
              Ver Reserva ({cart.length})
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}