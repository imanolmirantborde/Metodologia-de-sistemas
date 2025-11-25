/**
 * Game Constants
 * Centralized configuration for game mechanics and balance
 */

// Initial Game State
export const INITIAL_GAME_STATE = {
  CLICKS: 0,
  DEMAND: 1,
  LEVEL: 1,
  STOCK: 100,
  STOCK_MAX: 100,
  STOCK_USAGE: 0.6,
  STOCK_PRICE: 1,
  XP: 0,
  XP_TO_NEXT: 50,
  CAPACITY_PRICE: 10,
};

// Level System
export const LEVEL_SYSTEM = {
  XP_PER_CLICK: 2,
  XP_INCREMENT_PER_LEVEL: 100,
  STOCK_PRICE_INCREMENT: 0.5,
  CAPACITY_PRICE_MULTIPLIER: 10,
};

// Casino Configuration
export const CASINO = {
  MIN_LEVEL: 10,
  MIN_STAKE: 500,
  STAKE_INCREMENT: 500,

  MULTIPLIERS: {
    LOW: 1.25,
    MEDIUM: 1.50,
    HIGH: 2.00,
  },

  WIN_PROBABILITIES: {
    LOW: 33,    // 33% chance
    MEDIUM: 20, // 20% chance
    HIGH: 10,   // 10% chance
  },
};

// Upgrade System
export const UPGRADES = {
  PRICES: [100, 300, 600, 800, 950, 1900, 2800, 5000, 10000000],
  NAMES: ["Tapita", "Dulce de leche", "Coco rallado"],
  DEMANDS: [1, 3, 5, 7, 12, 14, 21, 49, '100k'],
  FUEL_USAGE: [0.1, 0.2, 0.3, 0.5, 1, 1.2, 2, 4, 0],
  MIN_STOCK: [50, 100, 150, 300, 450, 600, 1800, 2500, 5000],
  PRESTIGE_INDEX: 8,
  TOTAL_UPGRADES: 9,
};

// Stock Capacity Increments
export const STOCK_CAPACITY = {
  SMALL: 50,
  MEDIUM: 100,
  LARGE: 500,
};

// Stock Restock Amounts
export const RESTOCK_AMOUNTS = {
  SMALL: 1,
  MEDIUM: 10,
  MAX: "MAX",
};

// Prestige Reset Values
export const PRESTIGE_RESET = {
  CLICKS: 0,
  DEMAND: 1,
  LEVEL: 1,
  STOCK: 80,
  STOCK_MAX: 100,
  CAPACITY_PRICE: 10,
  STOCK_USAGE: 1,
  STOCK_PRICE: 2,
  XP: 0,
  ITEM_AMOUNTS: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// Math precision
export const PRECISION = {
  DECIMAL_PLACES: 2,
  ROUNDING_MULTIPLIER: 100,
};

// UI Messages
export const MESSAGES = {
  ERRORS: {
    CANT_BUY_ITEM: "💸 You can't buy this item",
    CANT_BUY_STOCK: "You can't buy more Stock....",
    CANT_BUY_CAPACITY: "You can't buy it",
    NO_STOCK: "You don't have Stock!",
    CASINO_LEVEL_REQUIRED: "You must have 10 lvl!",
    CASINO_CHECK_STAKE: "You can't play... Check stake or select multiplier",
    MIN_STAKE: "Minimum stake-value is 500!",
  },

  SUCCESS: {
    LEVEL_UP: (level) => `You have reached the level ${level}!`,
    CASINO_WIN: (amount) => `You win. Your award: ${amount}`,
    CASINO_LOSE: "You lose... Try again :-D",
  },
};
