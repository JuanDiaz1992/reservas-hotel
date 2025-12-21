import { Button, Card, CardBody, Divider, Spinner, Chip } from "@heroui/react";
import {
  CheckCircle2,
  Mail,
  Home,
  AlertCircle,
  Trash2,
  Calendar,
  Info
} from "lucide-react";
import { useCart } from "../../context/cartContext";
import { get } from "../../../api/get";
import { post } from "../../../api/post";
import { useEffect, useState, useRef } from "react";

export default function SuccessReservation({ setTitle }) {
  const { reservationId, setReservationId, finalizeBooking } = useCart();
  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState(null);
  const [error, setError] = useState(false);
  
  // Referencia para asegurar que la limpieza solo ocurra una vez tras el éxito
  const hasFinalized = useRef(false);

  useEffect(() => {
    setTitle("¡Reserva Recibida!");
    if (reservationId) {
      const fetchReserva = async () => {
        setLoading(true);
        const response = await get({
          endpoint: `/reservations/${reservationId}`,
        });
        if (!response.error && response.data?.status === "success") {
          setResData(response.data.data);
          // Limpiamos los datos locales solo después de cargar exitosamente los datos del backend
          if (!hasFinalized.current) {
            finalizeBooking();
            hasFinalized.current = true;
          }
        } else {
          setError(true);
        }
        setLoading(false);
      };
      fetchReserva();
    }
  }, [reservationId, setTitle, finalizeBooking]);

  const handleCancel = async () => {
    const idParaCancelar = resData?.reservation_uuid || reservationId;
    if (window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      const response = await post({
        endpoint: `/reservations/${idParaCancelar}/cancel`,
        body: {},
      });

      if (!response.error) {
        alert("Reserva cancelada exitosamente");
        setReservationId(null);
        window.location.href = "/";
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Cargando resumen de reserva..." />
      </div>
    );

  // VISTA CUANDO NO HAY ID O HUBO ERROR
  if (error || (!reservationId && !resData && !loading)) {
    return (
      <div className="flex flex-col items-center py-10 gap-6 max-w-md mx-auto text-center animate-appearance-in">
        <div className="bg-amber-50 p-6 rounded-full">
          <Info size={48} className="text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-800">Sin sesión de reserva activa</h3>
          <p className="text-gray-600">
            Los datos temporales de tu proceso de compra han sido eliminados por seguridad al finalizar o recargar la página.
          </p>
        </div>
        
        <Card shadow="sm" className="bg-blue-50 border-none">
          <CardBody className="flex flex-row gap-3 items-center">
            <Mail className="text-blue-500 shrink-0" size={20} />
            <p className="text-sm text-blue-900 text-left">
              Tu reserva ya está en nuestro sistema. Por favor, <strong>revisa tu correo electrónico</strong> (incluyendo spam) para ver tu confirmación y detalles de pago.
            </p>
          </CardBody>
        </Card>

        <Button 
          className="bg-[#476d15] text-white px-10" 
          onPress={() => (window.location.href = "/")}
          startContent={<Home size={18} />}
        >
          Ir al Inicio
        </Button>
      </div>
    );
  }

  // VISTA DE ÉXITO (RESUMEN)
  return (
    <div className="animate-appearance-in flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Código: {resData?.reservation_code}
        </h3>
        <Chip color="warning" variant="flat" size="sm">
          {resData?.status === "awaiting_payment"
            ? "Esperando Pago"
            : resData?.status}
        </Chip>
      </div>

      <Card className="border-none shadow-md">
        <CardBody className="p-6 gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span className="text-sm">
                {resData?.check_in} al {resData?.check_out}
              </span>
            </div>
            <span className="font-semibold">{resData?.nights} noche(s)</span>
          </div>

          <Divider />

          <div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-2">
              Habitaciones
            </p>
            {resData?.rooms.map((room, i) => (
              <div key={i} className="flex justify-between py-1">
                <span className="text-gray-700">{room.room_name}</span>
                <span className="font-medium">
                  ${Number(room.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {resData?.addons && resData.addons.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                Servicios Extra
              </p>
              {resData.addons.map((addon, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-gray-700">
                    {addon.name} (x{addon.quantity})
                  </span>
                  <span className="font-medium">
                    ${Number(addon.total).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Divider />

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-lg font-bold text-[#476d15]">
              <span>Total a pagar</span>
              <span>
                ${Number(resData?.total_price).toLocaleString()}{" "}
                {resData?.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm text-blue-600 font-medium">
              <span>Anticipo requerido (50%)</span>
              <span>${Number(resData?.deposit_required).toLocaleString()}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
        <Mail className="text-blue-500 shrink-0" size={20} />
        <p className="text-sm text-blue-800">
          Enviamos los detalles de pago a tu correo. Por favor, realiza el pago
          para confirmar tu estancia.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full pb-10">
        <Button
          className="flex-1 bg-[#476d15] text-white"
          onPress={() => (window.location.href = "/")}
          startContent={<Home size={18} />}
        >
          Ir al Inicio
        </Button>
        <Button
          variant="light"
          color="danger"
          className="flex-1"
          onPress={handleCancel}
          startContent={<Trash2 size={18} />}
        >
          Cancelar Reserva
        </Button>
      </div>
    </div>
  );
}