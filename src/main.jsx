import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import toast, { Toaster, ToastIcon, resolveValue } from "react-hot-toast";
import { X } from "lucide-react";

import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import "./styles/globals.css";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>

    <Toaster position="top-right">
      {(t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } flex items-center w-full min-w-[300px] max-w-md overflow-hidden pointer-events-auto transition-all duration-300 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 ring-1 ring-white/5`}
          style={{
            // FONDO CON TRANSPARENCIA Y BLUR (Glassmorphism)
            // Usamos un fondo oscuro al 85% y backdrop-blur
            backgroundColor: "rgba(18, 18, 18, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", // Soporte para Safari
            
            borderLeft: t.type === 'success' 
              ? '6px solid #476d15' 
              : t.type === 'error' 
                ? '6px solid #f31260' 
                : '6px solid #D4AF37',
            ...t.style,
          }}
        >
          {/* Contenido del Toast */}
          <div className="flex items-center flex-1 p-4">
            <div className="flex-shrink-0 drop-shadow-md">
              <ToastIcon toast={t} />
            </div>
            
            <div className="ml-3 flex-1 text-sm font-semibold text-white drop-shadow-sm">
              {resolveValue(t.message, t)}
            </div>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-4 flex items-center justify-center text-white/30 hover:text-white border-l border-white/10 transition-colors group bg-white/5"
          >
            <X size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </Toaster>
  </React.StrictMode>
);