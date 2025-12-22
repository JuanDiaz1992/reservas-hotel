import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("COP");

  const [exchangeRate, setExchangeRate] = useState(4000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRate = async () => {
      try {

        const response1 = await fetch("https://open.er-api.com/v6/latest/USD");
        if (response1.ok) {
          const data = await response1.json();
          if (data.rates && data.rates.COP) {
            console.log(
              "✅ Tasa obtenida de ExchangeRate-API:",
              data.rates.COP
            );
            setExchangeRate(data.rates.COP);
            setLoading(false);
            return;
          }
        }
        throw new Error("Fallo API 1");
      } catch (err1) {
        console.warn("⚠️ API 1 falló, intentando respaldo...", err1);

        try {
          const response2 = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-COP"
          );
          if (response2.ok) {
            const data = await response2.json();
            const rate = parseFloat(data.USDCOP.bid);
            if (rate) {
              console.log("✅ Tasa obtenida de AwesomeAPI (Backup):", rate);
              setExchangeRate(rate);
              setLoading(false);
              return;
            }
          }
        } catch (err2) {
          console.error(
            "Todas las APIs fallaron. Usando valor seguro:",
            4000
          );
          setLoading(false);
        }
      }
    };

    getRate();
  }, []);

  const formatPrice = (priceInCOP) => {
    if (currency === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(priceInCOP);
    }

    else {
      const priceInUSD = priceInCOP / exchangeRate;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(priceInUSD);
    }
  };

  const toggleCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        toggleCurrency,
        formatPrice,
        exchangeRate,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency debe usarse dentro de un CurrencyProvider");
  }
  return context;
};
