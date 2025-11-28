import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Crown,
  LogIn,
} from "lucide-react";
import { Button, Input, Checkbox } from "@heroui/react";

export default function Login() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bgLogin = "url('/images/escapada-de-lujo-junto-la-piscina.webp')";

  useEffect(() => {
    const loadImages = async () => {
      // Solo cargamos la imagen de login
      const img = new Image();
      img.src = bgLogin
        .replace("url(", "")
        .replace(")", "")
        .replace(/'/g, "")
        .replace(/"/g, "");
      
      img.onload = () => setImagesLoaded(true);
      img.onerror = () => setImagesLoaded(true);
    };

    loadImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Iniciando sesión:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const glassInputClasses = {
    label: "!text-white/60 text-xs uppercase tracking-wider font-medium mb-5",
    input: [
      "text-white placeholder:text-white/20",
      "bg-transparent",
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

  if (!imagesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1e09]">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-serif text-[#D4AF37]">
            Cargando sistema...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-[60px] pb-[60px] overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: bgLogin,
        }}
      />

      <div className="absolute inset-0 z-0 bg-black/40" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 ring-1 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Crown className="text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl md:text-4xl font-serif text-white tracking-wider">
            Catleya Royal Club
          </h1>
          <p className="text-[#D4AF37] text-xs font-medium tracking-[0.3em] uppercase">
            Acceso Administrativo
          </p>
        </div>

        <div className="bg-[#0f1e09]/80 border border-white/10 rounded-2xl py-4 px-6 shadow-2xl overflow-hidden z-10 relative  animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50" />

          <div className="p-4 pt-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-white mb-2 font-serif">
                Iniciar Sesión
              </h2>
              <p className="text-white/40 text-sm">
                Ingrese sus credenciales para acceder al sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                labelPlacement="outside"
                value={formData.email}
                onValueChange={(value) => handleInputChange("email", value)}
                placeholder="admin@catleya.com"
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
                  label="Password"
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
                        <EyeOff className="text-2xl text-white/40 pointer-events-none h-4 w-4" />
                      ) : (
                        <Eye className="text-2xl text-white/40 pointer-events-none h-4 w-4" />
                      )}
                    </button>
                  }
                  classNames={glassInputClasses}
                />
              </div>

              <Checkbox
                isSelected={formData.rememberMe}
                onValueChange={(checked) =>
                  handleInputChange("rememberMe", checked)
                }
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-[#D4AF37] group-data-[selected=true]:border-[#D4AF37] text-black border-white/30",
                  label: "text-sm text-white/60 font-normal hover:text-white/80 transition-colors",
                }}
              >
                Mantener Sesión Abierta
              </Checkbox>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-12 bg-linear-to-r from-[#5C6046] to-[#5C6046] hover:from-[#b09265] hover:to-[#a0a873] text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(92,96,70,0.3)] hover:shadow-[0_0_25px_rgba(92,96,70,0.5)] transition-all duration-500 border-none data-[hover=true]:opacity-100 mt-5"
                startContent={!isLoading && <LogIn className="w-4 h-4" />}
              >
                Ingresar al Sistema
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}