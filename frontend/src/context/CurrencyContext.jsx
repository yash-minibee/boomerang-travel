import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";
import { convertUSDToAUD, formatCurrency } from "../utils/currency";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("currency") || "USD";
  });
  const [exchangeRate, setExchangeRate] = useState(1.50); // Default fallback rate

  useEffect(() => {
    api.getCurrencyRate()
      .then(res => {
        if (res && res.success && res.data && res.data.rate) {
          setExchangeRate(Number(res.data.rate));
        }
      })
      .catch(err => {
        console.warn("Failed to fetch exchange rate, using fallback rate of 1.50:", err);
      });
  }, []);

  const setCurrency = (newCurrency) => {
    if (newCurrency === "USD" || newCurrency === "AUD") {
      setCurrencyState(newCurrency);
      localStorage.setItem("currency", newCurrency);
    }
  };

  /**
   * Formats a price based on the currently selected currency.
   * If currency is AUD, it will use the pre-calculated audAmount if provided,
   * otherwise it will dynamically convert the usdAmount using the fetched exchange rate.
   *
   * @param {number} usdAmount - The base price in USD.
   * @param {number|null} [audAmount=null] - Optional pre-converted price in AUD.
   * @returns {string} Formatted currency string.
   */
  const formatPrice = (usdAmount, audAmount = null) => {
    if (currency === "AUD") {
      const amount = audAmount !== null && audAmount !== undefined
        ? Number(audAmount)
        : convertUSDToAUD(Number(usdAmount), exchangeRate);
      return formatCurrency(amount, "AUD");
    }
    return formatCurrency(Number(usdAmount), "USD");
  };

  /**
   * Helper to convert a USD value to the active currency as a raw number.
   * Useful for filters and sliders.
   *
   * @param {number} usdAmount - The amount in USD.
   * @returns {number} The amount in the active currency.
   */
  const convertUSD = (usdAmount) => {
    if (currency === "AUD") {
      return convertUSDToAUD(usdAmount, exchangeRate);
    }
    return usdAmount;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        convertUSD
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
