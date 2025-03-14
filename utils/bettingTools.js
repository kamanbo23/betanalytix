// Betting tools and calculators

// Calculate Kelly criterion
export function calculateKelly(odds, probability, bankroll = 1000) {
  // Convert American odds to decimal
  const decimalOdds = americanToDecimal(odds);
  
  // Convert probability from percentage to decimal
  const probDecimal = probability / 100;
  
  // Kelly formula: (bp - q) / b
  // where b = decimal odds - 1, p = probability of winning, q = probability of losing
  const b = decimalOdds - 1;
  const q = 1 - probDecimal;
  
  const kellyPercentage = (b * probDecimal - q) / b;
  
  // Kelly can recommend betting nothing or a negative amount
  const cappedKelly = Math.max(0, kellyPercentage);
  
  // Calculate actual bet amounts
  const fullKelly = cappedKelly * bankroll;
  const halfKelly = fullKelly / 2;
  const quarterKelly = fullKelly / 4;
  
  return {
    fullKelly,
    halfKelly,
    quarterKelly,
    kellyPercentage: cappedKelly * 100
  };
}

// Calculate hedging bet
export function calculateHedge(originalStake, originalOdds, hedge 