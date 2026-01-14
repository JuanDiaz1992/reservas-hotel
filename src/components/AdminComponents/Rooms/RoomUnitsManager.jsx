import { getProtected } from "../../../../api/get";
import { delProtected } from "../../../../api/delete";
import { postProtected } from "../../../../api/post";
import { patchProtected } from "../../../../api/patch";
import { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "../../../context/authContext";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Button,
  Tooltip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import {
  Calendar,
  Info,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";

export default memo(function RoomUnitsManager({ rooms, setUpdateRooms }) {
  const [roomLocks, setRoomLocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selectedLock, setSelectedLock] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    room_id: "",
    start_date: "",
    end_date: "",
    quantity: 1,
    reason: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const { token } = useAuth();

  const getLocks = useCallback(async () => {
    console.log("getLocks called");
    setIsLoading(true);
    const response = await getProtected({ endpoint: "/room-locks", token });
    if (response?.data?.data) {
      setRoomLocks(response.data.data);
    }
    setIsLoading(false);
  }, [token])

  useEffect(() => {
    getLocks();
  }, []);

  const refreshGlobalData = () => {
    getLocks();
    if (setUpdateRooms) setUpdateRooms(true);
  };
  const deleteLock = async (id) => {
    if (!window.confirm("¿Liberar esta habitación y eliminar el bloqueo?"))
      return;
    const response = await delProtected({
      endpoint: `/room-locks/${id}`,
      token,
    });
    if (!response.error) {
      toast.success("Bloqueo eliminado y disponibilidad actualizada");
      refreshGlobalData();
    }
  };

  const handleEdit = (lock) => {
    setSelectedLock(lock);
    setFormData({
      room_id: lock.room_id.toString(),
      start_date: lock.start_date.split("T")[0],
      end_date: lock.end_date.split("T")[0],
      quantity: lock.quantity,
      reason: lock.reason,
    });
    setView("form");
  };

  const handleCreate = () => {
    setSelectedLock(null);
    setFormData({
      room_id: "",
      start_date: "",
      end_date: "",
      quantity: 1,
      reason: "",
    });
    setView("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = selectedLock
      ? `/room-locks/${selectedLock.id}`
      : "/room-locks";
    const method = selectedLock ? patchProtected : postProtected;
    const response = await method({
      endpoint,
      body: formData,
      token,
    });
    if (!response.error) {
      toast.success(selectedLock ? "Bloqueo actualizado" : "Bloqueo generado correctamente");
      setView("list");
      refreshGlobalData();
    } else {
      toast.error(response.error || "Error al procesar");
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (view === "form") {
    return (
      <div className="p-4 animate-in slide-in-from-right-5 duration-300">
        <Button
          size="sm"
          variant="light"
          startContent={<ArrowLeft size={16} />}
          onPress={() => setView("list")}
          className="mb-4 text-gray-500"
        >
          Volver al listado
        </Button>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-5"
        >
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-bold text-gray-800">
              {selectedLock ? "Modificar Bloqueo" : "Crear Nuevo Bloqueo"}
            </h3>
            <p className="text-xs text-gray-500">
              Los cambios afectarán directamente el inventario disponible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Habitación"
              placeholder="Seleccione unidad"
              selectedKeys={formData.room_id ? [formData.room_id] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setFormData({ ...formData, room_id: value });
              }}
              isRequired
              variant="bordered"
              labelPlacement="outside"
              disableAnimation={false}
              classNames={{ label: "text-gray-700 font-medium" }}
            >
              {rooms.map((room) => (
                <SelectItem key={room.id} textValue={room.name}>
                  {room.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Cantidad de Unidades"
              value={formData.quantity}
              onValueChange={(val) =>
                setFormData({ ...formData, quantity: val })
              }
              isRequired
              variant="bordered"
              labelPlacement="outside"
              min={1}
              classNames={{ label: "text-gray-700 font-medium" }}
            />

            <Input
              type="date"
              label="Fecha Inicio"
              value={formData.start_date}
              onValueChange={(val) =>
                setFormData({ ...formData, start_date: val })
              }
              min={today}
              isRequired
              variant="bordered"
              labelPlacement="outside"
              classNames={{ label: "text-gray-700 font-medium" }}
            />

            <Input
              type="date"
              label="Fecha Fin"
              value={formData.end_date}
              onValueChange={(val) =>
                setFormData({ ...formData, end_date: val })
              }
              min={today}
              isRequired
              variant="bordered"
              labelPlacement="outside"
              classNames={{ label: "text-gray-700 font-medium" }}
            />
          </div>

          <Textarea
            label="Motivo del bloqueo"
            placeholder="Ej: Mantenimiento correctivo, bloqueo por canal externo..."
            value={formData.reason}
            onValueChange={(val) => setFormData({ ...formData, reason: val })}
            variant="bordered"
            labelPlacement="outside"
            classNames={{ label: "text-gray-700 font-medium" }}
          />

          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="flat" onPress={() => setView("list")}>
              Descartar
            </Button>
            <Button
              color="primary"
              className="bg-[#D4AF37] text-black font-bold px-8 shadow-lg shadow-yellow-600/20"
              type="submit"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Save size={18} />}
            >
              {selectedLock ? "Actualizar Bloqueo" : "Confirmar Bloqueo"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 max-w-[65%]">
          <Info size={18} className="text-blue-500 mt-0.5" />
          <p className="text-[11px] text-blue-800 leading-normal">
            <strong>Nota:</strong> Las unidades bloqueadas no aparecerán
            disponibles para la venta pública en el rango de fechas definido.
          </p>
        </div>
        <Button
          size="md"
          className="bg-[#D4AF37] text-black font-bold shadow-md"
          startContent={<Plus size={20} />}
          onPress={handleCreate}
        >
          Nuevo Bloqueo
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          aria-label="Tabla de bloqueos"
          removeWrapper
          classNames={{
            th: "bg-gray-50 text-gray-500 text-[10px] font-bold uppercase py-4 border-b border-gray-100",
            td: "text-gray-700 text-sm border-b border-gray-50 py-4",
          }}
        >
        <TableHeader>
          <TableColumn>UNIDAD / HABITACIÓN</TableColumn>
          <TableColumn>FECHAS BLOQUEO</TableColumn>
          <TableColumn align="center">BLOQUEADAS</TableColumn>
          <TableColumn>MOTIVO</TableColumn>
          <TableColumn align="center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody
          items={roomLocks}
          isLoading={isLoading}
          loadingContent={<Spinner color="warning" size="md" />}
          emptyContent={
            <p className="text-gray-400 py-10">
              No existen bloqueos de inventario registrados.
            </p>
          }
        >
          {(lock) => (
            <TableRow
              key={lock.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="font-bold text-gray-900">
                {lock.room?.name}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#D4AF37]" />
                  <span className="text-xs font-semibold">
                    {formatDate(lock.start_date)} - {formatDate(lock.end_date)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="font-bold px-3"
                >
                  {lock.quantity} {lock.quantity === 1 ? "Unidad" : "Unidades"}
                </Chip>
              </TableCell>
              <TableCell>
                <p
                  className="text-xs text-gray-500 italic max-w-[180px] truncate"
                  title={lock.reason}
                >
                  {lock.reason}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Editar" closeDelay={0}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-blue-600"
                      onPress={() => handleEdit(lock)}
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Eliminar" color="danger" closeDelay={0}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-danger"
                      onPress={() => deleteLock(lock.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
});
