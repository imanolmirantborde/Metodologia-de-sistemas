import Game from '../components/Game/game';
import { canPlayCasino, getRandomInt } from '../utils/casinoUtils';
import { notify } from '../components/Alerts/toast';
import { MESSAGES } from '../constants/gameConstants';
jest.mock('../utils/casinoUtils', () => ({
  canPlayCasino: jest.fn(),
  getRandomInt: jest.fn(),
  isWinningRoll: jest.fn(),
  calculateWinnings: jest.fn(),
}));

jest.mock('../components/Alerts/toast', () => ({
  notify: jest.fn(),
  green_notify: jest.fn(),
}));



describe('Game component - Casino behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('StartCasino should notify when canPlayCasino returns false', () => {
    canPlayCasino.mockReturnValue(false);
    const g = new Game({});
    g.state = { ...g.state, click: 0, casino_stake: 5, casino_multiplier: 0 };

    g.StartCasino();

    expect(canPlayCasino).toHaveBeenCalledWith(0, 5, 0);
    expect(notify).toHaveBeenCalledWith(MESSAGES.ERRORS.CASINO_CHECK_STAKE);
  });

  test('StartCasino deducts stake, calls processCasinoResult and resets values when canPlayCasino returns true', () => {
    canPlayCasino.mockReturnValue(true);
    getRandomInt.mockReturnValue(42);

    const g = new Game({});
    g.state = { ...g.state, click: 100, casino_stake: 10, casino_multiplier: 2 };

    g.ChangePoints = jest.fn();
    g.processCasinoResult = jest.fn();
    g.resetCasinoValues = jest.fn();

    g.StartCasino();

    expect(g.ChangePoints).toHaveBeenCalledWith(10);
    expect(getRandomInt).toHaveBeenCalledWith(0, 100);
    expect(g.processCasinoResult).toHaveBeenCalledWith(2, 10, 42);
    expect(g.resetCasinoValues).toHaveBeenCalled();
  });
});