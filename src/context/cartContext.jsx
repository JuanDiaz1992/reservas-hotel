import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("booking_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const [dateRange, setDateRange] = useState(() => {
    try {
      const savedDates = localStorage.getItem("booking_dates");
      return savedDates ? JSON.parse(savedDates) : null;
    } catch (error) {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("booking_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (dateRange) {
      localStorage.setItem("booking_dates", JSON.stringify(dateRange));
    } else {
      localStorage.removeItem("booking_dates");
    }
  }, [dateRange]);

  const calculateNights = () => {
    if (!dateRange || !dateRange.start || !dateRange.end) return 1;
    try {
      const start = new Date(
        dateRange.start.year,
        dateRange.start.month - 1,
        dateRange.start.day
      );
      const end = new Date(
        dateRange.end.year,
        dateRange.end.month - 1,
        dateRange.end.day
      );
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch (e) {
      return 1;
    }
  };

  const totalNights = calculateNights();

  const addToCart = (room) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === room.id);

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          ...room,
          quantity: updatedCart[existingIndex].quantity
        };
        
        return updatedCart;
      }

      // Si no existe, lo agregamos como nuevo
      return [...prevCart, { ...room, quantity: 1 }];
    });
    setIsSidebarOpen(true);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) {
      setIsSidebarOpen(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setIsSidebarOpen(false);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  useEffect(() => {
  }, [dateRange]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isSidebarOpen,
        setIsSidebarOpen,
        dateRange,
        setDateRange,
        totalNights,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};