import {
  Input,
  Button,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Image,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { delProtected } from "../../../../api/delete";
import { useAuth } from "../../../context/authContext";

export default function RoomForm({
  onSubmit,
  onClose,
  roomData = null,
  setUpdateRooms,
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deletingImg, setDeletingImg] = useState(null);
  const [errors, setErrors] = useState({});
  const isEdit = !!roomData;

  const initialServices = roomData?.services?.map((s) => s.id.toString()) || [];
  const [selectedServices, setSelectedServices] = useState(initialServices);

  const handleDeleteImage = async (imgUrl, id) => {
    if (!window.confirm("¿Estás seguro? La imagen se eliminará permanentemente."))
      return;

    setDeletingImg(imgUrl);
    try {
      const response = await delProtected({
        endpoint: `/rooms/${id}/images`,
        token,
        body: { image_path: imgUrl },
      });

      if (!response.error) {
        addToast({
          title: "Eliminada",
          description: "Imagen borrada correctamente",
          color: "success",
        });
        setUpdateRooms(true);
      } else {
        addToast({
          title: "Error",
          description: response.error || "No se pudo eliminar la imagen",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error eliminando imagen:", error);
    } finally {
      setDeletingImg(null);
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.get("name")) newErrors.name = "El nombre es obligatorio";
    if (!formData.get("description")) newErrors.description = "La descripción es necesaria";
    
    const price = Number(formData.get("price"));
    if (!price || price <= 0) newErrors.price = "Precio debe ser mayor a 0";

    const capacity = Number(formData.get("capacity"));
    if (!capacity || capacity <= 0) newErrors.capacity = "Indica la capacidad";

    const imagesInput = formData.getAll("images[]");
    const hasNewImages = imagesInput[0] && imagesInput[0].size > 0;

    const currentImagesCount = roomData?.images?.length || 0;

    if (!isEdit && !hasNewImages) {
      newErrors.images = "Debes subir al menos una imagen para crear";
    }

    if (isEdit && currentImagesCount === 0 && !hasNewImages) {
      newErrors.images = "La habitación no puede quedarse sin imágenes";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    formData.delete("services[]");
    selectedServices.forEach((id) => {
      formData.append("services[]", id);
    });

    const fileInput = formElement.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
      formData.delete("images[]");
      Array.from(fileInput.files).forEach((file) => {
        formData.append("images[]", file);
      });
    }

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await onSubmit(formData, roomData?.id);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Editar Habitación" : "Nueva Habitación"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          label="Nombre de la Suite"
          defaultValue={roomData?.name}
          variant="bordered"
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          className="md:col-span-2"
        />

        <Textarea
          name="description"
          label="Descripción"
          defaultValue={roomData?.description}
          variant="bordered"
          isInvalid={!!errors.description}
          errorMessage={errors.description}
          className="md:col-span-2"
        />

        <Input
          name="price"
          type="number"
          label="Precio por Noche"
          defaultValue={roomData?.price}
          startContent={<span className="text-default-400 text-small">$</span>}
          variant="bordered"
          isInvalid={!!errors.price}
          errorMessage={errors.price}
        />

        <Input
          name="extra_person_fee"
          type="number"
          label="Costo Persona Extra"
          defaultValue={roomData?.extra_person_fee || 0}
          startContent={<span className="text-default-400 text-small">$</span>}
          variant="bordered"
        />

        <Input
          name="inventory"
          type="number"
          label="Stock disponible"
          defaultValue={roomData?.inventory}
          variant="bordered"
        />

        <Input
          name="capacity"
          type="number"
          label="Capacidad Max."
          defaultValue={roomData?.capacity}
          variant="bordered"
          isInvalid={!!errors.capacity}
          errorMessage={errors.capacity}
        />

        <Input
          name="base_capacity"
          type="number"
          label="Capacidad Base"
          defaultValue={roomData?.base_capacity || 2}
          variant="bordered"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Servicios Incluidos</p>
        <CheckboxGroup
          orientation="horizontal"
          color="warning"
          value={selectedServices}
          onValueChange={setSelectedServices}
          className="gap-4"
        >
          <Checkbox value="1">Wifi</Checkbox>
          <Checkbox value="2">Aire Acondicionado</Checkbox>
          <Checkbox value="3">TV Cable</Checkbox>
          <Checkbox value="4">Room Service</Checkbox>
          <Checkbox value="5">Caja Fuerte</Checkbox>
          <Checkbox value="6">Zona Trabajo</Checkbox>
        </CheckboxGroup>
      </div>

      <div className="space-y-4">
        {isEdit && roomData?.images?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Fotos actuales
            </p>
            <div className="flex gap-3 flex-wrap pb-2">
              {roomData.images.map((img, idx) => (
                <div key={`${roomData.id}-${idx}`} className="relative flex-shrink-0">
                  <Image
                    src={img}
                    alt="Room"
                    width={80}
                    height={80}
                    className={`object-cover rounded-lg border border-gray-200 transition-opacity ${
                      deletingImg === img ? "opacity-30 blur-[1px]" : "opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={deletingImg !== null}
                    onClick={() => handleDeleteImage(img, roomData.id)}
                    className="absolute -top-2 -right-2 z-30 bg-danger text-white rounded-full p-1 shadow-md hover:scale-110 disabled:bg-gray-400"
                  >
                    {deletingImg === img ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <X size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`p-4 border-2 border-dashed rounded-xl transition-colors ${
            errors.images ? "border-danger bg-danger/5" : "border-gray-200"
          }`}
        >
          <p className="text-sm mb-2 font-medium text-gray-500">
            {isEdit ? "Añadir fotos nuevas" : "Subir fotos de la habitación"}
          </p>
          <input
            type="file"
            name="images[]"
            multiple
            accept="image/*"
            className="text-sm text-gray-600 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37]/10 file:text-[#8a7124]"
          />
          {errors.images && (
            <p className="text-tiny text-danger mt-2">{errors.images}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Button variant="flat" onPress={onClose}>
          Cancelar
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
          className="bg-[#D4AF37] text-black font-bold px-8"
        >
          {isEdit ? "Guardar Cambios" : "Crear Habitación"}
        </Button>
      </div>
    </form>
  );
}