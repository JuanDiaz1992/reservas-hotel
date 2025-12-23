import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
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
  Checkbox,
} from "@heroui/react";
import { User, Users, Phone, Mail } from "lucide-react";
import BasicModal from "../../basicModal";
import { TERMS_AND_CONDITIONS } from "../../../data";

const GuestInformation = forwardRef(
  (
    {
      mainContact,
      setMainContact,
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
    },
    ref
  ) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
      isOpen: isTermsOpen,
      onOpen: onTermsOpen,
      onOpenChange: onTermsOpenChange,
    } = useDisclosure();
    const [countries, setCountries] = useState([]);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [guestModalErrors, setGuestModalErrors] = useState({});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Cargar países y establecer Colombia por defecto
    useEffect(() => {
      fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
        .then((res) => res.json())
        .then((data) => {
          const sortedCountries = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
          );
          setCountries(sortedCountries);

          // Si el titular no tiene país seleccionado, poner Colombia (CO) por defecto
          if (!mainContact.country) {
            const defaultCountry = sortedCountries.find((c) => c.cca2 === "CO");
            if (defaultCountry) {
              setMainContact((prev) => ({
                ...prev,
                country: "CO",
              }));
            }
          }
        })
        .catch((err) => console.error("Error países:", err));
    }, []);

    useImperativeHandle(ref, () => ({
      validate: () => {
        let newErrors = {};

        if (!mainContact.firstName?.trim())
          newErrors.firstName = "El nombre es obligatorio";
        if (!mainContact.lastName?.trim())
          newErrors.lastName = "El apellido es obligatorio";

        if (!mainContact.email?.trim()) {
          newErrors.email = "El correo es obligatorio";
        } else if (!emailRegex.test(mainContact.email)) {
          newErrors.email =
            "El formato del correo es inválido (ej: usuario@correo.com)";
        }

        if (!mainContact.phone?.trim())
          newErrors.phone = "El teléfono es obligatorio";
        if (!mainContact.country) newErrors.country = "Selecciona un país";

        if (!acceptedTerms) newErrors.terms = "Debes aceptar los términos";

        let guestsValid = true;
        if (additionalGuestsCount > 0) {
          const completedGuests = guests.filter(
            (g) => g?.firstName?.trim() && g?.lastName?.trim() && g?.country
          );

          if (completedGuests.length < additionalGuestsCount) {
            guestsValid = false;
          }
        }

        setErrors(newErrors);

        const mainValid = Object.keys(newErrors).length === 0;

        return {
          isValid: mainValid && guestsValid,
          message: !mainValid
            ? newErrors.terms
              ? newErrors.terms
              : "Por favor revisa los datos marcados en rojo."
            : !guestsValid
            ? `Falta completar información de acompañantes.`
            : "",
        };
      },
    }));

    const handleMainChange = (e) => {
      const { name, value } = e.target;
      setMainContact((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    };

    const handleMainCountryChange = (key) => {
      // key suele ser el cca2 del AutocompleteItem
      setMainContact((prev) => ({
        ...prev,
        country: key,
      }));
      if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
    };

    const openGuestModal = (index) => {
      setCurrentGuestIndex(index);
      setGuestModalErrors({});
      setTempGuestData(
        guests[index] || {
          firstName: "",
          lastName: "",
          country: "CO", // También por defecto Colombia al agregar acompañante
          email: "",
          phone: "",
        }
      );
      onOpen();
    };

    const saveGuestData = () => {
      let gErrors = {};

      if (!tempGuestData.firstName?.trim()) gErrors.firstName = "Requerido";
      if (!tempGuestData.lastName?.trim()) gErrors.lastName = "Requerido";
      if (!tempGuestData.country) gErrors.country = "Requerido";
      if (
        tempGuestData.email?.trim() &&
        !emailRegex.test(tempGuestData.email)
      ) {
        gErrors.email = "Formato incorrecto";
      }

      if (Object.keys(gErrors).length > 0) {
        setGuestModalErrors(gErrors);
        return;
      }

      const updatedGuests = [...guests];
      updatedGuests[currentGuestIndex] = tempGuestData;
      setGuests(updatedGuests);
      setGuestModalErrors({});
      onOpenChange(false);
    };

    const TermsContent = () => (
      <div
        className="prose prose-sm max-w-none py-2"
        dangerouslySetInnerHTML={{ __html: TERMS_AND_CONDITIONS }}
      />
    );

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
                selectedKey={mainContact.country}
              >
                {countries.map((item) => (
                  <AutocompleteItem
                    key={item.cca2}
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

              <div className="md:col-span-2 mt-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <Checkbox
                      isSelected={acceptedTerms}
                      onValueChange={(value) => {
                        setAcceptedTerms(value);
                        if (errors.terms)
                          setErrors((prev) => ({ ...prev, terms: null }));
                      }}
                      color="success"
                      size="sm"
                      isInvalid={!!errors.terms}
                    >
                      <p className="text-sm text-gray-600">
                        He leído y acepto los{" "}
                      </p>
                    </Checkbox>
                    <button
                      type="button"
                      onClick={onTermsOpen}
                      className="ml-1 text-sm text-[#476d15] font-bold underline hover:text-[#2c4549] transition-colors cursor-pointer"
                    >
                      términos y condiciones
                    </button>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-danger ml-2">{errors.terms}</p>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {additionalGuestsCount > 0 && (
          <Card className="shadow-sm border border-gray-100 mt-6">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif text-[#2c4549] flex items-center gap-2">
                  <Users className="w-5 h-5" /> Acompañantes Adicionales
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  Requeridos: {additionalGuestsCount}
                </span>
              </div>
              <div className="space-y-3">
                {Array.from({ length: additionalGuestsCount }).map(
                  (_, index) => {
                    const guestData = guests[index];
                    const isCompleted =
                      guestData &&
                      guestData.firstName?.trim() &&
                      guestData.lastName?.trim() &&
                      guestData.country;
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
                          <div>
                            <p
                              className={`font-medium ${
                                isCompleted ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {isCompleted
                                ? `${guestData.firstName} ${guestData.lastName}`
                                : `Información Acompañante ${index + 1}`}
                            </p>
                            {!isCompleted && (
                              <p className="text-[10px] text-red-400">
                                Pendiente completar
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isCompleted ? "flat" : "solid"}
                          color={isCompleted ? "success" : "default"}
                          onPress={() => openGuestModal(index)}
                          isDisabled={isSubmitting}
                        >
                          {isCompleted ? "Editar" : "Agregar datos"}
                        </Button>
                      </div>
                    );
                  }
                )}
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nombres"
                      isRequired
                      value={tempGuestData.firstName || ""}
                      isInvalid={!!guestModalErrors.firstName}
                      errorMessage={guestModalErrors.firstName}
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
                      isRequired
                      value={tempGuestData.lastName || ""}
                      isInvalid={!!guestModalErrors.lastName}
                      errorMessage={guestModalErrors.lastName}
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
                      isRequired
                      variant="bordered"
                      isInvalid={!!guestModalErrors.country}
                      errorMessage={guestModalErrors.country}
                      onSelectionChange={(key) =>
                        setTempGuestData({ ...tempGuestData, country: key })
                      }
                      selectedKey={tempGuestData.country}
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
                      label="Correo (Opcional)"
                      className="col-span-2"
                      value={tempGuestData.email || ""}
                      isInvalid={!!guestModalErrors.email}
                      errorMessage={guestModalErrors.email}
                      onChange={(e) =>
                        setTempGuestData({
                          ...tempGuestData,
                          email: e.target.value,
                        })
                      }
                      variant="bordered"
                      startContent={
                        <Mail size={16} className="text-gray-400" />
                      }
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

        <BasicModal
          isOpen={isTermsOpen}
          onOpenChange={onTermsOpenChange}
          Content={TermsContent}
          size="2xl"
          scrollBehavior="inside"
        />
      </>
    );
  }
);

export default GuestInformation;