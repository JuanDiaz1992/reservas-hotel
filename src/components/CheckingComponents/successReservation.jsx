import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Spinner,
  Chip,
  addToast,
} from "@heroui/react";
import {
  CheckCircle2,
  Home,
  Trash2,
  Calendar,
  Info,
  Landmark,
  Copy,
  Check,
  Clock,
  CreditCard,
  Mail,
  XCircle,
} from "lucide-react";
import { useCart } from "../../context/cartContext";
import { get } from "../../../api/get";
import { post } from "../../../api/post";
import { del } from "../../../api/delete";
import { BANK_ACCOUNTS, TRANSFER_INSTRUCTIONS } from "../../data";
import { scrollToTopInstant } from "../../utils/scrollToTop"

export default function SuccessReservation({ setTitle }) {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { selectedPaymentMethod, finalizeBooking } = useCart();

  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState(null);
  const [error, setError] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const finalizedSent = useRef(false);

  const statusConfig = {
    pending: {
      label: "Pendiente de Pago",
      color: "warning",
      icon: <Clock size={16} />,
    },
    awaiting_payment: {
      label: "Esperando Pago",
      color: "warning",
      icon: <Clock size={16} />,
    },
    confirmed: {
      label: "Reserva Confirmada",
      color: "success",
      icon: <CheckCircle2 size={16} />,
    },
    cancelled: {
      label: "Reserva Cancelada",
      color: "danger",
      icon: <XCircle size={16} />,
    },
  };

  const openEpaycoWidget = (epaycoData) => {
    if (window.ePayco) {
      const handler = window.ePayco.checkout.configure({
        key: epaycoData.key,
        test: epaycoData.test,
      });
      handler.open(epaycoData);
    } else {
      addToast({
        title: "Error",
        description: "No se cargó el módulo de pagos.",
        color: "danger",
      });
    }
  };

  const handleOnlinePayment = async () => {
    if (resData?.epayco_data) {
      openEpaycoWidget(resData.epayco_data);
      return;
    }

    try {
      setIsInitializingPayment(true);
      const payRes = await post({
        endpoint: `/reservations/${uuid}/init-payment`,
        body: { payment_method: "epayco" },
      });

      if (payRes.data?.epayco_data) {
        openEpaycoWidget(payRes.data.epayco_data);
      } else {
        throw new Error("No se recibieron datos de pago");
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: "No se pudo iniciar el proceso de pago.",
        color: "danger",
      });
    } finally {
      setIsInitializingPayment(false);
    }
  };

  useEffect(() => {
    setTitle("Detalles de tu Reserva");
    if (!uuid) return;

    const loadData = async () => {
      setLoading(true);
      setError(false);
      const response = await get({
        endpoint: `/reservations/${uuid}`,
      });

      if (!response.error && response.data?.status === "success") {
        const data = response.data.data;
        setResData(data);

        if (!finalizedSent.current) {
          finalizedSent.current = true;
          finalizeBooking();
        }
      } else {
        setError(true);
      }
      setLoading(false);
    };

    loadData();
  }, [uuid]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancel = async () => {
    if (!window.confirm("¿Estás seguro de que deseas anular esta reserva?"))
      return;
    setIsCancelling(true);

    const response = await del({
      endpoint: `/reservations/${uuid}`,
    });

    if (!response.error) {
      addToast({
        title: "Reserva anulada",
        description: "La reserva se ha cancelado correctamente.",
        color: "success",
      });

      setTimeout(() => {
        navigate("/");
        scrollToTopInstant()
      }, 1500);
    } else {
      setIsCancelling(false);
      addToast({
        title: "Error",
        description: "No se pudo anular la reserva.",
        color: "danger",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Cargando información..." color="success" />
      </div>
    );

  if (error || (!resData && !loading))
    return (
      <div className="flex flex-col items-center py-10 gap-6 text-center">
        <Info size={48} className="text-amber-600" />
        <h3 className="text-2xl font-bold">Reserva no encontrada</h3>
        <Button onPress={() => navigate("/")}>Ir al Inicio</Button>
      </div>
    );

  const isPaymentRequired =
    resData.payment_status === "pending" &&
    (resData.status === "pending" || resData.status === "awaiting_payment");

  const isBankTransfer = resData.payment_method_selected === "bank_transfer";
  const isOnlinePayment = resData.payment_method_selected === "epayco";

  const currentStatus = statusConfig[resData.status] || statusConfig.pending;

  return (
    <div className="animate-appearance-in flex flex-col gap-6 max-w-2xl mx-auto pb-10">
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
            resData.status === "cancelled" ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {resData.status === "cancelled" ? (
            <XCircle size={32} className="text-red-600" />
          ) : (
            <CheckCircle2 size={32} className="text-green-600" />
          )}
        </div>
        <h3 className="text-2xl font-bold">
          Código: {resData.reservation_code}
        </h3>
        <Chip
          color={currentStatus.color}
          variant="flat"
          startContent={currentStatus.icon}
          className="font-bold uppercase px-4 py-1"
        >
          {currentStatus.label}
        </Chip>
      </div>

      {isPaymentRequired && isBankTransfer && (
        <Card className="bg-amber-50 border-none shadow-sm border-l-4 border-l-amber-500">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4 text-amber-900 font-bold">
              <Landmark size={24} className="text-amber-600" />
              <h4>Instrucciones de Transferencia</h4>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-amber-800">
                Para confirmar tu reserva, realiza el pago del{" "}
                <strong>50% (Depósito)</strong> a cualquiera de nuestras
                cuentas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BANK_ACCOUNTS.map((acc, i) => (
                  <div
                    key={i}
                    className="bg-white p-3 rounded-xl border border-amber-200"
                  >
                    <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">
                      {acc.bank}
                    </p>
                    <div className="flex justify-between items-center font-mono font-bold text-gray-800">
                      <span>{acc.number}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleCopy(acc.number, i)}
                      >
                        {copiedId === i ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {acc.type} - {acc.titular || "Catleya RoyalClub"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-200">
                <div className="flex gap-2 items-start text-sm text-amber-900">
                  <Mail size={16} className="mt-1 shrink-0" />
                  <div>
                    <p className="font-bold">¿A dónde enviar el comprobante?</p>
                    <p>
                      Envía la foto a:{" "}
                      <strong>{TRANSFER_INSTRUCTIONS.email}</strong>
                    </p>
                    <p className="text-xs mt-1 italic">
                      Monto: ${Number(resData.deposit_required).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {isPaymentRequired && isOnlinePayment && (
        <Card className="bg-blue-50 border-l-4 border-l-blue-500 shadow-sm">
          <CardBody className="p-6 flex flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <CreditCard className="text-blue-700 shrink-0" />
              <div>
                <p className="font-bold text-blue-900">
                  Pago en línea pendiente
                </p>
                <p className="text-xs text-blue-800">
                  Depósito: $
                  {Number(resData.deposit_required).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              color="primary"
              className="font-bold"
              onPress={handleOnlinePayment}
              isLoading={isInitializingPayment}
            >
              Pagar Ahora
            </Button>
          </CardBody>
        </Card>
      )}

      {!isPaymentRequired && resData.payment_status === "paid" && (
        <Card className="bg-green-50 border-none shadow-sm">
          <CardBody className="p-4 flex flex-row items-center gap-3 text-green-800 font-medium">
            <CheckCircle2 size={20} className="text-green-600" />
            <p>El depósito de esta reserva ya ha sido procesado.</p>
          </CardBody>
        </Card>
      )}

      <Card
        className={`border-none shadow-md ${
          resData.status === "cancelled" ? "opacity-60" : ""
        }`}
      >
        <CardBody className="p-6 gap-4">
          <div className="flex justify-between items-center text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="text-sm font-medium">
                {resData.check_in} — {resData.check_out}
              </span>
            </div>
            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded uppercase tracking-tighter">
              {resData.nights} noches
            </span>
          </div>
          <Divider />
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">
                Alojamiento
              </p>
              {resData.rooms?.map((room, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span className="text-gray-700">
                    {room.room_name} (x{room.adults} Ad)
                  </span>
                  <span className="font-semibold">
                    ${Number(room.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Total de la estancia</span>
              <span>
                ${Number(resData.total_price).toLocaleString()}{" "}
                {resData.currency}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#476d15]">
              <span>Monto Depósito (50%)</span>
              <span>${Number(resData.deposit_required).toLocaleString()}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 bg-[#476d15] text-white h-12 font-bold shadow-lg"
          onPress={() => navigate("/")}
          startContent={<Home size={18} />}
        >
          Volver al Inicio
        </Button>

        {(resData.status === "pending" || resData.status === "awaiting_payment") && (
          <Button
            variant="light"
            color="danger"
            className="flex-1 h-12 font-medium"
            onPress={handleCancel}
            isLoading={isCancelling}
            startContent={!isCancelling && <Trash2 size={18} />}
          >
            Anular Reserva
          </Button>
        )}
      </div>
    </div>
  );
}