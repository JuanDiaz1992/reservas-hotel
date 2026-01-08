import { Button, Divider, Chip, User, Tooltip, addToast } from "@heroui/react";
import { Phone, CreditCard, Moon, Trash2, XCircle } from "lucide-react";
import { patchProtected } from "../../../../api/patch";
import { useAuth } from "../../../context/authContext";

export default function DetailReservation({
  reservation,
  setUpdateReservations,
}) {
  const { token } = useAuth();


  const activeRooms = reservation?.reservation_rooms?.filter(room => room.status === "active") || [];
  const activeRoomsCount = activeRooms.length;

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await patchProtected({
        endpoint: `/reservations/room/${roomId}/cancel`,
        token: token,
      });
      if (response.status === 200) {
        setUpdateReservations(true);
        addToast({
          title: "Cuarto cancelado",
          description: `El cuarto fue cancelado existosamente de esta reserva`,
          color: "success",
        });
      }
    } catch (error) {
      console.error("Error al cancelar cuarto", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusColorMap = {
    confirmed: "success",
    pending: "warning",
    cancelled: "danger",
    partial: "primary",
    awaiting_payment: "warning"
  };

  return (
    <div className="text-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900">Detalle de Reserva</h2>
          <div className="space-y-1 mt-1">
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Código: <span className="font-mono font-bold text-[#D4AF37]">{reservation?.reservation_code}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono italic">UUID: {reservation?.uuid}</p>
          </div>
        </div>
        <Chip color={statusColorMap[reservation?.status] || "default"} variant="flat" className="capitalize">
          {reservation?.status?.replace("_", " ")}
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Información del Huésped</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <User
                name={`${reservation?.user?.name} ${reservation?.user?.last_name}`}
                description={reservation?.user?.email}
                avatarProps={{
                  radius: "full",
                  className: "bg-[#D4AF37]/20 text-[#D4AF37] font-bold",
                  name: reservation?.user?.name?.[0],
                }}
              />
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                {reservation?.user?.phone}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Detalles de Estancia</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase">Check-in</p>
                <p className="text-sm font-semibold">{formatDate(reservation?.check_in)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase">Check-out</p>
                <p className="text-sm font-semibold">{formatDate(reservation?.check_out)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600 ml-1">
              <Moon size={14} className="text-[#D4AF37]" />
              <span>{reservation?.total_nights} Noche(s) de estadía</span>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 font-serif">
              Habitaciones Reservadas
            </h3>
            <div className="space-y-2">
              {reservation?.reservation_rooms?.map((item) => {
                const isCancelled = item.status === "cancelled";

                const canDeleteThisRoom = !isCancelled && activeRoomsCount > 1;

                return (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all group ${
                      isCancelled 
                        ? "bg-slate-100 border-slate-200 opacity-60 grayscale-[0.5]" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isCancelled ? "text-slate-500 line-through" : "text-slate-700"}`}>
                          {item.room?.name}
                        </p>
                        {isCancelled && (
                          <Chip size="mini" variant="flat" color="danger" className="h-4 text-[9px] uppercase">
                            Cancelado
                          </Chip>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.adults} Adultos, {item.children} Niños
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-semibold ${isCancelled ? "text-slate-400 line-through" : "text-[#D4AF37]"}`}>
                        {formatCurrency(item.price)}
                      </p>

                      <div className="w-8 flex justify-center">
                        {canDeleteThisRoom ? (
                          <Tooltip content="Cancelar habitación" color="danger" closeDelay={0}>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onPress={() => handleDeleteRoom(item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </Tooltip>
                        )  : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Resumen de Pago</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Reserva</span>
                <span className="font-bold">{formatCurrency(reservation?.total_price)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Pagado</span>
                <span className="font-bold">- {formatCurrency(reservation?.paid_amount)}</span>
              </div>
              <Divider className="my-2 bg-slate-700" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-200 font-bold">Saldo Pendiente</span>
                <span className="text-xl font-bold text-[#D4AF37]">{formatCurrency(reservation?.balance_due)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
              <CreditCard size={12} />
              Método: {reservation?.payment_method?.replace("_", " ")}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}