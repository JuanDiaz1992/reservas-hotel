import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { Search, Ticket, ArrowLeft } from "lucide-react";
import DetailReservation from "../components/CheckingComponents/detailReservation";
import BasicBanner from "../components/basicBanner";

export default function CheckReservationPage() {
  const { param } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [title, setTitle] = useState("Tu Reserva");

  useEffect(() => {
    if (!param) {
      setTitle("Tu Reserva");
    }
  }, [param]);

  const handleSearch = () => {
    if (!searchId.trim()) return;
    navigate(`/my-reservation/${searchId.trim()}`);
  };

  const handleBack = () => {
    setSearchId("");
    navigate("/my-reservation");
  };

  return (
    <>
      <BasicBanner title={title} imgSrc="/images/home-2.webp" />

      <div className="container mx-auto max-w-[800px] px-4 py-10 animate-appearance-in">
        {param ? (
          <div className="flex flex-col gap-4">
            <Button
              variant="flat"
              onPress={handleBack}
              startContent={<ArrowLeft size={18} />}
              className="self-start mb-4 bg-gray-100 font-semibold"
            >
              Consultar otro código
            </Button>
            <DetailReservation setTitle={setTitle} />
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-none">
              <CardBody className="p-8 flex flex-col gap-6 text-center">
                <div className="w-16 h-16 bg-[#476d15]/10 rounded-full flex items-center justify-center mx-auto">
                  <Ticket size={32} className="text-[#476d15]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Consultar Reserva</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Ingresa el UUID o código de reserva para ver los detalles.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    label="ID de Reserva"
                    placeholder="Pega aquí el código..."
                    labelPlacement="outside"
                    variant="bordered"
                    value={searchId}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setSearchId(e.target.value)}
                    startContent={
                      <Search size={18} className="text-gray-400" />
                    }
                  />
                  <Button
                    color="primary"
                    className="bg-[#476d15] text-white font-bold h-12 mt-2"
                    onPress={handleSearch}
                  >
                    Consultar Estado
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
