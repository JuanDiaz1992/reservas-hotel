import { TERMS_AND_CONDITIONS } from "../data";
import { Button } from "@heroui/react";
import { ChevronLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50">
      <div className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center bg-[#2c4549] no-print">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
          alt="Banner Catleya Royal Club"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-4 mt-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">
            Políticas y Condiciones
          </h1>
          <p className="text-sm md:text-base text-gray-200 tracking-widest uppercase">
            Catleya Royal Club
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
        <div className="flex justify-between items-center mb-6 no-print">
          <Button
            variant="flat"
            className="bg-white/90 backdrop-blur shadow-sm text-gray-700"
            startContent={<ChevronLeft size={18} />}
            onPress={() => navigate(-1)}
          >
            Volver
          </Button>

          <Button
            color="primary"
            className="shadow-lg"
            startContent={<Printer size={18} />}
            onPress={handlePrint}
          >
            Imprimir Documento
          </Button>
        </div>
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 mt-[100px]">
          <div className="bg-[#476d15] h-1.5 w-full" />

          <div className="p-8 sm:p-16">
            <article
              className="prose prose-slate max-w-none 
                prose-headings:text-[#2c4549] 
                prose-headings:font-serif 
                prose-strong:text-gray-900
                prose-p:text-gray-600 
                prose-li:text-gray-600
                prose-h3:text-2xl prose-h3:mb-6"
              dangerouslySetInnerHTML={{ __html: TERMS_AND_CONDITIONS }}
            />

            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center gap-6">
              <p className="text-xs text-gray-400 text-center uppercase tracking-widest">
                Documento actualizado al:{" "}
                {new Date().toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-col items-center gap-2 grayscale opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                  Tecnología de reserva desarrollada por
                </span>
                <a
                  href="https://sitepixelstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="font-bold text-sm text-gray-800 tracking-tight">
                    Site Pixel Studio
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 no-print">
          <p className="text-sm text-gray-500">
            ¿Tiene alguna pregunta sobre estos términos?
          </p>
          <a
            href="mailto:reservas@catleyaroyalclub.com"
            className="text-[#476d15] font-bold hover:underline"
          >
            reservas@catleyaroyalclub.com
          </a>
        </div>
      </div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .shadow-2xl { box-shadow: none !important; border: 1px solid #eee !important; }
          .max-w-4xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .-mt-16 { margin-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
