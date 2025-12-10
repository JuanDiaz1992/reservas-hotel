import { useState } from "react";
import {
  User,
  Search,
  Calendar as CalendarIcon,
  AlertTriangle,
} from "lucide-react";
import { sampleRooms } from "../data";
import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RangeCalendar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useCart } from "../context/cartContext";

export default function ReservationForm({
  onSearch,
  setResults,
  isSearching = false,
  setGuests,
}) {
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuestsLocal] = useState(2);
  const [isOpen, setIsOpen] = useState(false);

  const {
    isOpen: isWarningOpen,
    onOpen: onWarningOpen,
    onOpenChange: onWarningOpenChange,
  } = useDisclosure();

  const { setDateRange: setGlobalDateRange, cart, clearCart, setGuestCount } = useCart();

  const isDateSelected = dateRange?.start && dateRange?.end;

  const executeSearch = () => {
    const { start, end } = dateRange || {};

    if (cart.length > 0) {
      clearCart();
    }

    if (dateRange) {
      setGlobalDateRange(dateRange);
    }
    setGuestCount(guests);

    const jsData = {
      guests: guests,
      checkIn: start
        ? new Date(start.year, start.month - 1, start.day)
        : undefined,
      checkOut: end ? new Date(end.year, end.month - 1, end.day) : undefined,
    };

    console.log("Búsqueda de disponibilidad:", jsData);

    if (onSearch) {
      setGuests(guests);
      setResults(sampleRooms);
      onSearch(jsData);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (cart.length > 0) {
      onWarningOpen();
    } else {
      executeSearch();
    }
  };

  const formatDate = (date) => {
    if (!date) return "Seleccionar";
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
      "es-ES",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <div className="w-full mx-auto max-w-[900px]">
        <div
          style={{
            borderRadius: "80px",
            padding: "24px",
            width: "auto",
            border: "1px solid rgba(200, 200, 200, 0.5)",
            background:
              "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.64) 100%), rgba(255, 255, 255, 0.48)",
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 8px 0px",
            backdropFilter: "blur(8px)",
          }}
          className="transition-all"
        >
          <form onSubmit={handleFormSubmit} className="space-y-2 lg:space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              {/* SECCIÓN FECHAS */}
              <div className="lg:col-span-2">
                <Popover
                  placement="bottom"
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  triggerScaleOnOpen={false}
                >
                  <PopoverTrigger>
                    <Button
                      className="h-14 w-full bg-white/40 border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-full px-6 flex items-center justify-between transition-all group shadow-sm"
                      disableRipple
                    >
                      <div className="flex-1 flex flex-col items-start justify-center h-full border-r border-gray-400/30 pr-4">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">
                          Llegada
                        </span>
                        <div className="flex items-center gap-2 text-[#2c4549]">
                          <CalendarIcon className="w-4 h-4 text-[#5C6046]" />
                          <span
                            className={`text-sm ${
                              !dateRange?.start
                                ? "text-gray-500 italic"
                                : "font-medium"
                            }`}
                          >
                            {formatDate(dateRange?.start)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-start justify-center h-full pl-6">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">
                          Salida
                        </span>
                        <div className="flex items-center gap-2 text-[#2c4549]">
                          <CalendarIcon className="w-4 h-4 text-[#5C6046]" />
                          <span
                            className={`text-sm ${
                              !dateRange?.end
                                ? "text-gray-500 italic"
                                : "font-medium"
                            }`}
                          >
                            {formatDate(dateRange?.end)}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
                    <RangeCalendar
                      aria-label="Seleccionar rango"
                      minValue={today(getLocalTimeZone())}
                      value={dateRange}
                      onChange={setDateRange}
                      visibleMonths={2}
                      showMonthAndYearPickers
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* SECCIÓN HUÉSPEDES */}
              <div>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={guests.toString()}
                  onValueChange={(value) =>
                    setGuestsLocal(parseInt(value) || 1)
                  }
                  startContent={<User className="h-5 w-5 text-[#5C6046]" />}
                  className="max-w-full"
                  classNames={{
                    input: [
                      "!text-[#2c4549] text-base placeholder:text-gray-500 font-medium",
                      "[appearance:textfield]",
                      "[&::-webkit-inner-spin-button]:appearance-none",
                      "[&::-webkit-outer-spin-button]:appearance-none",
                    ].join(" "),
                    inputWrapper:
                      "h-14 bg-white/40 border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-full px-6 shadow-sm",
                  }}
                  placeholder="Huéspedes"
                />
              </div>

              {/* BOTÓN BUSCAR */}
              <Button
                type="submit"
                className="h-14 w-full bg-[#5C6046] text-white text-lg font-medium shadow-lg hover:bg-[#4a4e38] transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                // Aquí aplicamos la lógica: Si está buscando O NO hay fechas seleccionadas -> Deshabilitado
                isDisabled={isSearching || !isDateSelected}
                startContent={<Search className="h-5 w-5" />}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL DE ADVERTENCIA */}
      <Modal
        isOpen={isWarningOpen}
        onOpenChange={onWarningOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center text-[#5C6046]">
                <AlertTriangle className="w-10 h-10 text-yellow-500 mb-2" />
                Cambio de Fechas detectado
              </ModalHeader>
              <ModalBody className="text-center text-gray-600">
                <p>
                  Tienes habitaciones seleccionadas en tu carrito. Si realizas
                  una nueva búsqueda con fechas diferentes,
                  <strong> se perderá tu selección actual</strong>.
                </p>
                <p>¿Deseas continuar y vaciar el carrito?</p>
              </ModalBody>
              <ModalFooter className="justify-center pb-6">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#5C6046] text-white"
                  onPress={() => {
                    executeSearch();
                    onClose();
                  }}
                >
                  Sí, buscar de todas formas
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
