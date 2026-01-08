import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  PlusCircle,
  LogOut,
  Settings,
  Menu,
  X,
  ExternalLink,
  ClipboardCheck,
  BellRing,
  CalendarX2,
  Search,
  RotateCw,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  User as UserUI,
  addToast,
  Tabs,
  Tab,
} from "@heroui/react";
import { useAuth } from "../context/authContext";
import { postProtected } from "../../api/post";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/AdminComponents/Rooms/RoomList";
import ReservationsList from "../components/AdminComponents/Reservations/ReservationsList";
import { getProtected } from "../../api/get";
import { useAdminDataRooms } from "../hooks/useAdminDataRooms";
import { useAdminDataReservations } from "../hooks/useAdminDataReservations";

export default function AdminPanel() {
  const { logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { rooms } = useAdminDataRooms(token);
  const { reservationsData } = useAdminDataReservations(token, activeTab);

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
    <div className="bg-[#0a0f06] flex text-white font-sans min-h-screen">
      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#0f1e09] border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-grow px-3 mt-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
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
        </nav>

        {/* BOTTOM ACTIONS (RESTAURADOS) */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink size={20} />
            {isSidebarOpen && (
              <span className="text-sm font-medium">Volver a la web</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0f06]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white/60 hover:text-white"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {activeTab !== "dashboard" && (
              <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-8 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-2">
                  <BedDouble size={14} className="text-blue-500" />
                  <span className="text-xs font-medium text-white/60">
                    {rooms.totalDisponibilidad}{" "}
                    <span className="text-[10px] opacity-40 uppercase">
                      Libres
                    </span>
                  </span>
                </div>
                {/*              <div className="flex items-center gap-2">
                  <CalendarCheck
                    size={14}
                    className={
                      pendingCount > 0 ? "text-orange-500" : "text-green-500"
                    }
                  />
                  <span className="text-xs font-medium text-white/60">
                    {pendingCount}{" "}
                    <span className="text-[10px] opacity-40 uppercase">
                      Pendientes
                    </span>
                  </span>
                </div> */}
                <div className="flex items-center gap-2">
                  <PlusCircle size={14} className="text-[#D4AF37]" />
                  <span className="text-xs font-medium text-white/60">
                    0{" "}
                    <span className="text-[10px] opacity-40 uppercase">
                      Add Ons
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <UserUI
            name="Administrador"
            description="Admin Principal"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              className: "border-1 border-[#D4AF37]",
            }}
            classNames={{
              name: "text-white text-sm",
              description: "text-[#D4AF37]/60 text-[10px]",
            }}
          />
        </header>

        {/* CONTENT AREA */}
        <div className="p-8">
          {activeTab === "dashboard" && (
            <header className="mb-6">
              <h1 className="text-2xl font-serif text-white uppercase tracking-wider">
                {menuItems.find((i) => i.id === activeTab)?.label}
              </h1>
              <p className="text-white/40 text-sm">
                Resumen de operaciones y estado actual del club
              </p>
            </header>
          )}

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
              <Card className="bg-[#0f1e09]/40 border border-white/5 text-white shadow-none p-2">
                <CardBody className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <BedDouble size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                      Disponibilidad
                    </p>
                    <p className="text-3xl font-bold leading-tight">
                      {rooms.totalDisponibilidad}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-[#0f1e09]/40 border border-white/5 text-white shadow-none p-2">
                <CardBody className="flex flex-row items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      reservationsData.pendingCount > 0
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    <CalendarCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                      Por Revisar
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold leading-tight">
                        {reservationsData.pendingCount}
                      </p>
                      <p className="text-xs text-white/20">
                        de {reservationsData.totalReservations}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-[#0f1e09]/40 border border-white/5 text-white shadow-none p-2">
                <CardBody className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                      Adds On
                    </p>
                    <p className="text-3xl font-bold leading-tight">0</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          <div className={`${activeTab === "dashboard" ? "mt-10" : "mt-0"}`}>
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/5">
                  <Tabs
                    aria-label="Filtro de reservas"
                    variant="underlined"
                    color="warning"
                    selectedKey={reservationsData.reservationFilter}
                    onSelectionChange={(key) => {
                      reservationsData.setReservationFilter(key);
                      reservationsData.setCurrentPage(1);
                      if (key !== "search") {
                        reservationsData.setOnSearch(false);
                      }
                    }}
                    classNames={{
                      base: "w-full",
                      tabList: "gap-6 relative rounded-none border-b-0",
                      cursor: "w-full bg-[#D4AF37]",
                      tab: "max-w-fit px-0 h-12",
                      tabContent:
                        "group-data-[selected=true]:text-[#D4AF37] font-medium text-sm",
                    }}
                  >
                    <Tab
                      key="inbox"
                      title={
                        <div className="flex items-center space-x-2">
                          <BellRing size={16} />
                          <span>Inbox</span>
                        </div>
                      }
                    />
                    <Tab
                      key="history"
                      title={
                        <div className="flex items-center space-x-2">
                          <ClipboardCheck size={16} />
                          <span>Confirmadas</span>
                        </div>
                      }
                    />
                    <Tab
                      key="cancelled"
                      title={
                        <div className="flex items-center space-x-2">
                          <CalendarX2 size={16} />
                          <span>Canceladas</span>
                        </div>
                      }
                    />
                    {reservationsData.onSearch && (
                      <Tab
                        key="search"
                        title={
                          <div className="flex items-center space-x-2">
                            <Search size={16} className="text-[#D4AF37]" />
                            <span className="text-[#D4AF37]">Resultados</span>
                          </div>
                        }
                      />
                    )}
                  </Tabs>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    onPress={() =>
                      reservationsData.getReservations(reservationsData.reservationFilter, reservationsData.currentPage)
                    }
                    isLoading={reservationsData.loadingReservations}
                    className="text-white/40 hover:text-[#D4AF37] transition-colors"
                    title="Recargar reservas"
                  >
                    {!reservationsData.loadingReservations && <RotateCw size={18} />}
                  </Button>
                </div>

                <ReservationsList
                  reservations={reservationsData.reservations}
                  loadingReservations={reservationsData.loadingReservations}
                  setUpdateReservations={reservationsData.setUpdateReservations}
                  setSearchTerm={reservationsData.setSearchTerm}
                  currentPage={reservationsData.currentPage}
                  totalPages={reservationsData.totalPages}
                  onPageChange={(page) => reservationsData.setCurrentPage(page)}
                />
              </div>
            )}

            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/20">
                  Próximos Check-ins
                </div>
                <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/20">
                  Estado de Cuartos
                </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <RoomList
                rooms={rooms.data}
                isLoading={rooms.isLoading}
                setUpdateRooms={rooms.setUpdateRooms}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
