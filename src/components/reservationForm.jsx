import { useState } from "react";
import { CalendarIcon, User, Search } from "lucide-react";
import { sampleRooms } from "../data";
import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "@heroui/react";
import { cn } from "../lib/utils";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function ReservationForm({
  onSearch,
  setResults,
  isSearching = false,
  setGuests
}) {
  const [formData, setFormData] = useState({
    checkIn: undefined,
    checkOut: undefined,
    guests: 2,
  });

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const jsData = {
        ...formData,
        checkIn: formData.checkIn ? new Date(formData.checkIn.year, formData.checkIn.month - 1, formData.checkIn.day) : undefined,
        checkOut: formData.checkOut ? new Date(formData.checkOut.year, formData.checkOut.month - 1, formData.checkOut.day) : undefined,
    }

    console.log("Búsqueda de disponibilidad:", jsData);
    setGuests(formData.guests);
    setResults(sampleRooms);

    if (onSearch) {
      onSearch(jsData);
    }
  };

  const handleDateSelect = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));

    if (field === "checkIn") {
      setCheckInOpen(false);
    } else if (field === "checkOut") {
      setCheckOutOpen(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const jsDate = new Date(date.year, date.month - 1, date.day);
    
    return jsDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-[#0f1e09]/60 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-light text-white mb-2">
              Verificar Disponibilidad
            </h2>
            <p className="text-white/70">Encuentre su suite perfecta</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90 block">
                Llegada
              </label>
              <Popover
                isOpen={checkInOpen}
                onOpenChange={setCheckInOpen}
                placement="bottom-start"
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 bg-white/5 border-white/20 text-white data-[hover=true]:bg-white/10 data-[hover=true]:text-white data-[hover=true]:border-white/30 transition-all duration-300",
                      !formData.checkIn && "text-white/60"
                    )}
                    startContent={<CalendarIcon className="h-5 w-5" />}
                  >
                    {formData.checkIn ? (
                      <span className="text-base">
                        {formatDate(formData.checkIn)}
                      </span>
                    ) : (
                      <span className="text-white/60">Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-white/95 backdrop-blur-md border-white/20">
                  <Calendar
                    aria-label="Fecha de llegada"
                    value={formData.checkIn}
                    onChange={(date) => handleDateSelect("checkIn", date)}
                    minValue={today(getLocalTimeZone())}
                    className="text-foreground"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90 block">
                Salida
              </label>
              <Popover
                isOpen={checkOutOpen}
                onOpenChange={setCheckOutOpen}
                placement="bottom-start"
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 bg-white/5 border-white/20 text-white data-[hover=true]:bg-white/10 data-[hover=true]:text-white data-[hover=true]:border-white/30 transition-all duration-300",
                      !formData.checkOut && "text-white/60"
                    )}
                    startContent={<CalendarIcon className="h-5 w-5" />}
                  >
                    {formData.checkOut ? (
                      <span className="text-base">
                        {formatDate(formData.checkOut)}
                      </span>
                    ) : (
                      <span className="text-white/60">Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-white/95 backdrop-blur-md border-white/20">
                  <Calendar
                    aria-label="Fecha de salida"
                    value={formData.checkOut}
                    onChange={(date) => handleDateSelect("checkOut", date)}
                    minValue={
                      formData.checkIn
                        ? formData.checkIn
                        : today(getLocalTimeZone())
                    }
                    className="text-foreground"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90 block">
                Huéspedes
              </label>
              <Input
                type="number"
                min="1"
                max="8"
                value={formData.guests.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    guests: parseInt(value) || 1,
                  }))
                }
                startContent={<User className="h-5 w-5 text-white/70" />}
                className="max-w-full"
                classNames={{
                  // Aquí agregamos las clases para ocultar los botones
                  input: [
                    "!text-white text-base placeholder:text-white/60",
                    "[appearance:textfield]", // Oculta en Firefox
                    "[&::-webkit-inner-spin-button]:appearance-none", // Oculta en Chrome/Safari
                    "[&::-webkit-outer-spin-button]:appearance-none", // Oculta en Chrome/Safari
                  ].join(" "), 
                  
                  inputWrapper:
                    "h-14 bg-white/5 border-white/20 data-[hover=true]:bg-white/5 data-[hover=true]:border-white/30 data-[focus=true]:bg-white/5 data-[focus=true]:border-white/30 rounded-lg",
                }}
                placeholder="Número de huéspedes"
              />
            </div>

            <Button
              type="submit"
              className="h-14 bg-[#5C6046] text-white text-lg font-medium shadow-lg data-[hover=true]:bg-[#4a4e38] data-[hover=true]:shadow-xl transition-all duration-300"
              isDisabled={isSearching}
              startContent={<Search className="h-5 w-5" />}
            >
              {isSearching ? "Buscando..." : "Ver Disponibilidad"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}