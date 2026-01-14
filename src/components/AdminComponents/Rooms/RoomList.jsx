import { useState, useCallback, memo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import { Edit, Trash2, Power, Plus, Bed } from "lucide-react";
import BasicModal from "../../basicModal";
import { postProtectedFormData } from "../../../../api/post";
import { delProtected } from "../../../../api/delete";
import { patchProtected } from "../../../../api/patch";
import { useAuth } from "../../../context/authContext";
import RoomForm from "./RoomForm";

import RoomUnitsManager from "./RoomUnitsManager";

export default function RoomList({ rooms, isLoading, setUpdateRooms }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalView, setModalView] = useState("form");
  const { token } = useAuth();

  const createRoom = async (formData) => {
    const response = await postProtectedFormData({
      endpoint: "/rooms",
      body: formData,
      token,
    });

    if (response.error) {
      toast.error(response.error || "No se pudo crear la habitación");
    } else {
      toast.success("Habitación creada correctamente");
      setUpdateRooms(true);
    }
  };

  const updateRoom = async (formData, id) => {
    formData.append("_method", "PATCH");
    const response = await postProtectedFormData({
      endpoint: `/rooms/${id}`,
      body: formData,
      token,
    });

    if (response.error) {
      toast.error(response.error || "No se pudo actualizar la habitación");
    } else {
      toast.success("Los cambios se guardaron correctamente");
      setUpdateRooms(true);
    }
  };

const deleteRoom = async (room) => {
    // 1. Validación Preventiva: Estado Activo
    // Verificamos si la habitación está activa. Si lo está, no dejamos borrar.
    const isActive = room.is_active === 1 || room.is_active === true || room.is_active === "active";

    if (isActive) {
      toast("Para eliminar esta habitación, primero debes desactivarla usando el botón de encendido.", { icon: '⚠️' });
      return;
    }

    // 2. Confirmación del usuario
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${room.name}"? Esta acción no se puede deshacer.`))
      return;

    try {
      const response = await delProtected({ endpoint: `/rooms/${room.id}`, token });

      if (response && !response.error) {
        toast.success("Habitación borrada correctamente");
        setUpdateRooms(true);
      } else {
        toast.error("Asegúrate de que no existan bloqueos o mantenimientos activos para este grupo.");
      }
    } catch (error) {
      toast.error("Asegúrate de que no existan bloqueos o mantenimientos activos para este grupo.");
    }
  };

  const toggleStatus = async (id) => {
    const result = await patchProtected({
      endpoint: `/rooms/${id}/toggle-status`,
      token: token,
    });

    if (!result.error) {
      toast.success("El estado del grupo ha cambiado");
      setUpdateRooms(true);
    } else {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setModalView("form");
    onOpen();
  };

  const handleAddClick = () => {
    setSelectedRoom(null);
    setModalView("form");
    onOpen();
  };

  const handleManageUnitsClick = () => {
    setModalView("units");
    onOpen();
  };
  const currentRoomData = selectedRoom
    ? rooms.find((r) => r.id === selectedRoom.id)
    : null;

  const ModalContent = useCallback(() => {
    if (modalView === "units") {
      return <RoomUnitsManager rooms={rooms} setUpdateRooms={setUpdateRooms} />;
    }

    return (
      <RoomForm
        onClose={() => onOpenChange(false)}
        onSubmit={selectedRoom ? updateRoom : createRoom}
        roomData={currentRoomData}
        setUpdateRooms={setUpdateRooms}
      />
    );
  }, [
    modalView,
    rooms,
    setUpdateRooms,
    selectedRoom,
    updateRoom,
    createRoom,
    currentRoomData,
    onOpenChange,
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderCell = (room, columnKey) => {
    const cellValue = room[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: room.images[0], name: room.name }}
            description={room.description}
            name={cellValue}
            classNames={{
              name: "text-white font-medium",
              description: "text-white/40 line-clamp-1 max-w-[200px]",
            }}
          />
        );
      case "services":
        return (
          <div className="flex gap-2 flex-wrap max-w-[150px]">
            {room.services?.map((service) => (
              <Tooltip key={service.id} content={service.name}>
                <span className="bg-white/5 p-1.5 rounded-md hover:bg-[#D4AF37]/20 transition-colors">
                  <i className={`${service.icon} text-xs text-[#D4AF37]`}></i>
                </span>
              </Tooltip>
            ))}
          </div>
        );
      case "price":
        return (
          <div className="text-[#D4AF37] font-semibold">
            {formatPrice(cellValue)}
          </div>
        );
      case "inventory":
        return (
          <Chip
            variant="flat"
            color={cellValue > 2 ? "success" : "warning"}
            size="sm"
          >
            {cellValue} uds
          </Chip>
        );
      case "actions":
        const isActive =
          room.is_active === 1 ||
          room.is_active === true ||
          room.is_active === "active";

        return (
          <div className="flex items-center gap-1">
            <Tooltip content="Editar Grupo">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white/60 hover:text-[#D4AF37]"
                onPress={() => handleEditClick(room)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip content={isActive ? "Desactivar Grupo" : "Activar Grupo"}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className={`${isActive ? "text-success" : "text-danger"} hover:opacity-80`}
                onPress={() => toggleStatus(room.id)}
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
                onPress={() => deleteRoom(room)}
              >
                <Trash2 size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Inventario de Habitaciones
          </h2>
          <p className="text-sm text-white/40">
            Gestiona los tipos de cuarto y servicios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="Gestionar Bloqueos / Unidades">
            <Button
              isIconOnly
              variant="bordered"
              className="border-white/10 text-white/70 hover:bg-white/5 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all min-w-[44px] h-[44px]"
              onPress={handleManageUnitsClick}
            >
              <Bed size={22} />
            </Button>
          </Tooltip>

          <Button
            color="primary"
            className="bg-[#D4AF37] text-black font-bold h-[44px] px-6 shadow-lg shadow-[#D4AF37]/10"
            startContent={<Plus size={20} />}
            onPress={handleAddClick}
          >
            Añadir Habitación
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-220px)] overflow-y-auto">
        <div className="overflow-x-auto">
          <Table
            aria-label="Tabla de habitaciones"
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
              <TableColumn key="name">HABITACIÓN</TableColumn>
              <TableColumn key="services">SERVICIOS</TableColumn>
              <TableColumn key="price">PRECIO</TableColumn>
              <TableColumn key="inventory">STOCK</TableColumn>
              <TableColumn key="actions">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody
              items={rooms}
              loadingContent={<Spinner color="warning" />}
              loadingState={isLoading ? "loading" : "idle"}
              emptyContent={"No hay habitaciones registradas."}
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
      </div>
      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={modalView === "units" ? "5xl" : "2xl"}
        scrollBehavior="inside"
        Content={ModalContent}
        isDismissable={false}
      />
    </div>
  );
}
