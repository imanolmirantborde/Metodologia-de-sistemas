/**
 * Math Utilities
 * Helper functions for mathematical operations
 */

import { PRECISION } from '../constants/gameConstants';

/**
 * Rounds a number to a specified number of decimal places
 * @param {number} value - The number to round
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {number} Rounded number
 */
export const roundToDecimal = (value, decimalPlaces = PRECISION.DECIMAL_PLACES) => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Calculates the percentage of a value relative to a maximum
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (current, max) => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

/**
 * Calculates the full cost to refill stock to maximum
 * @param {number} currentStock - Current stock amount
 * @param {number} maxStock - Maximum stock capacity
 * @param {number} pricePerUnit - Price per stock unit
 * @returns {number} Total cost to fill stock
 */
export const calculateFullStockCost = (currentStock, maxStock, pricePerUnit) => {
  return roundToDecimal((maxStock - currentStock) * pricePerUnit);
};

/**
 * Checks if adding a value will exceed the maximum
 * @param {number} current - Current value
 * @param {number} toAdd - Value to add
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (current, toAdd, max) => {
  return (current + toAdd) < max;
};
