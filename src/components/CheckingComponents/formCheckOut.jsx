import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  RadioGroup,
  Radio,
} from "@heroui/react";
import {
  User,
  Mail,
  Phone,
  Users,
  ChevronLeft,
  Copy,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { useCart } from "../../context/cartContext";
import { post } from "../../../api/post";

export default function FormCheckOut({ setTitle, navigateViews, hasAddons }) {
  const { cart, guestCount, dateRange, setReservationId } = useCart();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [countries, setCountries] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
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

  useEffect(() => {
    setTitle("Ingresa tus Datos para la Reserva");
  }, [setTitle]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      .then((res) => res.json())
      .then((data) => {
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch((error) => console.error("Error cargando países:", error));
  }, []);

  useEffect(() => {
    setGuests((prev) => {
      const newGuests = new Array(additionalGuestsCount).fill(null);
      return newGuests.map((_, i) => prev[i] || null);
    });
  }, [additionalGuestsCount]);

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMainContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCountryChange = (key) => {
    const selected = countries.find((c) => c.name.common === key);
    setMainContact((prev) => ({
      ...prev,
      country: selected ? selected.cca2 : key,
    }));
  };

  const openGuestModal = (index) => {
    setCurrentGuestIndex(index);
    setTempGuestData(
      guests[index] || {
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        phone: "",
      }
    );
    onOpen();
  };

  const saveGuestData = () => {
    const updatedGuests = [...guests];
    updatedGuests[currentGuestIndex] = tempGuestData;
    setGuests(updatedGuests);
    onOpenChange(false);
  };

  const copyMainContactToGuest = () => {
    setTempGuestData({
      firstName: mainContact.firstName,
      lastName: mainContact.lastName,
      country: mainContact.country,
      email: mainContact.email,
      phone: mainContact.phone,
    });
  };

  const calculateGrandTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.type === "room") {
        return acc + item.price * (item.nights || 1);
      }
      return acc + item.price * (item.quantity || 1);
    }, 0);
  };

  const depositAmount = calculateGrandTotal() / 2;

  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  const validateForm = () => {
    let newErrors = {};

    if (!mainContact.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio";
    if (!mainContact.lastName.trim())
      newErrors.lastName = "El apellido es obligatorio";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mainContact.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!emailRegex.test(mainContact.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!mainContact.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (mainContact.phone.length < 7) {
      newErrors.phone = "Teléfono demasiado corto";
    }

    if (!mainContact.country) newErrors.country = "Selecciona un país";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitFinal = async () => {
    if (!validateForm()) return;

    const roomsInCart = cart.filter((item) => item.type === "room");
    const addonsInCart = cart.filter((item) => item.type === "addon");

    const formatBackendDate = (dateObj) => {
      if (!dateObj) return "";
      const year = dateObj.year;
      const month = String(dateObj.month).padStart(2, "0");
      const day = String(dateObj.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

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
      rooms: roomsInCart.map((room) => ({
        room_id: room.originalId || room.id,
        adults: room.adults || 1,
        children: room.children || 0,
      })),
      addons: addonsInCart.map((addon) => ({
        id: addon.originalId || addon.id,
        quantity: addon.quantity,
      })),
      guests: guests
        .filter((g) => g !== null && g.firstName)
        .map((g) => ({
          first_name: g.firstName,
          last_name: g.lastName,
          email: g.email || "",
          country: g.country || "",
        })),
    };
    console.log(body);

    const response = await post({
      endpoint: "/reservations",
      body: body,
    });
    console.log(response);
    if (
      response.status >= 200 &&
      response.status < 300 &&
      response.data?.status === "success"
    ) {
      const uuid = response.data.data.reservation_uuid;

      setReservationId(uuid);

      if (paymentMethod === "transferencia") {
        await post({
          endpoint: `/reservations/${uuid}/init-payment`,
          body: { payment_method: "bank_transfer" },
        });
      }
      navigateViews(3);
    } else {
      console.error("Error al procesar la reserva:", response.error);
    }
  };

  return (
    <div className="animate-appearance-in flex flex-col gap-6 pb-20 max-w-4xl mx-auto w-full">
      {hasAddons && (
        <Button
          size="sm"
          variant="light"
          className="self-start"
          startContent={<ChevronLeft size={16} />}
          onPress={() => navigateViews(1)}
        >
          Volver a Servicios Adicionales
        </Button>
      )}

      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-6 gap-6">
          <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2">
            <User className="w-5 h-5" /> Datos del Titular (Responsable)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombres"
              name="firstName"
              value={mainContact.firstName}
              onChange={handleMainChange}
              isRequired
              variant="bordered"
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
            />
            <Input
              label="Apellidos"
              name="lastName"
              value={mainContact.lastName}
              onChange={handleMainChange}
              isRequired
              variant="bordered"
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
            />
            <Autocomplete
              label="País de residencia"
              variant="bordered"
              onSelectionChange={handleMainCountryChange}
              isInvalid={!!errors.country}
              errorMessage={errors.country}
            >
              {countries.map((item) => (
                <AutocompleteItem
                  key={item.name.common}
                  startContent={
                    <Avatar
                      alt={item.name.common}
                      className="w-6 h-6"
                      src={item.flags.svg}
                    />
                  }
                  textValue={item.name.common}
                >
                  {item.name.common}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Input
              label="Teléfono"
              startContent={<Phone size={16} className="text-gray-400" />}
              name="phone"
              value={mainContact.phone}
              onChange={handleMainChange}
              variant="bordered"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone}
            />
            <Input
              label="Correo Electrónico"
              name="email"
              value={mainContact.email}
              onChange={handleMainChange}
              className="md:col-span-2"
              variant="bordered"
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <Textarea
              label="Información Adicional"
              name="preferences"
              value={mainContact.preferences}
              onChange={handleMainChange}
              className="md:col-span-2"
              variant="bordered"
            />
          </div>
        </CardBody>
      </Card>

      {additionalGuestsCount > 0 && (
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2">
                <Users className="w-5 h-5" /> Acompañantes Adicionales
              </h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                Pendientes: {additionalGuestsCount}
              </span>
            </div>
            <div className="space-y-3">
              {guests.map((guestData, index) => {
                const isCompleted = guestData && guestData.firstName;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-dashed border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`font-medium ${
                          isCompleted ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {isCompleted
                          ? `${guestData.firstName} ${guestData.lastName}`
                          : `Información Acompañante ${index + 1}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isCompleted ? "flat" : "solid"}
                      color={isCompleted ? "success" : "default"}
                      onPress={() => openGuestModal(index)}
                    >
                      {isCompleted ? "Editar" : "Agregar"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="shadow-sm border border-gray-100 overflow-hidden">
        <CardBody className="p-6">
          <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" /> Método de Pago
          </h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            color="success"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-[#476d15] bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("online")}
                >
                  <Radio value="online">
                    <span className="font-semibold text-gray-800">
                      Pago seguro con ePayco
                    </span>
                    <p className="text-xs text-gray-500">
                      PSE, Tarjetas, Nequi o Daviplata
                    </p>
                  </Radio>
                </div>
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "transferencia"
                      ? "border-[#476d15] bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("transferencia")}
                >
                  <Radio value="transferencia">
                    <span className="font-semibold text-gray-800">
                      Transferencia Bancaria
                    </span>
                    <p className="text-xs text-gray-500">
                      Manual (Ver cuentas abajo)
                    </p>
                  </Radio>
                </div>
              </div>

              {paymentMethod === "transferencia" && (
                <div className="animate-appearance-in bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5 mt-2">
                  <div className="bg-[#476d15]/10 border border-[#476d15]/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[#2c4549] font-medium uppercase tracking-wider">
                        Monto a transferir ahora (50%)
                      </p>
                      <p className="text-2xl font-bold text-[#476d15]">
                        {formatter.format(depositAmount)} COP
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 italic">
                        Total reserva: {formatter.format(calculateGrandTotal())}{" "}
                        COP
                      </p>
                      <p className="text-[10px] text-gray-500 italic">
                        El saldo restante se paga al ingresar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-[#476d15] p-1.5 rounded-full mt-0.5">
                      <CheckCircle2 className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Paso 1: Registra tu reserva
                      </p>
                      <p className="text-xs text-gray-600">
                        Primero haz clic en el botón verde de "Finalizar
                        Reserva". Una vez registrada, realiza el pago a
                        cualquiera de estas cuentas:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Bancolombia
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        7217 6161 426
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Cuenta Corriente
                      </p>
                      <p className="text-[11px] font-medium">
                        Catleya RoyalClub
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Davivienda
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        PON_AQUI_TU_NUMERO
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Cuenta de Ahorros
                      </p>
                      <p className="text-[11px] font-medium">
                        Catleya RoyalClub
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                    <p className="text-xs text-blue-800 leading-relaxed italic">
                      <strong>Instrucciones:</strong> Por favor enviar
                      comprobante por{" "}
                      <strong>{formatter.format(depositAmount)}</strong> a{" "}
                      <strong>reservas@catleyaroyalclub.com</strong> indicando
                      tu código de reserva.
                    </p>
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
        startContent={<CheckCircle2 />}
      >
        Finalizar Reserva
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Información del Acompañante {currentGuestIndex + 1}
              </ModalHeader>
              <ModalBody>
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  startContent={<Copy size={14} />}
                  onPress={copyMainContactToGuest}
                  className="mb-2"
                >
                  Copiar datos del titular
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombres"
                    value={tempGuestData.firstName || ""}
                    onChange={(e) =>
                      setTempGuestData({
                        ...tempGuestData,
                        firstName: e.target.value,
                      })
                    }
                    variant="bordered"
                  />
                  <Input
                    label="Apellidos"
                    value={tempGuestData.lastName || ""}
                    onChange={(e) =>
                      setTempGuestData({
                        ...tempGuestData,
                        lastName: e.target.value,
                      })
                    }
                    variant="bordered"
                  />
                  <Autocomplete
                    label="País"
                    variant="bordered"
                    onSelectionChange={(key) =>
                      setTempGuestData({ ...tempGuestData, country: key })
                    }
                  >
                    {countries.map((item) => (
                      <AutocompleteItem
                        key={item.cca2}
                        startContent={
                          <Avatar className="w-5 h-5" src={item.flags.svg} />
                        }
                        textValue={item.name.common}
                      >
                        {item.name.common}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Input
                    label="Teléfono (Opcional)"
                    value={tempGuestData.phone || ""}
                    onChange={(e) =>
                      setTempGuestData({
                        ...tempGuestData,
                        phone: e.target.value,
                      })
                    }
                    variant="bordered"
                  />
                  <Input
                    label="Correo Electrónico"
                    placeholder="ejemplo@correo.com"
                    className="col-span-2"
                    value={tempGuestData.email || ""}
                    onChange={(e) =>
                      setTempGuestData({
                        ...tempGuestData,
                        email: e.target.value,
                      })
                    }
                    variant="bordered"
                    startContent={<Mail size={16} className="text-gray-400" />}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#476d15] text-white"
                  onPress={saveGuestData}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
