import { useState, memo } from "react";
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
  Input,
  useDisclosure,
  Pagination,
} from "@heroui/react";
import toast from "react-hot-toast";
import {
  Search,
  Eye,
  Calendar,
  Edit,
  CalendarX2,
  BellRing,
  CheckCircle2,
  CheckCircle,
  CreditCard,
  
} from "lucide-react";

import BasicModal from "../../basicModal";
import { delProtected } from "../../../../api/delete";
import { patchProtected } from "../../../../api/patch";
import { post } from "../../../../api/post";
import { useAuth } from "../../../context/authContext";
import DetailReservation from "./DetailReservation";
import ReservationEdit from "./ReservationEdit";

export default function ReservationsList({
  reservations,
  loadingReservations,
  setUpdateReservations,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const [searchValue, setSearchValue] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const { token } = useAuth();

  const handleSearch = (value) => {
    setSearchValue(value);
    if (setSearchTerm) {
      setSearchTerm(value);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColorMap = {
    confirmed: "success",
    pending: "warning",
    cancelled: "danger",
    completed: "primary",
  };

  const currentReservation = reservations?.find(
    (r) => r.id === selectedReservationId
  );


  const handleViewDetailsClick = (reservation) => {
    setSelectedReservationId(reservation.id);
    setModalMode("detail");
    onOpen();
  };
  const handleCancel = async (uuid) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      try {
        const response = await delProtected({
          endpoint: `/reservations/${uuid}`,
          token: token,
        });
        console.log(response);
        if (response.status === 200) {
          setUpdateReservations(true);
        }
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
      }
    }
  };

  const handleConfirmPayment = async (id) => {
    console.log(id);
    if (
      window.confirm(
        "¿Confirmar que se ha recibido la transferencia bancaria para esta reserva?"
      )
    ) {
      setIsConfirming(true);
      try {
        const response = await patchProtected({
          endpoint: `/reservations/${id}/confirm-bank-transfer`,
          token: token,
        });
        if (response) {
          setUpdateReservations(true);
        }
      } catch (error) {
        console.error("Error al confirmar pago:", error);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  const handleChangePaymentMethod = async (uuid, currentMethod) => {
    try {
      const newMethod = currentMethod === "epayco" ? "bank_transfer" : "epayco";
      const response = await post({
        endpoint: `/reservations/${uuid}/init-payment`,
        body: { payment_method: newMethod },
      });
      if (response.status === 200) {
        toast.success(`Se ha cambiado el método a ${newMethod === "epayco" ? "Pago Online" : "Transferencia Bancaria"}.`);
        setUpdateReservations(true);
      }
    } catch (error) {
      toast.error("Cambio no realizado. Ha ocurrido un error, inténtelo de nuevo más tarde");
    }
  };

  const handleConfirmReservation = async (id) => {
    console.log(id);
    try {
      const response = await patchProtected({
        endpoint: `/reservations/${id}/sync-pms`,
        body: {
          is_synced_pms: true,
        },
        token: token,
      });
      if (response.status === 200) {
        setUpdateReservations(true);
        toast.success("La reserva se confirmó correctamente");
      } else {
        toast.error("Reserva No Confirmada. Ha ocurrido un error, inténtelo de nuevo más tarde");
      }
    } catch (error) {
      toast.error("Reserva No Confirmada. Ha ocurrido un error, inténtelo de nuevo más tarde");
    }
  };

  const renderCell = (reservation, columnKey) => {
    const cellValue = reservation[columnKey];

    const todayStr = new Intl.DateTimeFormat("en-CA").format(new Date());
    const checkInStr = reservation.check_in
      ? reservation.check_in.split("T")[0]
      : "";
    const isToday = todayStr === checkInStr;
    const isCancelled = reservation.status === "cancelled";
    switch (columnKey) {
      case "code":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-white font-bold">
                {reservation.reservation_code}
              </p>
              {isToday && (
                <Tooltip content="¡Llega Hoy!" color="warning" closeDelay={0}>
                  <BellRing
                    size={16}
                    className="text-[#D4AF37] animate-pulse"
                  />
                </Tooltip>
              )}
            </div>
            <Tooltip
              content={reservation.uuid}
              color="foreground"
              closeDelay={100}
              placement="bottom"
            >
              <p className="text-white/30 text-xs cursor-pointer hover:text-white/60 transition-colors">
                {reservation.uuid?.split("-")[0] + "..."}
              </p>
            </Tooltip>
          </div>
        );
      case "customer":
        return (
          <User
            avatarProps={{
              radius: "full",
              name: reservation.user?.name,
              className: "bg-[#D4AF37]/20 text-[#D4AF37]",
            }}
            description={reservation.user?.email}
            name={`${reservation.user?.name} ${reservation.user?.last_name}`}
            classNames={{
              name: "text-white font-medium",
              description: "text-white/40",
            }}
          />
        );
      case "dates":
        return (
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-1 text-xs ${isToday ? "text-white font-bold" : "text-white/60"}`}
            >
              <Calendar size={12} className="text-[#D4AF37]" />
              <span className={isToday ? "underline decoration-[#D4AF37]" : ""}>
                {formatDate(reservation.check_in)} -{" "}
                {formatDate(reservation.check_out)}
              </span>
            </div>
            <p className="text-[10px] text-white/30 uppercase">
              {reservation.total_nights} Noches
            </p>
          </div>
        );
      case "total":
        return (
          <div className="flex flex-col">
            <span className="text-[#D4AF37] font-semibold">
              {formatPrice(reservation.total_price)}
            </span>
            <span className="text-[10px] text-white/30 uppercase">
              Vía {reservation.payment_method?.replace("_", " ")}
            </span>
          </div>
        );
      case "status":
        const isBankTransfer = reservation.payment_method === "bank_transfer";
        const isPending = reservation.payment_status === "pending";

        return (
          <div className="flex flex-col gap-2">
            <Chip
              className="capitalize"
              color={statusColorMap[reservation.status]}
              size="sm"
              variant="flat"
            >
              {reservation.status}
            </Chip>

            {/* Solo mostramos botones de pago si NO está cancelada */}
            {!isCancelled && (
              <>
                {isBankTransfer && isPending && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    isLoading={isConfirming}
                    className="h-7 text-[10px] font-bold bg-success/10 hover:bg-success/20 text-success border border-success/20"
                    startContent={!isConfirming && <CheckCircle2 size={12} />}
                    onPress={() => handleConfirmPayment(reservation.id)}
                  >
                    CONFIRMAR PAGO
                  </Button>
                )}

                {isPending && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    className="h-7 text-[10px] font-bold bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20"
                    startContent={<CreditCard size={12} />}
                    onPress={() =>
                      handleChangePaymentMethod(
                        reservation.uuid,
                        reservation.payment_method
                      )
                    }
                  >
                    CAMBIAR MÉTODO
                  </Button>
                )}
              </>
            )}
          </div>
        );

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {!isCancelled &&
              reservation.is_synced_pms === 0 &&
              reservation.status === "confirmed" && (
                <Tooltip color="success" content="Confirmar Reserva">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-white/60 hover:text-success"
                    onPress={() => handleConfirmReservation(reservation.id)}
                  >
                    <CheckCircle size={18} />
                  </Button>
                </Tooltip>
              )}

            <Tooltip content="Ver detalles">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white/60 hover:text-[#D4AF37]"
                onPress={() => handleViewDetailsClick(reservation)}
              >
                <Eye size={18} />
              </Button>
            </Tooltip>

            {/* Botón Cancelar: Solo si no está cancelada actualmente */}
            {!isCancelled && (
              <Tooltip color="danger" content="Cancelar reserva">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-danger hover:bg-danger/10"
                  onPress={() => handleCancel(reservation.uuid)}
                >
                  <CalendarX2 size={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:max-w-[400px]">
          <Input
            isClearable
            variant="bordered"
            placeholder="Buscar por UUID, código o correo..."
            startContent={<Search size={18} className="text-white/40" />}
            value={searchValue}
            onClear={() => handleSearch("")}
            onValueChange={handleSearch}
            classNames={{
              input: [
                "text-white",
                "placeholder:text-white/20",
                "bg-transparent",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-white/5",
                "border-white/10",
                "backdrop-blur-sm",
                "hover:bg-white/10",
                "group-data-[focus=true]:bg-white/5",
                "group-data-[focus=true]:border-[#D4AF37]",
                "transition-all",
                "duration-300",
              ],
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-320px)] overflow-y-auto">
        <div className="overflow-x-auto">
          <Table
            aria-label="Tabla de reservas"
            removeWrapper
            isHeaderSticky
            classNames={{
              base: "overflow-visible",
              table: "min-w-[1000px]",
              th: "bg-[#0f1e09] text-white/60 py-4 uppercase text-xs font-bold",
              td: "py-4 px-3 border-b border-white/5 bg-[#0f1e09]/30",
            }}
          >
          <TableHeader>
            <TableColumn key="code">CÓDIGO</TableColumn>
            <TableColumn key="customer">CLIENTE</TableColumn>
            <TableColumn key="dates">ESTANCIA</TableColumn>
            <TableColumn key="total">TOTAL</TableColumn>
            <TableColumn key="status">ESTADO DEL PAGO</TableColumn>
            <TableColumn key="actions" align="center">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody
            items={reservations || []}
            loadingContent={<Spinner color="warning" />}
            loadingState={loadingReservations ? "loading" : "idle"}
            emptyContent={"No se encontraron reservas."}
          >
            {(item) => {
              const todayStr = new Date().toISOString().split("T")[0];
              const isToday = item.check_in?.startsWith(todayStr);

              return (
                <TableRow
                  key={item.uuid}
                  className={`transition-colors ${isToday ? "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border-l-4 border-[#D4AF37]" : "hover:bg-white/5"}`}
                >
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center py-2 px-4 border border-white/10 rounded-2xl bg-[#0f1e09]/20 backdrop-blur-sm">
          <Pagination
            isCompact
            showControls
            showShadow
            color="warning"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
            classNames={{
              wrapper: "gap-2",
              item: "bg-white/5 text-white/60 border-white/10 hover:bg-white/10",
              cursor: "bg-[#D4AF37] text-black font-bold",
              prev: "bg-white/5 text-white/60 hover:bg-white/10",
              next: "bg-white/5 text-white/60 hover:bg-white/10",
            }}
          />
        </div>
      )}

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        Content={() => {
          if (!currentReservation) return <Spinner color="warning" />;

          if (modalMode === "detail") {
            return (
              <DetailReservation
                reservation={currentReservation}
                setUpdateReservations={setUpdateReservations}
              />
            );
          }

          if (modalMode === "edit") {
            return (
              <ReservationEdit
                reservation={currentReservation}
                setUpdateReservations={setUpdateReservations}
              />
            );
          }

          return null;
        }}
      />
    </div>
  );
}
