/**
 * Casino Utilities
 * Helper functions for casino game logic
 */

import { CASINO } from '../constants/gameConstants';

/**
 * Generates a random integer between min (inclusive) and max (exclusive)
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
};

/**
 * Determines if the player wins based on multiplier and random number
 * @param {number} multiplier - The selected multiplier
 * @param {number} randomNumber - Random number between 0-100
 * @returns {boolean} True if player wins
 */
export const isWinningRoll = (multiplier, randomNumber) => {
  const { MULTIPLIERS, WIN_PROBABILITIES } = CASINO;

  switch (multiplier) {
    case MULTIPLIERS.LOW:
      return randomNumber <= WIN_PROBABILITIES.LOW;
    case MULTIPLIERS.MEDIUM:
      return randomNumber <= WIN_PROBABILITIES.MEDIUM;
    case MULTIPLIERS.HIGH:
      return randomNumber <= WIN_PROBABILITIES.HIGH;
    default:
      return false;
  }
};

/**
 * Calculates the casino winnings
 * @param {number} multiplier - The selected multiplier
 * @param {number} stake - The bet amount
 * @returns {number} The winning amount
 */
export const calculateWinnings = (multiplier, stake) => {
  return multiplier * stake;
};

/**
 * Validates if the casino play is possible
 * @param {number} currentClicks - Player's current clicks
 * @param {number} stake - The bet amount
 * @param {number} multiplier - The selected multiplier
 * @returns {boolean} True if play is valid
 */
export const canPlayCasino = (currentClicks, stake, multiplier) => {
  return multiplier !== 0 && (currentClicks - stake) > 0;
};

/**
 * Validates if player has reached the required level for casino
 * @param {number} level - Player's current level
 * @returns {boolean} True if casino is unlocked
 */
export const isCasinoUnlocked = (level) => {
  return level >= CASINO.MIN_LEVEL;
};
