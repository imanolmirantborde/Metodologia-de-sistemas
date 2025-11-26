import Game from '../components/Game/game';
import { notify, green_notify } from '../components/Alerts/toast';
import { MESSAGES } from '../constants/gameConstants';

jest.mock('../components/Alerts/toast', () => ({
    notify: jest.fn(),
    green_notify: jest.fn(),
}));

describe('Game - Botón Vender', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Venta normal: resta stock y suma dinero', () => {
        const g = new Game({});
        g.state = { Stock: 100, Stock_usage: 0.6, Demand: 2, click: 105, xp: 0, xp_to_nxt: 50, level: 1 };

        // Mock setState para que modifique state directamente
        g.setState = (updater) => {
            const updates = typeof updater === 'function' ? updater(g.state) : updater;
            g.state = { ...g.state, ...updates };
        };
        g.lvlSystem = jest.fn();

        g.AddPoints();

        expect(g.state.Stock).toBeCloseTo(99.4, 1);
        expect(g.state.click).toBe(107);
        expect(notify).not.toHaveBeenCalled();
    });

    test('Sin stock: muestra error', () => {
        const g = new Game({});
        g.state = { Stock: 0.5, Stock_usage: 0.6, click: 105 };

        g.setState = (updater) => {
            const updates = typeof updater === 'function' ? updater(g.state) : updater;
            g.state = { ...g.state, ...updates };
        };

        g.AddPoints();

        expect(g.state.click).toBe(105);
        expect(notify).toHaveBeenCalledWith(MESSAGES.ERRORS.NO_STOCK);
    });

    test('BUG: Stock = usage no vende (cambiar > por >=)', () => {
        const g = new Game({});
        g.state = { Stock: 0.6, Stock_usage: 0.6, Demand: 2, click: 105 };

        g.setState = (updater) => {
            const updates = typeof updater === 'function' ? updater(g.state) : updater;
            g.state = { ...g.state, ...updates };
        };

        g.AddPoints();

        expect(g.state.click).toBe(105);
        expect(notify).toHaveBeenCalled();
    });

    test('10 ventas rápidas: acumula bien', () => {
        const g = new Game({});
        g.state = { Stock: 100, Stock_usage: 0.6, Demand: 2, click: 100, xp: 0, xp_to_nxt: 50, level: 1 };

        g.setState = (updater) => {
            const updates = typeof updater === 'function' ? updater(g.state) : updater;
            g.state = { ...g.state, ...updates };
        };
        g.lvlSystem = jest.fn();

        for (let i = 0; i < 10; i++) g.AddPoints();

        expect(g.state.Stock).toBeCloseTo(94, 1);
        expect(g.state.click).toBe(120);
    });

    test('Demand variable: suma correctamente', () => {
        [1, 5, 12].forEach(demand => {
            const g = new Game({});
            g.state = { Stock: 100, Stock_usage: 0.6, Demand: demand, click: 100, xp: 0, xp_to_nxt: 50, level: 1 };

            g.setState = (updater) => {
                const updates = typeof updater === 'function' ? updater(g.state) : updater;
                g.state = { ...g.state, ...updates };
            };
            g.lvlSystem = jest.fn();

            g.AddPoints();

            expect(g.state.click).toBe(100 + demand);
        });
    });

    test('Subida de nivel: debe aumentar nivel cuando alcanza XP necesario', () => {
        const g = new Game({});
        g.state = { Stock: 100, Stock_usage: 0.6, Demand: 2, click: 100, xp: 48, xp_to_nxt: 50, level: 1, Stock_price: 1, capacityPrice: 10 };

        g.setState = (updater) => {
            const updates = typeof updater === 'function' ? updater(g.state) : updater;
            g.state = { ...g.state, ...updates };
        };

        g.AddPoints();
        g.lvlSystem();

        expect(g.state.level).toBe(2);
        expect(g.state.xp).toBe(0);
        expect(green_notify).toHaveBeenCalled();
    });
});