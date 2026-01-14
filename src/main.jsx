import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className:
          "border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md text-white rounded-2xl shadow-2xl",
        style: {
          background: "transparent",
          color: "#fff",
          padding: "12px 16px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#476d15",
            secondary: "#fff",
          },
          className:
            "border-l-4 border-l-[#476d15] bg-[#1a1a1a]/90 backdrop-blur-xl",
        },
        error: {
          iconTheme: {
            primary: "#f31260",
            secondary: "#fff",
          },
          className:
            "border-l-4 border-l-[#f31260] bg-[#1a1a1a]/90 backdrop-blur-xl",
        },
      }}
    />
  </React.StrictMode>
);
