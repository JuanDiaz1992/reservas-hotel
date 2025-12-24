import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  PlusCircle,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  User as UserUI,
  addToast,
} from "@heroui/react";
import { useAuth } from "../context/authContext";
import { postProtected } from "../../api/post";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/AdminComponents.jsx/RoomList";
import { getProtected } from "../../api/get";

export default function AdminPanel() {
  const { logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getProtected({ endpoint: "/rooms", token: token });
      if (response.data) {
        setRooms(response.data.data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await postProtected({
        endpoint: "/logout",
        body: {},
        token: token,
      });
      if (response.data) {
        addToast({
          title: "Sesión cerrada",
          description: "Has salido del sistema correctamente",
          color: "success",
        });
      }
    } catch (error) {
      console.error("Error al invalidar token en servidor:", error);
    } finally {
      logout();
      navigate("/");
    }
  };
  const totalDisponibilidad = rooms.reduce(
    (acc, room) => acc + (room.inventory || 0),
    0
  );
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "rooms", label: "Gestión de Cuartos", icon: <BedDouble size={20} /> },
    { id: "bookings", label: "Reservas", icon: <CalendarCheck size={20} /> },
    {
      id: "addons",
      label: "Addons / Servicios",
      icon: <PlusCircle size={20} />,
    },
  ];

  return (
    <div className="bg-[#0a0f06] flex text-white font-sans min-h-[900px]">
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#0f1e09] border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#D4AF37] p-2 rounded-lg">
            <Settings size={20} className="text-black" />
          </div>
          {isSidebarOpen && (
            <span className="font-serif font-bold tracking-widest text-lg">
              CATLEYA
            </span>
          )}
        </div>

        <nav className="flex-grow px-3 mt-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {isSidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
          <a 
              href="/" 
              target="_blank" 
              className="w-full flex items-center gap-3 p-3 rounded-xl text-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all"
            >
              <ExternalLink size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Ver Web Pública</span>}
            </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="light"
            className="w-full justify-start text-danger hover:bg-danger/10"
            onPress={handleLogout}
            startContent={<LogOut size={20} />}
          >
            {isSidebarOpen && "Cerrar Sesión"}
          </Button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0f06]/50 backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/60 hover:text-white"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <UserUI
            name="Administrador"
            description="Admin Principal"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              className: "border-1 border-[#D4AF37]",
            }}
            classNames={{
              name: "text-white",
              description: "text-[#D4AF37]/60",
            }}
          />
        </header>

        {/* CONTENT AREA */}
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-serif text-white">
              {menuItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-white/40 text-sm">
              Panel de control administrativo / Catleya Royal Club
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ejemplo de Cards de Resumen */}
            <Card className="bg-[#0f1e09] border border-white/10 text-white">
              <CardBody className="p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                  <BedDouble size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">
                    Disponibilidad Inmediata
                  </p>
                  <p className="text-2xl font-bold">{totalDisponibilidad}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#0f1e09] border border-white/10 text-white">
              <CardBody className="p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">
                    Reservas Hoy
                  </p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#0f1e09] border border-white/10 text-white">
              <CardBody className="p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">
                    Addons Activos
                  </p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-10">
            {activeTab === "dashboard" && (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/20">
                Bienvenido al resumen general
              </div>
            )}

            {activeTab === "rooms" && (
              <RoomList rooms={rooms} isLoading={isLoading} />
            )}

            {activeTab === "bookings" && (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/20">
                Módulo de Reservas en desarrollo...
              </div>
            )}

            {activeTab === "addons" && (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/20">
                Módulo de Addons en desarrollo...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
