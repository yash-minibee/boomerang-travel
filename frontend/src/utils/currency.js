/**
 * Utility functions for currency conversion and formatting.
 */

/**
 * Convert USD to AUD using a given exchange rate.
 * @param {number} usdAmount - The amount in USD.
 * @param {number} rate - The exchange rate (USD to AUD).
 * @returns {number} Converted amount in AUD.
 */
export function convertUSDToAUD(usdAmount, rate) {
  if (!usdAmount) return 0;
  return usdAmount * rate;
}

/**
 * Format a numeric amount as currency with the appropriate symbol.
 * @param {number} amount - The currency amount.
 * @param {string} currency - The active currency ('USD' or 'AUD').
 * @returns {string} Formatted currency string.
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  const rounded = Math.round(amount);
  if (currency === 'AUD') {
    return `A$${rounded.toLocaleString()}`;
  }
  return `$${rounded.toLocaleString()}`;
}
