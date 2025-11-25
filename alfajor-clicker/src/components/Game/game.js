import React, { Component } from "react";
import DisplayBoard from "../GameElements/displayClicks";
import Upgrade from "../GameElements/Upgrade_frame";
import { notify, green_notify } from "../Alerts/toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import images from "../Images";
import './game.css';
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "../StockBar/StockProgressBar";
import Stockstation from "../ModalComponents/StockStation";
import Custom from "../ModalComponents/Custom";
import Casino from "../ModalComponents/Casino";
import {
  INITIAL_GAME_STATE,
  LEVEL_SYSTEM,
  CASINO as CASINO_CONFIG,
  UPGRADES,
  STOCK_CAPACITY,
  RESTOCK_AMOUNTS,
  PRESTIGE_RESET,
  MESSAGES,
} from "../../constants/gameConstants";
import {
  getRandomInt,
  isWinningRoll,
  calculateWinnings,
  canPlayCasino,
} from "../../utils/casinoUtils";
import {
  roundToDecimal,
  calculatePercentage,
  calculateFullStockCost,
  isWithinBounds,
} from "../../utils/mathUtils";





 class Game extends Component {
    constructor(props)
    {
        super(props);
     

        this.state = {
            click: INITIAL_GAME_STATE.CLICKS,
            Demand: INITIAL_GAME_STATE.DEMAND,
            level: INITIAL_GAME_STATE.LEVEL,
            Stock: INITIAL_GAME_STATE.STOCK,
            StockMax: INITIAL_GAME_STATE.STOCK_MAX,
            capacityPrice: INITIAL_GAME_STATE.CAPACITY_PRICE,
            Stock_usage: INITIAL_GAME_STATE.STOCK_USAGE,
            Stock_price: INITIAL_GAME_STATE.STOCK_PRICE,
            xp: INITIAL_GAME_STATE.XP,
            xp_to_nxt: INITIAL_GAME_STATE.XP_TO_NEXT,

            item_price: UPGRADES.PRICES,
            item_name: UPGRADES.NAMES,
            item_amount: Array(UPGRADES.TOTAL_UPGRADES).fill(0),
            item_Demand: UPGRADES.DEMANDS,
            item_fusage: UPGRADES.FUEL_USAGE,
            item_minStock: UPGRADES.MIN_STOCK,

            casino_multiplier: 0,
            casino_stake: CASINO_CONFIG.MIN_STAKE,
        };
        // Binding methods to this context
        this.AddPoints = this.AddPoints.bind(this);
        this.ChangePoints = this.ChangePoints.bind(this);
        this.BuyUpgrade = this.BuyUpgrade.bind(this);
        this.lvlSystem = this.lvlSystem.bind(this);
        this.SubstractStock = this.SubstractStock.bind(this);
        this.reStock = this.reStock.bind(this);
        this.BuyCapacity = this.BuyCapacity.bind(this);
        this.SetCasinoMuliplier = this.SetCasinoMuliplier.bind(this);
        this.AddCasinoStake = this.AddCasinoStake.bind(this);
        this.SubstractStake = this.SubstractStake.bind(this);
        this.StartCasino = this.StartCasino.bind(this);
        this.processCasinoResult = this.processCasinoResult.bind(this);
        this.resetCasinoValues = this.resetCasinoValues.bind(this);
        

       
        
    }

    /**
     * Initiates a casino game round
     */
    StartCasino()
    {
        const { click, casino_stake, casino_multiplier } = this.state;

        if (!canPlayCasino(click, casino_stake, casino_multiplier)) {
            notify(MESSAGES.ERRORS.CASINO_CHECK_STAKE);
            return;
        }

        // Deduct the stake
        this.ChangePoints(casino_stake);

        // Generate random number and process result
        const randomNumber = getRandomInt(0, 100);
        this.processCasinoResult(casino_multiplier, casino_stake, randomNumber);

        // Reset casino values
        this.resetCasinoValues();
    }

    /**
     * Processes the casino result and updates player's clicks
     * @param {number} multiplier - Selected multiplier
     * @param {number} stake - Bet amount
     * @param {number} randomNumber - Random roll result
     */
    processCasinoResult(multiplier, stake, randomNumber)
    {
        const winnings = calculateWinnings(multiplier, stake);

        if (isWinningRoll(multiplier, randomNumber)) {
            this.ChangePoints(-winnings); // Negative to add back winnings
            notify(MESSAGES.SUCCESS.CASINO_WIN(winnings));
        } else {
            notify(MESSAGES.SUCCESS.CASINO_LOSE);
        }
    }

    /**
     * Resets casino values to default
     */
    resetCasinoValues()
    {
        this.setState({
            casino_stake: CASINO_CONFIG.MIN_STAKE,
            casino_multiplier: 0
        });
    }

    /**
     * Decreases casino stake by increment amount
     */
    SubstractStake()
    {
        if (this.state.casino_stake > CASINO_CONFIG.MIN_STAKE) {
            this.setState((prevState) => ({
                casino_stake: prevState.casino_stake - CASINO_CONFIG.STAKE_INCREMENT
            }));
        } else {
            notify(MESSAGES.ERRORS.MIN_STAKE);
        }
    }

    /**
     * Increases casino stake by increment amount
     */
    AddCasinoStake()
    {
        this.setState((prevState) => ({
            casino_stake: prevState.casino_stake + CASINO_CONFIG.STAKE_INCREMENT
        }));
    }

    /**
     * Sets the casino multiplier
     * @param {number} multiplier - The multiplier value (1.25, 1.50, or 2.00)
     */
    SetCasinoMuliplier(multiplier)
    {
        this.setState({
            casino_multiplier: multiplier
        });
    }

    /**
     * Purchases additional stock capacity
     * @param {number} capacityAmount - Amount of capacity to purchase
     */
    BuyCapacity(capacityAmount)
    {
        const totalCost = this.state.capacityPrice * capacityAmount;

        if (totalCost < this.state.click) {
            this.setState((prevState) => ({
                StockMax: prevState.StockMax + capacityAmount,
                click: prevState.click - totalCost
            }));
        } else {
            notify(MESSAGES.ERRORS.CANT_BUY_CAPACITY);
        }
    }
    /**
     * Restocks the player's stock by a specified amount or to maximum
     * @param {number|string} restockAmount - Amount to restock or "MAX" for full restock
     */
    reStock(restockAmount)
    {
        const { Stock, StockMax, Stock_price, click } = this.state;
        const fullStockCost = calculateFullStockCost(Stock, StockMax, Stock_price);

        // Handle MAX restock
        if (restockAmount === RESTOCK_AMOUNTS.MAX) {
            if (fullStockCost <= click) {
                this.setState((prevState) => ({
                    click: prevState.click - fullStockCost,
                    Stock: StockMax
                }));
            }
            return;
        }

        // Handle specific amount restock
        const restockCost = Stock_price * restockAmount;
        const canAfford = click > restockCost;
        const withinCapacity = isWithinBounds(Stock, restockAmount, StockMax);
        const hasSpace = StockMax > Stock;

        if (hasSpace && canAfford && withinCapacity) {
            this.setState((prevState) => ({
                click: prevState.click - restockCost,
                Stock: prevState.Stock + restockAmount
            }));
        } else {
            notify(MESSAGES.ERRORS.CANT_BUY_STOCK);
        }
    }

    /**
     * Decreases stock by usage amount
     */
    SubstractStock()
    {
        this.setState((prevState) => ({
            Stock: prevState.Stock - this.state.Stock_usage
        }));
    }

    /**
     * Handles the level up system and progression
     */
    async lvlSystem()
    {
        if (this.state.xp >= this.state.xp_to_nxt) {
            this.setState((prevState) => ({
                xp: 0,
                level: prevState.level + 1,
                xp_to_nxt: prevState.xp_to_nxt + LEVEL_SYSTEM.XP_INCREMENT_PER_LEVEL,
                Stock_price: prevState.Stock_price + LEVEL_SYSTEM.STOCK_PRICE_INCREMENT,
                capacityPrice: LEVEL_SYSTEM.CAPACITY_PRICE_MULTIPLIER * this.state.Stock_price
            }));

            const newLevel = this.state.level + 1;
            green_notify(MESSAGES.SUCCESS.LEVEL_UP(newLevel));
        }
    }

    /**
     * Changes (subtracts) points by a given value
     * @param {number} amount - Amount to subtract from clicks
     */
    ChangePoints(amount)
    {
        this.setState((prevState) => ({
            click: prevState.click - amount
        }));
    }

    /**
     * Handles player clicking to earn points
     */
    AddPoints()
    {
        const remainingStock = this.state.Stock - this.state.Stock_usage;

        if (remainingStock > 0) {
            this.lvlSystem();
            this.SubstractStock();
            this.setState((prevState) => ({
                click: prevState.click + this.state.Demand,
                xp: prevState.xp + LEVEL_SYSTEM.XP_PER_CLICK
            }));
        } else {
            notify(MESSAGES.ERRORS.NO_STOCK);
        }
    }

    /**
     * Purchases an upgrade for the player
     * @param {number} upgradeIndex - Index of the upgrade to purchase
     */
    BuyUpgrade(upgradeIndex)
    {
        const { StockMax, click, item_price, item_Demand, item_fusage, item_minStock, item_amount } = this.state;
        const price = item_price[upgradeIndex];
        const demandIncrease = item_Demand[upgradeIndex];
        const fuelUsageIncrease = item_fusage[upgradeIndex];
        const minimumStockRequired = item_minStock[upgradeIndex];

        // Validate purchase conditions
        const canAfford = click >= price;
        const hasRequiredCapacity = minimumStockRequired <= StockMax;

        if (!canAfford || !hasRequiredCapacity) {
            notify(MESSAGES.ERRORS.CANT_BUY_ITEM);
            return;
        }

        // Handle prestige upgrade (index 8)
        if (upgradeIndex >= UPGRADES.PRESTIGE_INDEX) {
            this.setState(PRESTIGE_RESET);
            return;
        }

        // Handle normal upgrade
        const updatedAmounts = item_amount.slice();
        updatedAmounts[upgradeIndex] += 1;

        this.setState((prevState) => ({
            click: prevState.click - price,
            Demand: prevState.Demand + demandIncrease,
            Stock_usage: roundToDecimal(prevState.Stock_usage + fuelUsageIncrease),
            item_amount: updatedAmounts
        }));
    }




    render()
    {
        const { click, Stock, StockMax, Stock_price, capacityPrice, level, Demand, xp, xp_to_nxt } = this.state;
        const { casino_multiplier, casino_stake } = this.state;
        const { item_name, item_price, item_amount, item_Demand, item_minStock, item_fusage } = this.state;

        // Calculate display values
        const displayClicks = roundToDecimal(click);
        const stockPercentage = calculatePercentage(Stock, StockMax);

        return (
            <>
                <div className="fullscreen">
                    <center>
                        <DisplayBoard
                            avatar={images.avatar1}
                            clicks={displayClicks}
                            event={this.AddPoints}
                            Demand={Demand}
                            lvl={level}
                            xp={xp}
                            xp2={xp_to_nxt}
                        />
                        <br/>

                        <Container>
                            <Row>
                                <Col>
                                    <Stockstation
                                        Btn1={() => this.reStock(RESTOCK_AMOUNTS.SMALL)}
                                        Btn2={() => this.reStock(RESTOCK_AMOUNTS.MEDIUM)}
                                        Btn3={() => this.reStock(RESTOCK_AMOUNTS.MAX)}
                                        price={Stock_price}
                                        tanklevel={stockPercentage}
                                    />
                                </Col>
                                <Col>
                                    <Custom
                                        price={capacityPrice}
                                        btn1={() => this.BuyCapacity(STOCK_CAPACITY.SMALL)}
                                        btn2={() => this.BuyCapacity(STOCK_CAPACITY.MEDIUM)}
                                        btn3={() => this.BuyCapacity(STOCK_CAPACITY.LARGE)}
                                    />
                                </Col>
                                <Col>
                                    <Casino
                                        lvl={level}
                                        multiplier={casino_multiplier}
                                        mltp1={() => this.SetCasinoMuliplier(CASINO_CONFIG.MULTIPLIERS.LOW)}
                                        mltp2={() => this.SetCasinoMuliplier(CASINO_CONFIG.MULTIPLIERS.MEDIUM)}
                                        mltp3={() => this.SetCasinoMuliplier(CASINO_CONFIG.MULTIPLIERS.HIGH)}
                                        addStake={this.AddCasinoStake}
                                        subStake={this.SubstractStake}
                                        stake={casino_stake}
                                        play={this.StartCasino}
                                    />
                                </Col>
                            </Row>
                        </Container>

                        <br/>

                        <Container>
                            <Row>
                                <Col>
                                    <Upgrade
                                        name={item_name[0]}
                                        cost={item_price[0]}
                                        amount={item_amount[0]}
                                        buy={() => this.BuyUpgrade(0)}
                                        bg={images.upgrade1}
                                        pwr={item_Demand[0]}
                                        click={click}
                                        minStock={item_minStock[0]}
                                        StockUsage={item_fusage[0]}
                                        fmax={StockMax}
                                    />
                                </Col>
                                <Col>
                                    <Upgrade
                                        name={item_name[1]}
                                        cost={item_price[1]}
                                        amount={item_amount[1]}
                                        buy={() => this.BuyUpgrade(1)}
                                        bg={images.upgrade2}
                                        pwr={item_Demand[1]}
                                        click={click}
                                        minStock={item_minStock[1]}
                                        StockUsage={item_fusage[1]}
                                        fmax={StockMax}
                                    />
                                </Col>
                                <Col>
                                    <Upgrade
                                        name={item_name[2]}
                                        cost={item_price[2]}
                                        amount={item_amount[2]}
                                        buy={() => this.BuyUpgrade(2)}
                                        bg={images.upgrade3}
                                        pwr={item_Demand[2]}
                                        click={click}
                                        minStock={item_minStock[2]}
                                        StockUsage={item_fusage[2]}
                                        fmax={StockMax}
                                    />
                                </Col>
                            </Row>
                        </Container>

                        <br/>
                        <ProgressBar
                            completed={calculatePercentage(Stock, StockMax)}
                            StockMax={StockMax}
                            StockUsage={this.state.Stock_usage}
                        />
                    </center>
                </div>
            </>
        );
    }
}

export default Game;