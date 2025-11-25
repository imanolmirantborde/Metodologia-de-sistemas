import React, { useState, useEffect, useMemo } from "react";
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './gameElements.css';
import { UPGRADES } from "../../constants/gameConstants";

/**
 * Upgrade component - displays an upgrade card with purchase button
 * @param {object} props - Component props
 * @param {string} props.name - Upgrade name
 * @param {number} props.cost - Upgrade cost
 * @param {number} props.amount - Number owned
 * @param {function} props.buy - Purchase callback
 * @param {string} props.bg - Background image
 * @param {number} props.pwr - Power/Demand value
 * @param {number} props.click - Current clicks
 * @param {number} props.minStock - Minimum stock required
 * @param {number} props.StockUsage - Stock usage value
 * @param {number} props.fmax - Maximum stock capacity
 */
function Upgrade(props)
{
  const { click, cost, minStock, fmax } = props;

  // Calculate purchase availability
  const canAfford = click >= cost;
  const meetsStockRequirement = minStock <= fmax;
  const canPurchase = canAfford && meetsStockRequirement;

  // Determine button class and text based on purchase availability
  const buttonClass = useMemo(() => {
    if (canPurchase) return 'btn btn-success';
    return 'btn btn-danger';
  }, [canPurchase]);

  const buttonText = useMemo(() => {
    if (canPurchase) return 'BUY';
    return '\u00A0 🔒 \u00A0';
  }, [canPurchase]);

  // Determine cost text color
  const costTextColor = canAfford ? 'txtGreen' : 'txtRed';

  // Determine stock requirement text color
  const stockTextColor = meetsStockRequirement ? 'txtGreen' : 'txtRed';

  // Format cost display
  const displayCost = useMemo(() => {
    if (cost >= UPGRADES.PRICES[UPGRADES.PRESTIGE_INDEX]) {
      return '10mln';
    }
    return cost;
  }, [cost]);


  return (
    <div>
      <Card style={{ width: '16rem', height: 'auto', background: '#121212', color: 'white' }}>
        <Card.Img variant="top" src={props.bg} alt={props.name} />
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>

          <div className="CardGrid">
            <div>
              <b>Cantidad:</b> {props.amount} <br/>
              <b>Coste:</b> <span className={costTextColor}> {displayCost} <br/> </span>
              <b>Demanda:</b> {props.pwr}
            </div>
            <div>
              <b>Stock usage: </b> {props.StockUsage} <br/>
              <b>Min capacity: </b> <span className={stockTextColor}> {props.minStock} </span>
            </div>
          </div>

          <button className={buttonClass} onClick={props.buy}>
            {buttonText}
          </button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Upgrade;