import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Crown, LogIn } from "lucide-react";
import { Button, Input, Checkbox } from "@heroui/react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { post } from "../../api/post";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await post({
        endpoint: "/login",
        body: formData,
      });
      if (response.data && response.data.access_token) {
        toast.success("¡Bienvenido! Inicio de sesión exitoso");
        console.log(response.data.access_token);
        login(response.data.access_token);
        navigate("/admin");
      }
      else {
        toast.error("Inicio de sesión fallido. Verifica tus credenciales");
      }
    } catch (err) {
      toast.error("Error crítico. Ocurrió un error inesperado en la aplicación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const glassInputClasses = {
    label: "!text-white/60 text-xs uppercase tracking-wider font-medium mb-5",
    input: [
      "text-white placeholder:text-white/20",
      "bg-transparent",
      "autofill:transition-colors autofill:duration-[5000000s]",
      "autofill:[-webkit-text-fill-color:white]",
      "selection:bg-[#D4AF37]/30",
    ],
    innerWrapper: "bg-transparent",
    inputWrapper: [
      "h-12",
      "bg-white/5",
      "border-white/10",
      "backdrop-blur-sm",
      "group-data-[focus=true]:border-[#D4AF37]/50",
      "group-data-[hover=true]:bg-white/10",
      "group-data-[focus=true]:bg-white/10",
      "!cursor-text",
      "transition-all duration-300",
    ],
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-[60px] pb-[60px] overflow-hidden bg-[#0f1e09]">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/images/banner-login.webp)`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/50" />

      <div className="w-full max-w-md z-10 p-4">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 ring-1 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Crown className="text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-serif text-white tracking-wider">
            Catleya Royal Club
          </h1>
          <p className="text-[#D4AF37] text-xs font-medium tracking-[0.3em] uppercase">
            Acceso Administrativo
          </p>
        </div>
        <div className="bg-[#0f1e09]/80 border border-white/10 rounded-2xl py-6 px-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white mb-2 font-serif">
              Iniciar Sesión
            </h2>
            <p className="text-white/40 text-sm">
              Ingrese credenciales autorizadas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              value={formData.email}
              onValueChange={(value) => handleInputChange("email", value)}
              placeholder="correo@correo.com"
              isRequired
              variant="bordered"
              startContent={
                <Mail className="h-4 w-4 text-white/40 group-data-[focus=true]:text-[#D4AF37] transition-colors" />
              }
              classNames={glassInputClasses}
            />

            <div className="space-y-1">
              <Input
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                labelPlacement="outside"
                value={formData.password}
                onValueChange={(value) => handleInputChange("password", value)}
                placeholder="••••••••"
                isRequired
                variant="bordered"
                startContent={
                  <Lock className="h-4 w-4 text-white/40 group-data-[focus=true]:text-[#D4AF37] transition-colors" />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-white/40 h-4 w-4" />
                    ) : (
                      <Eye className="text-white/40 h-4 w-4" />
                    )}
                  </button>
                }
                classNames={glassInputClasses}
              />
            </div>


            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#5C6046] to-[#5C6046] hover:from-[#b09265] hover:to-[#a0a873] text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(92,96,70,0.3)] transition-all duration-500 border-none mt-5"
              startContent={!isLoading && <LogIn className="w-4 h-4" />}
            >
              Ingresar al Sistema
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
