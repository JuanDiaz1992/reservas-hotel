import { HeroUIProvider } from "@heroui/react";
import {ToastProvider} from "@heroui/toast";
import { useHref, useNavigate } from "react-router-dom";
import { CurrencyProvider } from './context/currencyContext'
import { CartProvider } from './context/cartContext';

export function Provider({ children }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />
      <CartProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </CartProvider>
    </HeroUIProvider>
  );
}