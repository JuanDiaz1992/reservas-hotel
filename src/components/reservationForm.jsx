import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Search,
  Calendar as CalendarIcon,
  AlertTriangle,
} from "lucide-react";
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
import { get } from "../../api/get";

export default function ReservationForm({
  onSearch,
  isSearching = false,
  setGuests,
}) {
  const [dateRange, setDateRange] = useState(null);
  const [guests, setGuestsLocal] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    isOpen: isWarningOpen,
    onOpen: onWarningOpen,
    onOpenChange: onWarningOpenChange,
  } = useDisclosure();

  const {
    setDateRange: setGlobalDateRange,
    cart,
    clearCart,
    setGuestCount,
  } = useCart();

  const isDateSelected = dateRange?.start && dateRange?.end;

  const executeSearch = async () => {
    const { start, end } = dateRange || {};
    if (cart.length > 0) clearCart();
    if (dateRange) setGlobalDateRange(dateRange);
    setGuestCount(guests);

    const formatDateForAPI = (date) => {
      if (!date) return undefined;
      return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    };

    const endpoint = `/search-rooms?check_in=${formatDateForAPI(start)}&check_out=${formatDateForAPI(end)}&guests=${guests}`;
    const { data, error } = await get({ endpoint });

    if (error) {
      console.error("Error al buscar habitaciones:", error);
      await onSearch([]);
      return;
    }
    if (setGuests) setGuests(guests);
    await onSearch(data.rooms);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cart.length > 0) onWarningOpen();
    else executeSearch();
  };

  const formatDate = (date) => {
    if (!date) return "Seleccionar";
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
      "es-ES",
      { day: "numeric", month: "short", year: "numeric" }
    );
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <div className="w-full mx-auto max-w-[900px]">
        <motion.div
          initial={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
            borderColor: "rgba(200, 200, 200, 0.5)",
          }}
          whileInView={{
            boxShadow: [
              "0px 4px 8px rgba(0, 0, 0, 0.25)",
              "0px 0px 25px 5px rgba(71, 109, 21, 0.6)",
              "0px 4px 8px rgba(0, 0, 0, 0.25)",
            ],
            borderColor: [
              "rgba(200, 200, 200, 0.5)",
              "rgba(71, 109, 21, 1)",
              "rgba(200, 200, 200, 0.5)",
            ],
          }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.64) 100%), rgba(255, 255, 255, 0.48)",
            backdropFilter: "blur(8px)",
            border: "1px solid",
          }}
          className="rounded-[40px] lg:rounded-[80px] p-[24px] w-auto"
        >
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 lg:space-y-0 w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4 items-center">
              <div className="lg:col-span-2 w-full">
                <Popover
                  placement="bottom"
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  triggerScaleOnOpen={false}
                >
                  <PopoverTrigger>
                    <Button
                      className="h-16 lg:h-14 w-full bg-white/40 border border-white/60 hover:bg-white/60 rounded-full px-4 lg:px-6 flex items-center justify-between transition-all shadow-sm"
                      disableRipple
                    >
                      {/* LLEGADA */}
                      <div className="flex-1 flex flex-col items-start justify-center h-full border-r border-gray-400/30 pr-2 lg:pr-4">
                        <span className="text-[9px] lg:text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                          Llegada
                        </span>
                        <div className="flex items-center gap-1 lg:gap-2 text-[#2c4549]">
                          <CalendarIcon className="w-3 h-3 lg:w-4 lg:h-4 text-[#476d15]" />
                          <span
                            className={`text-xs lg:text-sm ${!dateRange?.start ? "text-gray-500 italic" : "font-medium"}`}
                          >
                            {formatDate(dateRange?.start)}
                          </span>
                        </div>
                      </div>

                      {/* SALIDA - Reducimos el pl-6 a pl-2 en móvil */}
                      <div className="flex-1 flex flex-col items-start justify-center h-full pl-3 lg:pl-6">
                        <span className="text-[9px] lg:text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                          Salida
                        </span>
                        <div className="flex items-center gap-1 lg:gap-2 text-[#2c4549]">
                          <CalendarIcon className="w-3 h-3 lg:w-4 lg:h-4 text-[#476d15]" />
                          <span
                            className={`text-xs lg:text-sm ${!dateRange?.end ? "text-gray-500 italic" : "font-medium"}`}
                          >
                            {formatDate(dateRange?.end)}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                    <RangeCalendar
                      aria-label="Seleccionar rango"
                      minValue={today(getLocalTimeZone())}
                      value={dateRange}
                      onChange={setDateRange}
                      visibleMonths={isMobile ? 1 : 2}
                      showMonthAndYearPickers
                      className="max-w-full"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* INPUT HUÉSPEDES */}
              <div className="w-full">
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={guests.toString()}
                  onValueChange={(value) =>
                    setGuestsLocal(parseInt(value) || 1)
                  }
                  startContent={<User className="h-5 w-5 text-[#476d15]" />}
                  className="w-full"
                  classNames={{
                    input: "!text-[#2c4549] text-base font-medium",
                    inputWrapper:
                      "h-16 lg:h-14 bg-white/40 border border-white/60 hover:bg-white/60 rounded-full px-6 shadow-sm",
                  }}
                  placeholder="Huéspedes"
                />
              </div>

              <Button
                type="submit"
                className="h-16 lg:h-14 w-full bg-[#476d15] text-white text-lg font-medium shadow-lg hover:bg-[#4a4e38] transition-all duration-300 rounded-full"
                isDisabled={isSearching || !isDateSelected}
                startContent={<Search className="h-5 w-5" />}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <Modal
        isOpen={isWarningOpen}
        onOpenChange={onWarningOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center text-[#476d15]">
                <AlertTriangle className="w-10 h-10 text-yellow-500 mb-2" />
                Cambio de Fechas detectado
              </ModalHeader>
              <ModalBody className="text-center text-gray-600">
                <p>
                  Tienes habitaciones seleccionadas en tu carrito. Se perderá tu
                  selección si continúas.
                </p>
              </ModalBody>
              <ModalFooter className="justify-center pb-6">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#476d15] text-white"
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
