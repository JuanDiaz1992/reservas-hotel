import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { useHref, useNavigate } from "react-router-dom";
import { CurrencyProvider } from "./context/currencyContext";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from "./context/authContext";
import { HelmetProvider } from "react-helmet-async";

export function Provider({ children }) {
  const navigate = useNavigate();

  return (
    <HelmetProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <AuthProvider>
          <ToastProvider />
          <CartProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </HeroUIProvider>
    </HelmetProvider>
  );
}
