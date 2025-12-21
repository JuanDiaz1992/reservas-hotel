import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("booking_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) { return []; }
  });

  const [dateRange, setDateRange] = useState(() => {
    try {
      const savedDates = localStorage.getItem("booking_dates");
      return savedDates ? JSON.parse(savedDates) : null;
    } catch (error) { return null; }
  });

  const [reservationId, setReservationId] = useState(() => {
    try {
      return sessionStorage.getItem("booking_reservation_uuid") || null;
    } catch (error) { return null; }
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    return sessionStorage.getItem("booking_payment_method") || null;
  });

  const [guestCount, setGuestCount] = useState(() => {
    try {
      const savedGuests = localStorage.getItem("booking_guests");
      return savedGuests ? parseInt(savedGuests) : 2;
    } catch (error) { return 2; }
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

  useEffect(() => {
    localStorage.setItem("booking_guests", guestCount);
  }, [guestCount]);

  useEffect(() => {
    if (reservationId) {
      sessionStorage.setItem("booking_reservation_uuid", reservationId);
    } else {
      sessionStorage.removeItem("booking_reservation_uuid");
    }
  }, [reservationId]);

  useEffect(() => {
    if (selectedPaymentMethod) {
      sessionStorage.setItem("booking_payment_method", selectedPaymentMethod);
    } else {
      sessionStorage.removeItem("booking_payment_method");
    }
  }, [selectedPaymentMethod]);

  const calculateNights = () => {
    if (!dateRange || !dateRange.start || !dateRange.end) return 1;
    try {
      const start = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day);
      const end = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch (e) { return 1; }
  };

  const totalNights = calculateNights();

  const addToCart = (room) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === room.id);
      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = { ...updatedCart[existingIndex], ...room, quantity: updatedCart[existingIndex].quantity };
        return updatedCart;
      }
      return [...prevCart, { ...room, quantity: 1 }];
    });
    setIsSidebarOpen(true);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) setIsSidebarOpen(false);
  };

  const clearCart = () => {
    setCart([]);
    setIsSidebarOpen(false);
  };

  const finalizeBooking = () => {
    clearCart();
    localStorage.removeItem("booking_dates");
    localStorage.removeItem("booking_guests");
    sessionStorage.removeItem("booking_reservation_uuid");
    sessionStorage.removeItem("booking_payment_method");
    setReservationId(null);
    setSelectedPaymentMethod(null);
  };

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
        guestCount,
        setGuestCount,
        reservationId,
        setReservationId,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        finalizeBooking
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