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
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  useDisclosure
} from "@heroui/react";
import viewElement from "../utils/scrollToObject"
import BasicModal from "./basicModal";
import { sampleRooms } from "../data";

function CardItem({ room }) {
  if (!room) {
    return <div>Habitación no encontrada</div>;
  }

  return(
    <div>
      <h2>{room.name}</h2>
      <p>{room.description}</p>
      <p>Precio: ${room.price}</p>
      <img src={room.image} alt={room.name} />
    </div>
  )
}

export default function RoomListing({ results }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const rooms = results;

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="h-4 w-4" />,
      parking: <Car className="h-4 w-4" />,
      breakfast: <Coffee className="h-4 w-4" />,
      gym: <Dumbbell className="h-4 w-4" />,
    };
    return icons[amenity] || null;
  };

  const handleOpenModal = (roomId) => {
    const room = sampleRooms.find(room => room.id === roomId);
    setSelectedRoom(room);
    onOpen();
  };

  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50/30 min-h-[60vh]">
      <div className="container mx-auto max-w-[1200px] px-4">
        {rooms.length > 0 && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-[#2c4549] mb-4 font-serif">
              Habitaciones Disponibles
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-light">
              Descubre nuestra selección de suites y habitaciones diseñadas para
              tu confort y lujo
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center py-12">
              <div className="w-full max-w-2xl text-center px-4">
                <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full animate-pulse" />
                  <div className="absolute inset-2 border border-[#5C6046]/10 rounded-full" />
                  <div className="w-16 h-16 bg-[#5C6046]/5 rounded-full flex items-center justify-center">
                    <CalendarX className="h-8 w-8 text-[#5C6046]" />
                  </div>
                </div>

                <h3 className="text-3xl font-serif text-[#2c4549] mb-3">
                  Sin disponibilidad para estas fechas
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  Lo sentimos, todas nuestras suites están reservadas para los
                  criterios seleccionados.
                  <span className="block mt-2 text-[#D4AF37] font-medium italic">
                    ¿Le gustaría que le sugiriéramos fechas alternativas?
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button className="h-12 px-8 bg-[#5C6046] hover:bg-[#4a4e38] text-white rounded-xl shadow-lg hover:shadow-[#5C6046]/30 transition-all duration-300 group" onPress={() => viewElement("disponibilidad")}>
                    <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Modificar Búsqueda
                  </Button>

                  <Button
                    variant="bordered"
                    className="h-12 px-8 border-[#D4AF37]/50 text-[#8a7035] hover:bg-[#D4AF37]/5 hover:text-[#6d5828] rounded-xl transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar Concierge
                  </Button>
                </div>

                <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
                  Catleya Royal Club Service
                </p>
              </div>
            </div>
          ) : (
            rooms.map((room) => (
              <Card
                key={room.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm py-0"
              >
                <CardBody className="p-0 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Chip className="bg-[#5C6046] text-white border-0">
                        {room.available} disponibles
                      </Chip>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Chip
                        className="bg-black/70 text-white border-0"
                        startContent={<Square className="h-3 w-3" />}
                      >
                        {room.size}m²
                      </Chip>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {room.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {room.capacity} personas
                      </div>

                      <div className="flex items-center space-x-2">
                        {room.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="text-gray-400 hover:text-[#5C6046] transition-colors"
                            title={amenity}
                          >
                            {getAmenityIcon(amenity)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" onPress={() => handleOpenModal(room.id)}>
                      Ver más Detalles
                    </Button>
                  </div>

                  <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100 px-6 pb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-[#5C6046]">
                        ${room.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${room.originalPrice}
                      </span>
                      <span className="text-xs text-[#5C6046] font-medium">
                        por noche
                      </span>
                    </div>
                    <Button className="bg-[#5C6046] hover:bg-[#4a4e38] text-white px-6 cursor-pointer">
                      Reservar
                    </Button>
                  </CardFooter>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        <BasicModal
          isOpen={isOpen}
          onOpenChange={onClose}
          size="4xl"
          Content={() => <CardItem room={selectedRoom} />}
        />

        {rooms.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              ¿No encuentras lo que buscas?{" "}
              <span className="text-[#5C6046] cursor-pointer hover:underline">
                Modifica tus fechas
              </span>
            </p>
            <Button
              variant="bordered"
              className="border-[#5C6046] text-[#5C6046] hover:bg-[#5C6046]/10 cursor-pointer"
            >
              Ver todas las habitaciones
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}