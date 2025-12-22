import {
  Input,
  Textarea,
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { User, Users, Phone, Mail, Copy } from "lucide-react";

export default function GuestInformation({
  mainContact,
  setMainContact,
  countries,
  errors,
  setErrors,
  isSubmitting,
  guests,
  setGuests,
  additionalGuestsCount,
  tempGuestData,
  setTempGuestData,
  currentGuestIndex,
  setCurrentGuestIndex,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMainContact((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMainCountryChange = (key) => {
    const selected = countries.find((c) => c.name.common === key);
    setMainContact((prev) => ({
      ...prev,
      country: selected ? selected.cca2 : key,
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
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

  return (
    <>
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
              isDisabled={isSubmitting}
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
              isDisabled={isSubmitting}
            />
            <Autocomplete
              label="País de residencia"
              variant="bordered"
              onSelectionChange={handleMainCountryChange}
              isInvalid={!!errors.country}
              errorMessage={errors.country}
              isDisabled={isSubmitting}
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
              isDisabled={isSubmitting}
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
              isDisabled={isSubmitting}
            />
            <Textarea
              label="Información Adicional"
              name="preferences"
              value={mainContact.preferences}
              onChange={handleMainChange}
              className="md:col-span-2"
              variant="bordered"
              isDisabled={isSubmitting}
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
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50 border-dashed border-gray-300"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-500"}`}
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
                      isDisabled={isSubmitting}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Acompañante {currentGuestIndex + 1}</ModalHeader>
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
                    label="Teléfono"
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
                    label="Correo"
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
    </>
  );
}
