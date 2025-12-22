import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  addToast,
} from "@heroui/react";
import {
  ChevronLeft,
  CheckCircle2,
  CreditCard,
  Info,
  Landmark,
  Mail,
} from "lucide-react";
import { useCart } from "../../context/cartContext";
import { post } from "../../../api/post";
import { BANK_ACCOUNTS, TRANSFER_INSTRUCTIONS } from "../../data";
import GuestInformation from "./SubComponents/guestInformation";

export default function FormCheckOut({ setTitle, navigateViews, hasAddons }) {
  const {
    cart,
    guestCount,
    dateRange,
    setReservationId,
    setSelectedPaymentMethod,
  } = useCart();
  const [countries, setCountries] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const additionalGuestsCount = Math.max(0, guestCount - 1);

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

  useEffect(() => setTitle("Ingresa tus Datos para la Reserva"), [setTitle]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        )
      )
      .catch((err) => console.error("Error países:", err));
  }, []);

  useEffect(() => {
    setGuests((prev) =>
      Array.from({ length: additionalGuestsCount }, (_, i) => prev[i] || null)
    );
  }, [additionalGuestsCount]);

  const validateForm = () => {
    let newErrors = {};
    if (!mainContact.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio";
    if (!mainContact.lastName.trim())
      newErrors.lastName = "El apellido es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mainContact.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!emailRegex.test(mainContact.email))
      newErrors.email = "Formato inválido";
    if (!mainContact.phone.trim())
      newErrors.phone = "El teléfono es obligatorio";
    if (!mainContact.country) newErrors.country = "Selecciona un país";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateGrandTotal = () =>
    cart.reduce(
      (acc, item) =>
        acc +
        item.price *
          (item.type === "room" ? item.nights || 1 : item.quantity || 1),
      0
    );
  const depositAmount = calculateGrandTotal() / 2;
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  const handleSubmitFinal = async () => {
    if (!validateForm()) {
      addToast({
        title: "Atención",
        description: "Completa los campos obligatorios",
        color: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
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
          .map((r) => ({
            room_id: r.originalId || r.id,
            adults: r.adults || 1,
            children: r.children || 0,
          })),
        addons: cart
          .filter((i) => i.type === "addon")
          .map((a) => ({ id: a.originalId || a.id, quantity: a.quantity })),
        guests: guests
          .filter((g) => g?.firstName)
          .map((g) => ({
            first_name: g.firstName,
            last_name: g.lastName,
            email: g.email || "",
            country: g.country || "",
          })),
      };

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
        throw new Error(response.error || "Error en la respuesta del servidor");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo procesar la reserva.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-appearance-in flex flex-col gap-6 pb-20 max-w-4xl mx-auto w-full">
      {hasAddons && (
        <Button
          size="sm"
          variant="light"
          startContent={<ChevronLeft size={16} />}
          onPress={() => navigateViews(1)}
          isDisabled={isSubmitting}
        >
          Volver a Servicios Adicionales
        </Button>
      )}

      <GuestInformation
        mainContact={mainContact}
        setMainContact={setMainContact}
        countries={countries}
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

      <Card className="shadow-sm border border-gray-100 overflow-hidden">
        <CardBody className="p-6">
          <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" /> Método de Pago
          </h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            color="success"
            isDisabled={isSubmitting}
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "online" ? "border-[#476d15] bg-green-50" : "border-gray-200"}`}
                  onClick={() => !isSubmitting && setPaymentMethod("online")}
                >
                  <Radio value="online">
                    <span className="font-semibold text-gray-800">
                      Pago seguro ePayco
                    </span>
                    <p className="text-xs text-gray-500">
                      PSE, Tarjetas, Nequi
                    </p>
                  </Radio>
                </div>
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "transferencia" ? "border-[#476d15] bg-green-50" : "border-gray-200"}`}
                  onClick={() =>
                    !isSubmitting && setPaymentMethod("transferencia")
                  }
                >
                  <Radio value="transferencia">
                    <span className="font-semibold text-gray-800">
                      Transferencia Bancaria
                    </span>
                    <p className="text-xs text-gray-500">
                      Manual (Ver cuentas)
                    </p>
                  </Radio>
                </div>
              </div>

              {paymentMethod === "transferencia" && (
                <div className="animate-appearance-in flex flex-col gap-4">
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5">
                    <div className="bg-[#476d15]/10 border border-[#476d15]/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-[#2c4549] font-medium uppercase">
                          Monto a transferir ({TRANSFER_INSTRUCTIONS.percentage}
                          %)
                        </p>
                        <p className="text-2xl font-bold text-[#476d15]">
                          {formatter.format(depositAmount)} COP
                        </p>
                      </div>
                      <div className="text-right text-[10px] text-gray-500 italic">
                        <p>
                          Total: {formatter.format(calculateGrandTotal())} COP
                        </p>
                        <p>El saldo restante se paga al ingresar.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {BANK_ACCOUNTS.map((acc, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <p className="text-[10px] uppercase text-gray-400 font-bold flex items-center gap-1">
                            <Landmark size={10} /> {acc.bank}
                          </p>
                          <p className="text-sm font-bold text-gray-700">
                            {acc.number}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight">
                            {acc.type}
                            <br />
                            {acc.titular || "Catleya RoyalClub"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
                      <Mail size={14} className="text-gray-400" />
                      <p>
                        Instrucciones: Enviar comprobante a{" "}
                        <strong>{TRANSFER_INSTRUCTIONS.email}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        </CardBody>
      </Card>

      <Button
        className="w-full h-14 bg-[#476d15] text-white text-lg font-bold shadow-xl mt-4"
        onPress={handleSubmitFinal}
        startContent={!isSubmitting && <CheckCircle2 />}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Procesando..." : "Finalizar Reserva"}
      </Button>
    </div>
  );
}
