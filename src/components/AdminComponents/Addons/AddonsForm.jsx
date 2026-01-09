import {
  Input,
  Button,
  Textarea,
  Image,
  addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function AddonsForm({
  onSubmit,
  onClose,
  addonData = null,
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(addonData?.image || null);
  const isEdit = !!addonData;

  useEffect(() => {
    if (addonData?.image) {
      setPreviewImage(addonData.image);
    }
  }, [addonData]);

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.get("name")) newErrors.name = "El nombre es obligatorio";
    if (!formData.get("description")) newErrors.description = "La descripción es necesaria";
    
    const price = Number(formData.get("price"));
    if (!price || price <= 0) newErrors.price = "Precio debe ser mayor a 0";

    const imageFile = formData.get("image");
    // Solo validamos si no hay previsualización (es decir, ni imagen previa ni nueva seleccionada)
    if (!previewImage && (!imageFile || imageFile.size === 0)) {
      newErrors.image = "Debes subir una imagen para el servicio";
    }

    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Captura solo el primer archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await onSubmit(formData, addonData?.id);
      onClose();
    } catch (error) {
      console.error("Error al guardar addon:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <Input
          name="name"
          label="Nombre del Servicio"
          placeholder="Nombre del addon"
          defaultValue={addonData?.name}
          variant="bordered"
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          className="text-gray-900"
        />

        <Textarea
          name="description"
          label="Descripción"
          placeholder="¿En qué consiste el servicio?"
          defaultValue={addonData?.description}
          variant="bordered"
          isInvalid={!!errors.description}
          errorMessage={errors.description}
          className="text-gray-900"
        />

        <Input
          name="price"
          type="number"
          label="Precio"
          placeholder="0.00"
          defaultValue={addonData?.price}
          startContent={<span className="text-default-400 text-small">$</span>}
          variant="bordered"
          isInvalid={!!errors.price}
          errorMessage={errors.price}
          className="text-gray-900"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Imagen del Servicio (Única)</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {previewImage && (
            <div className="relative flex-shrink-0">
              <Image
                src={previewImage}
                alt="Preview"
                width={140}
                height={140}
                className="object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                   setPreviewImage(null);
                   // Limpiamos el input para que pueda volver a elegir la misma si quiere
                   const fileInput = document.getElementById("addon-image-input");
                   if (fileInput) fileInput.value = "";
                }}
                className="absolute -top-2 -right-2 z-30 bg-danger text-white rounded-full p-1 shadow-md hover:scale-110"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div
            className={`flex-grow w-full p-4 border-2 border-dashed rounded-xl transition-colors relative ${
              errors.image ? "border-danger bg-danger/5" : "border-gray-200 hover:border-[#D4AF37]/50"
            }`}
          >
            <p className="text-sm mb-2 font-medium text-gray-500 text-center">
              Seleccionar una imagen
            </p>
            <input
              id="addon-image-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D4AF37]/10 file:text-[#8a7124] file:font-semibold cursor-pointer"
            />
            {errors.image && (
              <p className="text-tiny text-danger mt-2 text-center">{errors.image}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-gray-100">
        <Button variant="flat" onPress={onClose}>
          Cancelar
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
          className="bg-[#D4AF37] text-black font-bold px-8"
        >
          {isEdit ? "Guardar Cambios" : "Crear Servicio"}
        </Button>
      </div>
    </form>
  );
}