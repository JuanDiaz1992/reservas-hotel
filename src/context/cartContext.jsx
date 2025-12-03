import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const calculateNights = () => {
    if (!dateRange || !dateRange.start || !dateRange.end) return 1;
    try {
      const start = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day);
      const end = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day);
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
      const exists = prevCart.find((item) => item.id === room.id);
      if (exists) return prevCart;
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


  useEffect(() => {
    if (cart.length > 0) {
      clearCart();
    }
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