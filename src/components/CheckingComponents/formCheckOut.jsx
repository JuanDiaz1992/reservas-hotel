import React, { useState, useEffect } from "react";
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
} from "@heroui/react";
import {
  User,
  Mail,
  Phone,
  FileText,
  Users,
  ChevronLeft,
  PlusCircle,
  Copy,
} from "lucide-react";
import { useCart } from "../../context/cartContext";

export default function FormCheckOut({ setTitle, navigateViews }) {
  setTitle("Ingresa tus Datos para la Reserva");
  const { guestCount } = useCart();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      .then((res) => res.json())
      .then((data) => {
        // Ordenamos alfabéticamente
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch((error) => console.error("Error cargando países:", error));
  }, []);

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

  useEffect(() => {
    setGuests((prev) => {
      const newGuests = new Array(guestCount).fill(null);
      return newGuests.map((_, i) => prev[i] || null);
    });
  }, [guestCount]);

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMainContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCountryChange = (key) => {
    setMainContact((prev) => ({ ...prev, country: key }));
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

  const handleGuestModalChange = (e) => {
    const { name, value } = e.target;
    setTempGuestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestCountryChange = (key) => {
    setTempGuestData((prev) => ({ ...prev, country: key }));
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

  const handleSubmit = () => {
    console.log("Titular:", mainContact);
    console.log("Huéspedes:", guests);
  };

  return (
    <div className="animate-appearance-in flex flex-col gap-6 pb-20 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="light"
          startContent={<ChevronLeft size={16} />}
          onPress={() => navigateViews(1)}
        >
          Volver a Servicios Adicionales
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-6 gap-6">
          <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2">
            <User className="w-5 h-5" /> Datos del Titular
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombres"
              placeholder="Ej. Juan"
              name="firstName"
              value={mainContact.firstName}
              onChange={handleMainChange}
              isRequired
              variant="bordered"
            />
            <Input
              label="Apellidos"
              placeholder="Ej. Pérez"
              name="lastName"
              value={mainContact.lastName}
              onChange={handleMainChange}
              isRequired
              variant="bordered"
            />

            <Autocomplete
              label="País de residencia"
              placeholder="Busca tu país"
              variant="bordered"
              selectedKey={mainContact.country}
              onSelectionChange={handleMainCountryChange}
              inputProps={{
                autoComplete: "new-password",
              }}
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
              placeholder="+57 300 000 0000"
              startContent={<Phone size={16} className="text-gray-400" />}
              name="phone"
              value={mainContact.phone}
              onChange={handleMainChange}
              type="tel"
              variant="bordered"
            />
            <Input
              label="Correo Electrónico"
              placeholder="juan@ejemplo.com"
              startContent={<Mail size={16} className="text-gray-400" />}
              name="email"
              value={mainContact.email}
              onChange={handleMainChange}
              type="email"
              className="md:col-span-2"
              variant="bordered"
            />
            <Textarea
              label="Información Adicional / Preferencias"
              placeholder="Alergias, piso bajo, cama adicional..."
              startContent={
                <FileText size={16} className="text-gray-400 mt-1" />
              }
              name="preferences"
              value={mainContact.preferences}
              onChange={handleMainChange}
              className="md:col-span-2"
              variant="bordered"
            />
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2">
              <Users className="w-5 h-5" /> Registro de Huéspedes
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Total: {guestCount}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Por regulaciones locales, necesitamos la información básica de todos
            los huéspedes que se alojarán.
          </p>

          <div className="space-y-3">
            {Array.from({ length: guestCount }).map((_, index) => {
              const guestData = guests[index];
              const isCompleted = guestData && guestData.firstName;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-green-50/50 border-green-200"
                      : "bg-gray-50 border-dashed border-gray-300 hover:border-[#476d15]/50"
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
                    <div>
                      <p
                        className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {isCompleted
                          ? `${guestData.firstName} ${guestData.lastName}`
                          : `Huésped ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {isCompleted
                          ? "Información completada"
                          : "Pendiente de registro"}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCompleted ? "flat" : "solid"}
                    color={isCompleted ? "success" : "default"}
                    className={!isCompleted ? "bg-[#2c4549] text-white" : ""}
                    onPress={() => openGuestModal(index)}
                    startContent={!isCompleted && <PlusCircle size={14} />}
                  >
                    {isCompleted ? "Editar" : "Agregar"}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Información del Huésped {currentGuestIndex + 1}
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-end mb-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    startContent={<Copy size={14} />}
                    onPress={copyMainContactToGuest}
                  >
                    Copiar datos del titular
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombres"
                    placeholder="Nombres"
                    name="firstName"
                    value={tempGuestData.firstName || ""}
                    onChange={handleGuestModalChange}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Apellidos"
                    placeholder="Apellidos"
                    name="lastName"
                    value={tempGuestData.lastName || ""}
                    onChange={handleGuestModalChange}
                    variant="bordered"
                    size="sm"
                  />

                  <Autocomplete
                    label="País"
                    placeholder="Seleccionar"
                    variant="bordered"
                    selectedKey={tempGuestData.country}
                    onSelectionChange={handleGuestCountryChange}
                    size="sm"
                  >
                    {countries.map((item) => (
                      <AutocompleteItem
                        key={item.name.common}
                        startContent={
                          <Avatar
                            alt={item.name.common}
                            className="w-5 h-5"
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
                    placeholder="Opcional"
                    name="phone"
                    value={tempGuestData.phone || ""}
                    onChange={handleGuestModalChange}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Correo"
                    placeholder="Opcional"
                    name="email"
                    value={tempGuestData.email || ""}
                    onChange={handleGuestModalChange}
                    variant="bordered"
                    className="col-span-2"
                    size="sm"
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
                  Guardar Huésped
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
