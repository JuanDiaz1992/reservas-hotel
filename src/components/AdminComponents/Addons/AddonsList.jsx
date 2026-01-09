import { useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Button,
  Spinner,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { Edit, Trash2, Plus, Sparkles, Power } from "lucide-react";
import BasicModal from "../../basicModal";
import { delProtected } from "../../../../api/delete";
import { postProtectedFormData } from "../../../../api/post";
import { useAuth } from "../../../context/authContext";
import AddonsForm from "./AddonsForm";

export default function AddonsList({ addons, isLoading, setUpdateAddons }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAddon, setSelectedAddon] = useState(null);
  const { token } = useAuth();

  const handleSubmitAddon = async (formData, id) => {
    try {
      const endpoint = id ? `/addons/${id}` : "/addons";
      if (id) {
        formData.append("_method", "PATCH");
      }
      const response = await postProtectedFormData({
        endpoint: endpoint,
        body: formData,
        token: token,
      });

      if (response && !response.error) {
        addToast({
          title: id ? "Servicio Actualizado" : "Servicio Creado",
          description: `Se ha guardado "${formData.get("name")}" correctamente.`,
          color: "success",
        });

        setUpdateAddons(true);
        onOpenChange(false);
      } else {
        throw new Error(response.error || "Error en el servidor");
      }
    } catch (error) {
      console.error("Error al guardar addon:", error);
      addToast({
        title: "Error",
        description: error.message || "No se pudo procesar la solicitud",
        color: "danger",
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const deleteAddon = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;

    try {
      const response = await delProtected({ endpoint: `/addons/${id}`, token });
      if (response && !response.error) {
        addToast({
          title: "Eliminado",
          description: "Servicio eliminado correctamente",
          color: "success",
        });
        setUpdateAddons(true);
      } else {
        addToast({
          title: "Error",
          description: "No se pudo eliminar",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const toggleStatus = async (id) => {
    console.log("desactivado" + id)
  }

  const handleEditClick = (addon) => {
    setSelectedAddon(addon);
    onOpen();
  };

  const handleAddClick = () => {
    setSelectedAddon(null);
    onOpen();
  };

  const renderCell = useCallback((addon, columnKey) => {
    const cellValue = addon[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: addon.image,
              name: addon.name,
              className: "object-cover",
            }}
            description={addon.description}
            name={cellValue}
            classNames={{
              name: "text-white font-medium",
              description: "text-white/40 line-clamp-1 max-w-[300px]",
            }}
          />
        );
      case "price":
        return (
          <div className="text-[#D4AF37] font-semibold">
            {formatPrice(cellValue)}
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-1">
            <Tooltip content="Editar Servicio">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white/60 hover:text-[#D4AF37]"
                onPress={() => handleEditClick(addon)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip content={addon.isActive ? "Desactivar" : "Activar"}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className={`${addon.isActive ? "text-success" : "text-danger"} hover:opacity-80`}
                onPress={() => toggleStatus(addon.id)}
              >
                <Power size={18} />
              </Button>
            </Tooltip>

            <Tooltip color="danger" content="Eliminar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-danger"
                onPress={() => deleteAddon(addon.id)}
              >
                <Trash2 size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-[#D4AF37]" />
            Gestión de Addons / Servicios
          </h2>
          <p className="text-sm text-white/40">
            Configura los servicios adicionales disponibles para los huéspedes.
          </p>
        </div>

        <Button
          color="primary"
          className="bg-[#D4AF37] text-black font-bold h-[44px] px-6 shadow-lg shadow-[#D4AF37]/10"
          startContent={<Plus size={20} />}
          onPress={handleAddClick}
        >
          Añadir Servicio
        </Button>
      </div>

      {/* TABLA */}
      <div className="rounded-2xl border border-white/10 max-h-[calc(100vh-320px)] overflow-auto">
        <Table
          aria-label="Tabla de addons"
          removeWrapper
          isHeaderSticky
          classNames={{
            base: "overflow-visible",
            table: "min-w-[800px]",
            th: "bg-[#0f1e09] text-white/60 py-4 uppercase text-xs font-bold",
            td: "py-4 px-3 border-b border-white/5 bg-[#0f1e09]/30",
          }}
        >
          <TableHeader>
            <TableColumn key="name">SERVICIO / EXPERIENCIA</TableColumn>
            <TableColumn key="price">PRECIO UNITARIO</TableColumn>
            <TableColumn key="actions" align="center">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody
            items={addons || []}
            loadingContent={<Spinner color="warning" />}
            loadingState={isLoading ? "loading" : "idle"}
            emptyContent={"No hay servicios registrados."}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-white/5 transition-colors"
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        title={selectedAddon ? "Editar Servicio" : "Nuevo Servicio"}
        Content={() => (
          <AddonsForm
            addonData={selectedAddon}
            onClose={() => onOpenChange(false)}
            onSubmit={handleSubmitAddon}
          />
        )}
        isDismissable={false}
      />
    </div>
  );
}
