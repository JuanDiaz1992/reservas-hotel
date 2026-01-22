import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Divider,
  useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Mail,
  Calendar,
  Users as UsersIcon,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../../context/cartContext";
import { post } from "../../../api/post";
import {
  BANK_ACCOUNTS,
  TRANSFER_INSTRUCTIONS,
  SECURE_PAYMENT_INFO,
} from "../../data";
import GuestInformation from "./SubComponents/guestInformation";
import { useCurrency } from "../../context/currencyContext";
import BasicModal from "../basicModal";

export default function FormCheckOut({ setTitle, navigateViews, hasAddons }) {
  const {
    cart,
    guestCount,
    dateRange,
    totalNights,
    setReservationId,
    setSelectedPaymentMethod,
  } = useCart();

  const guestInfoRef = useRef();

  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [manualExtraGuests, setManualExtraGuests] = useState(0);

  const totalAdditionalGuests = Math.max(0, guestCount - 1 + manualExtraGuests);
  const maxCapacity = cart
    .filter((item) => item.type === "room")
    .reduce((acc, room) => {
      const cap = Number(room.capacity) || 2;
      return acc + cap * (room.quantity || 1);
    }, 0);
  const additionalGuestsCount = totalAdditionalGuests;
  const potentialExtraGuests = Math.max(0, maxCapacity - guestCount);

  const [mainContact, setMainContact] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    phone: "",
    preferences: "",
  });

  const [guests, setGuests] = useState([]);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(null);
  const [tempGuestData, setTempGuestData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle("Ingresa tus Datos para la Reserva");
  }, [setTitle]);

  useEffect(() => {
    setGuests((prev) =>
      Array.from({ length: additionalGuestsCount }, (_, i) => prev[i] || null)
    );
  }, [additionalGuestsCount]);

  const calculateGrandTotal = () => {
    return cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const nights = Number(totalNights) || 1;

      if (item.type === "room") {
        return acc + price * qty * nights;
      } else {
        return acc + price * qty;
      }
    }, 0);
  };

  const total = calculateGrandTotal();
  const depositAmount = total / 2;

  const handleSubmitFinal = async () => {
    if (guestInfoRef.current) {
      const validation = guestInfoRef.current.validate();
      if (!validation.isValid) {
        toast(validation.message, { icon: "⚠️" });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      let extraToDistribute = manualExtraGuests;
      const formatBackendDate = (d) =>
        d
          ? `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
          : "";

      const body = {
        check_in: formatBackendDate(dateRange?.start),
        check_out: formatBackendDate(dateRange?.end),
        special_requests: mainContact.preferences,
        customer: {
          first_name: mainContact.firstName,
          last_name: mainContact.lastName,
          email: mainContact.email,
          phone: mainContact.phone,
          country: mainContact.country,
        },
        rooms: cart
          .filter((i) => i.type === "room")
          .flatMap((r) =>
            Array.from({ length: r.quantity || 1 }, () => {
              let adultsInThisRoom = r.adults || 1;
              const roomMax = Number(r.capacity) || 2;

              if (extraToDistribute > 0 && adultsInThisRoom < roomMax) {
                const availableSpace = roomMax - adultsInThisRoom;
                const toAdd = Math.min(extraToDistribute, availableSpace);
                adultsInThisRoom += toAdd;
                extraToDistribute -= toAdd;
              }

              return {
                room_id: r.originalId || r.id,
                adults: adultsInThisRoom,
                children: r.children || 0,
              };
            })
          ),
        addons: cart
          .filter((i) => i.type === "addon")
          .map((a) => ({
            id: a.originalId || a.id,
            quantity: a.quantity,
          })),
        guests: guests
          .filter((g) => g?.firstName)
          .map((g) => ({
            first_name: g.firstName,
            last_name: g.lastName,
            email: g.email || "",
            country: g.country || "",
          })),
      };
      console.log(body);

      const response = await post({ endpoint: "/reservations", body });

      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.status === "success"
      ) {
        const uuid = response.data.data.reservation_uuid;
        const methodForBack =
          paymentMethod === "transferencia" ? "bank_transfer" : "epayco";

        await post({
          endpoint: `/reservations/${uuid}/init-payment`,
          body: { payment_method: methodForBack },
        });

        setReservationId(uuid);
        setSelectedPaymentMethod(methodForBack);
        navigateViews(3, uuid);
      } else {
        throw new Error(response.error || "Error en el servidor");
      }
    } catch (error) {
      toast.error("No se pudo procesar la reserva. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SecurePaymentContent = () => (
    <div className="flex flex-col gap-4 text-center py-4">
      <div className="flex justify-center">
        <div className="bg-green-50 p-4 rounded-full">
          <ShieldCheck size={40} className="text-[#476d15]" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800">Pago seguro online</h3>
      <div
        className="text-sm text-gray-600 leading-relaxed text-left"
        dangerouslySetInnerHTML={{ __html: SECURE_PAYMENT_INFO }}
      />
    </div>
  );

  return (
    <div className="animate-appearance-in flex flex-col gap-6 pb-20 max-w-4xl mx-auto w-full">
      {hasAddons && (
        <Button
          size="sm"
          variant="light"
          className="w-fit"
          startContent={<ChevronLeft size={16} />}
          onPress={() => navigateViews(1)}
          isDisabled={isSubmitting}
        >
          Volver a Servicios Adicionales
        </Button>
      )}

      {/* Resumen de Estancia Rápido */}
      <Card className="bg-[#2c4549] text-white shadow-none">
        <CardBody className="flex flex-row flex-wrap justify-around gap-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-sm">
              {dateRange?.start.day}/{dateRange?.start.month} -{" "}
              {dateRange?.end.day}/{dateRange?.end.month}
              <span className="ml-1 opacity-70">
                ({totalNights} {totalNights === 1 ? "noche" : "noches"})
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm">{guestCount} Persona(s)</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span className="text-sm text-gray-300">Total:</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </CardBody>
      </Card>

      <GuestInformation
        ref={guestInfoRef}
        mainContact={mainContact}
        setMainContact={setMainContact}
        errors={errors}
        setErrors={setErrors}
        isSubmitting={isSubmitting}
        guests={guests}
        setGuests={setGuests}
        additionalGuestsCount={additionalGuestsCount}
        tempGuestData={tempGuestData}
        setTempGuestData={setTempGuestData}
        currentGuestIndex={currentGuestIndex}
        setCurrentGuestIndex={setCurrentGuestIndex}
      />
      {potentialExtraGuests > manualExtraGuests && (
        <div className="px-2 mt-4 flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-medium">
            Tu selección de habitaciones permite hasta {maxCapacity} personas.
          </p>
          <Button
            size="sm"
            variant="flat"
            className="w-fit"
            color="primary"
            onPress={() => setManualExtraGuests((prev) => prev + 1)}
            isDisabled={guestCount + manualExtraGuests >= maxCapacity}
            startContent={<UsersIcon size={16} />}
          >
            Añadir invitado adicional ({manualExtraGuests + guestCount}/
            {maxCapacity})
          </Button>
        </div>
      )}

      {manualExtraGuests > 0 && (
        <Button
          size="xs"
          variant="light"
          color="danger"
          className="mt-1"
          onPress={() => setManualExtraGuests(0)}
        >
          Quitar invitados extra ({manualExtraGuests})
        </Button>
      )}
      {/* Sección de Pago */}
      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-6">
          <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5" /> Método de Pago
          </h3>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            color="success"
            isDisabled={isSubmitting}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "online" ? "border-[#476d15] bg-green-50" : "border-gray-200"}`}
                onClick={() => !isSubmitting && setPaymentMethod("online")}
              >
                <Radio value="online">
                  <div className="ml-2">
                    <p className="font-semibold text-gray-800">
                      Pago en línea (ePayco)
                    </p>
                    <p className="text-xs text-gray-500">
                      Tarjetas, PSE, Nequi, Daviplata
                    </p>
                  </div>
                </Radio>
              </div>

              <div
                className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "transferencia" ? "border-[#476d15] bg-green-50" : "border-gray-200"}`}
                onClick={() =>
                  !isSubmitting && setPaymentMethod("transferencia")
                }
              >
                <Radio value="transferencia">
                  <div className="ml-2">
                    <p className="font-semibold text-gray-800">
                      Transferencia Bancaria
                    </p>
                    <p className="text-xs text-gray-500">Aprobación manual</p>
                  </div>
                </Radio>
              </div>
            </div>
          </RadioGroup>

          {paymentMethod === "transferencia" && (
            <div className="mt-6 animate-appearance-in">
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      Monto a consignar (50%)
                    </p>
                    <p className="text-2xl font-bold text-[#476d15]">
                      {formatPrice(depositAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Total reserva</p>
                    <p className="text-xs font-semibold text-gray-600">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {BANK_ACCOUNTS.map((acc, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Landmark size={12} className="text-[#476d15]" />
                        <p className="text-[10px] font-bold uppercase text-gray-700">
                          {acc.bank}
                        </p>
                      </div>
                      <p className="text-sm font-mono font-bold text-gray-800">
                        {acc.number}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {acc.type} - {acc.titular}
                      </p>
                    </div>
                  ))}
                </div>

                <Divider className="my-4" />
                <div className="flex items-start gap-3 text-xs text-gray-600 italic">
                  <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p>
                      Para confirmar, envía tu comprobante a{" "}
                      <span className="font-bold text-[#476d15] not-italic">
                        {TRANSFER_INSTRUCTIONS.email}
                      </span>{" "}
                      o vía{" "}
                      <a
                        href={`https://wa.me/573104888396?text=Hola!%20Envío%20mi%20comprobante%20de%20pago.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-bold text-[#25D366] not-italic hover:underline underline-offset-2"
                      >
                        <MessageCircle size={14} className="inline" />
                        WhatsApp
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div>
        <Button
          className="w-full h-16 bg-[#476d15] text-white text-lg font-bold shadow-2xl"
          onPress={handleSubmitFinal}
          startContent={!isSubmitting && <CheckCircle2 />}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          {isSubmitting
            ? "Procesando..."
            : `Confirmar y Reservar por ${formatPrice(paymentMethod === "online" ? total : depositAmount)}`}
        </Button>
        <div className="flex flex-col items-center gap-2 mt-3">
          <p className="text-center text-[10px] text-gray-400">
            Al confirmar, aceptas nuestras políticas de reserva y cancelación.
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="text-xs text-gray-500 hover:text-gray-800 underline flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck size={14} />
            Pago seguro online, más información
          </button>
        </div>
      </div>

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        Content={SecurePaymentContent}
        size="md"
      />
    </div>
  );
}
