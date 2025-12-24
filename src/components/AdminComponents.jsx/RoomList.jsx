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
} from "@heroui/react";
import { Edit, Trash2, Power, Plus } from "lucide-react";

export default function RoomList({ rooms, isLoading }) {
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
        return (
          <div className="flex items-center gap-1">
            <Tooltip content="Editar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white/60 hover:text-[#D4AF37]"
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Estado">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white/60 hover:text-warning"
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
        <Button
          color="primary"
          className="bg-[#D4AF37] text-black font-bold"
          startContent={<Plus size={20} />}
        >
          Añadir Habitación
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 max-h-[450px] overflow-auto">
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
  );
}
