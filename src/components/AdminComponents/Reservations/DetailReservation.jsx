import { Button, Divider, Chip, User, Tooltip } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { 
  Phone, 
  CreditCard, 
  Moon, 
  Trash2, 
  XCircle, 
  Users, 
  UserPlus, 
  Sparkles, 
  Calendar, 
  AlertCircle 
} from "lucide-react";
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
          description: `El cuarto fue cancelado exitosamente de esta reserva`,
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
    }).format(value || 0);
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
    <div className="text-slate-800 pb-4">
      {/* HEADER: Código y Estado */}
      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-2">
            Reserva <span className="text-[#D4AF37]">{reservation?.reservation_code}</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1 italic">UUID: {reservation?.uuid}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Chip color={statusColorMap[reservation?.status] || "default"} variant="flat" className="capitalize font-bold">
            {reservation?.status?.replace("_", " ")}
          </Chip>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">Origen: {reservation?.source}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: Personas, Fechas y Notas */}
        <div className="space-y-8">
          
          {/* TITULAR */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
              <Users size={14} className="text-[#D4AF37]" /> Titular de la Reserva
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
              <User
                name={`${reservation?.user?.name} ${reservation?.user?.last_name}`}
                description={reservation?.user?.email}
                avatarProps={{
                  radius: "full",
                  className: "bg-[#D4AF37] text-white font-bold",
                  name: reservation?.user?.name?.[0],
                }}
              />
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 ml-1">
                <Phone size={14} className="text-slate-400" />
                {reservation?.user?.phone || "No registrado"}
              </div>
            </div>
          </section>

          {/* ACOMPAÑANTES (GUESTS) */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
              <UserPlus size={14} className="text-[#D4AF37]" /> Acompañantes Registrados
            </h3>
            <div className="space-y-2">
              {reservation?.guests && reservation.guests.length > 0 ? (
                reservation.guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">
                      {guest.first_name} {guest.last_name}
                    </span>
                    <Chip size="sm" variant="flat" color={guest.is_child ? "primary" : "default"} className="h-5 text-[9px]">
                      {guest.is_child ? "NIÑO" : "ADULTO"}
                    </Chip>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-4 text-center border border-dashed rounded-lg bg-slate-50/50">
                  No se registraron acompañantes adicionales.
                </div>
              )}
            </div>
          </section>

          {/* ESTANCIA Y NOTAS */}
          <div className="grid grid-cols-1 gap-6">
            <section>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-[#D4AF37]" /> Periodo de Estancia
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Check-in</p>
                  <p className="text-sm font-semibold">{formatDate(reservation?.check_in)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Check-out</p>
                  <p className="text-sm font-semibold">{formatDate(reservation?.check_out)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 flex items-center gap-2 ml-1">
                <Moon size={14} className="text-[#D4AF37]" />
                <span className="font-medium">{reservation?.total_nights} Noche(s) de estadía</span>
              </p>
            </section>

            {/* PETICIONES ESPECIALES (IMPORTANTE) */}
            {reservation?.special_requests && (
              <section className="animate-pulse-subtle">
                <h3 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle size={14} /> Peticiones Especiales
                </h3>
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-orange-900 italic shadow-sm">
                  "{reservation.special_requests}"
                </div>
              </section>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Cuartos, Addons y Pagos */}
        <div className="space-y-6">
          
          {/* LISTADO DE HABITACIONES */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 font-serif">
              Habitaciones
            </h3>
            <div className="space-y-2">
              {reservation?.reservation_rooms?.map((item) => {
                const isCancelled = item.status === "cancelled";
                const canDeleteThisRoom = !isCancelled && activeRoomsCount > 1;

                return (
                  <div key={item.id} className={`flex justify-between items-center p-3 rounded-lg border transition-all group ${
                      isCancelled ? "bg-slate-100 border-slate-200 opacity-60" : "bg-slate-50 border-slate-100"
                    }`}>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isCancelled ? "text-slate-500 line-through" : "text-slate-700"}`}>
                        {item.room?.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.adults} Adultos, {item.children} Niños
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-semibold ${isCancelled ? "text-slate-400 line-through" : "text-[#D4AF37]"}`}>
                        {formatCurrency(item.price)}
                      </p>
                      {canDeleteThisRoom && (
                        <Tooltip content="Cancelar habitación" color="danger">
                          <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteRoom(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LISTADO DE ADDONS (SERVICIOS ADICIONALES) */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 font-serif">
              Servicios Extra (Addons)
            </h3>
            <div className="space-y-2">
              {reservation?.addons && reservation.addons.length > 0 ? (
                reservation.addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center">
                        <Sparkles size={14} className="text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{addon.name}</p>
                        <p className="text-[10px] text-slate-400">Cant: {addon.pivot?.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      {formatCurrency(addon.pivot?.total_price)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-2 bg-slate-50/30 rounded-lg">
                  Sin servicios adicionales contratados.
                </div>
              )}
            </div>
          </section>

          {/* RESUMEN DE PAGO (BLACK CARD) */}
          <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Resumen de Cuenta</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Habitaciones</span>
                <span>{formatCurrency(reservation?.rooms_price)}</span>
              </div>
              
              {Number(reservation?.addons_total) > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Servicios Adicionales</span>
                  <span>{formatCurrency(reservation?.addons_total)}</span>
                </div>
              )}

              {Number(reservation?.extra_person_charge) > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Cargos Persona Extra</span>
                  <span>{formatCurrency(reservation?.extra_person_charge)}</span>
                </div>
              )}

              <Divider className="my-2 bg-slate-700" />
              
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-200 font-bold uppercase text-xs">Total Reserva</span>
                <span className="text-xl font-bold text-white tracking-tight">
                  {formatCurrency(reservation?.total_price)}
                </span>
              </div>

              <div className="flex justify-between text-emerald-400 pb-1">
                <span>Monto Pagado</span>
                <span className="font-bold">- {formatCurrency(reservation?.paid_amount)}</span>
              </div>

              <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-800">
                <span className="text-[#D4AF37] font-bold text-sm tracking-widest">SALDO PENDIENTE</span>
                <div className="text-right">
                   <span className="text-2xl font-black text-[#D4AF37] drop-shadow-md">
                    {formatCurrency(reservation?.balance_due)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <CreditCard size={12} />
                {reservation?.payment_method?.replace("_", " ")}
              </div>
              <div className="flex items-center gap-1">
                <span>Pago:</span>
                <span className={`font-bold ${reservation?.payment_status === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                   {reservation?.payment_status}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}