/**
 * Calculates key betting metrics from an array of bets
 * @param {Array} bets - Array of bet objects
 * @returns {Object} Object containing calculated metrics
 */
export const calculateMetrics = (bets) => {
  // Initialize metrics
  const metrics = {
    totalBets: bets.length,
    winCount: 0,
    lossCount: 0,
    pushCount: 0,
    pendingCount: 0,
    totalProfit: 0,
    totalWagered: 0,
    winRate: 0,
    roi: 0,
    avgOdds: 0,
    sharpeRatio: 0,
    kellyCriterion: 0,
    holdPercentage: 0
  };
  
  if (bets.length === 0) return metrics;
  
  // Arrays to store daily returns for Sharpe calculation
  const dailyReturns = [];
  const dailyDates = {};
  
  // Calculate base metrics
  let totalOdds = 0;
  
  bets.forEach(bet => {
    // Count outcomes
    if (bet.outcome === 'win') {
      metrics.winCount++;
      // Win profit is (odds * stake) - stake
      const profit = (bet.odds * bet.stake) - bet.stake;
      metrics.totalProfit += profit;
    } else if (bet.outcome === 'loss') {
      metrics.lossCount++;
      metrics.totalProfit -= bet.stake;
    } else if (bet.outcome === 'push') {
      metrics.pushCount++;
      // No profit change on push
    } else {
      metrics.pendingCount++;
      // Skip pending bets in profit calculations
      return;
    }
    
    // Track wagered amount (excluding pending)
    metrics.totalWagered += bet.stake;
    
    // Sum odds for average calculation (excluding pending)
    totalOdds += bet.odds;
    
    // Track daily returns for Sharpe calculation
    const date = new Date(bet.timestamp).toDateString();
    if (!dailyDates[date]) {
      dailyDates[date] = {
        profit: 0,
        wagered: 0
      };
    }
    
    if (bet.outcome === 'win') {
      dailyDates[date].profit += (bet.odds * bet.stake) - bet.stake;
    } else if (bet.outcome === 'loss') {
      dailyDates[date].profit -= bet.stake;
    }
    
    dailyDates[date].wagered += bet.stake;
  });
  
  // Convert daily dates to array of returns
  Object.keys(dailyDates).forEach(date => {
    const data = dailyDates[date];
    const returnRate = data.wagered > 0 ? data.profit / data.wagered : 0;
    dailyReturns.push(returnRate);
  });
  
  // Calculate derived metrics
  const completedBets = metrics.winCount + metrics.lossCount + metrics.pushCount;
  
  // Win rate (excluding pushes and pending)
  metrics.winRate = metrics.winCount / (metrics.winCount + metrics.lossCount) || 0;
  
  // ROI
  metrics.roi = metrics.totalProfit / metrics.totalWagered || 0;
  
  // Average odds (excluding pending)
  metrics.avgOdds = totalOdds / completedBets || 0;
  
  // Sharpe Ratio calculation
  if (dailyReturns.length > 1) {
    const avgReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
    
    // Standard deviation calculation
    const squaredDiffs = dailyReturns.map(ret => Math.pow(ret - avgReturn, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);
    
    // Sharpe ratio = average return / standard deviation
    metrics.sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
  }
  
  // Kelly Criterion
  // K = (bp - q) / b where:
  // b = the decimal odds - 1
  // p = probability of winning
  // q = probability of losing = 1 - p
  const b = metrics.avgOdds - 1;
  const p = metrics.winRate;
  const q = 1 - p;
  
  metrics.kellyCriterion = Math.max(0, (b * p - q) / b) || 0;
  
  // Hold percentage - what percentage of total wagered money you're keeping
  metrics.holdPercentage = metrics.totalProfit / metrics.totalWagered || 0;
  
  return metrics;
};

/**
 * Groups bets by a specific property
 * @param {Array} bets - Array of bet objects
 * @param {string} property - Property to group by
 * @returns {Object} Object with groups as keys and arrays of bets as values
 */
export const groupBetsBy = (bets, property) => {
  return bets.reduce((groups, bet) => {
    const key = bet[property] || 'unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(bet);
    return groups;
  }, {});
};

/**
 * Calculate win rate for a group of bets
 * @param {Array} bets - Array of bet objects
 * @returns {number} Win rate (0-1)
 */
export const calculateWinRate = (bets) => {
  const wins = bets.filter(bet => bet.outcome === 'win').length;
  const losses = bets.filter(bet => bet.outcome === 'loss').length;
  return wins / (wins + losses) || 0;
};

/**
 * Calculate ROI for a group of bets
 * @param {Array} bets - Array of bet objects
 * @returns {number} ROI (can be negative)
 */
export const calculateROI = (bets) => {
  let profit = 0;
  let wagered = 0;
  
  bets.forEach(bet => {
    if (bet.outcome === 'win') {
      profit += (bet.odds * bet.stake) - bet.stake;
    } else if (bet.outcome === 'loss') {
      profit -= bet.stake;
    }
    
    if (bet.outcome === 'win' || bet.outcome === 'loss') {
      wagered += bet.stake;
    }
  });
  
  return wagered > 0 ? profit / wagered : 0;
};

/**
 * Group bets by odds range
 * @param {Array} bets - Array of bet objects
 * @returns {Object} Object with odds ranges as keys and arrays of bets as values
 */
export const groupBetsByOddsRange = (bets) => {
  const ranges = {
    '1.01-1.50': [],
    '1.51-2.00': [],
    '2.01-3.00': [],
    '3.01-5.00': [],
    '5.01+': []
  };
  
  bets.forEach(bet => {
    if (bet.odds <= 1.5) {
      ranges['1.01-1.50'].push(bet);
    } else if (bet.odds <= 2) {
      ranges['1.51-2.00'].push(bet);
    } else if (bet.odds <= 3) {
      ranges['2.01-3.00'].push(bet);
    } else if (bet.odds <= 5) {
      ranges['3.01-5.00'].push(bet);
    } else {
      ranges['5.01+'].push(bet);
    }
  });
  
  return ranges;
};

/**
 * Calculate cumulative profit over time
 * @param {Array} bets - Array of bet objects 
 * @returns {Array} Array of {date, profit} objects for charting
 */
export const calculateCumulativeProfitOverTime = (bets) => {
  if (bets.length === 0) return [];
  
  // Sort bets by date
  const sortedBets = [...bets].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  let cumulativeProfit = 0;
  const profitOverTime = [];
  
  sortedBets.forEach(bet => {
    if (bet.outcome === 'win') {
      cumulativeProfit += (bet.odds * bet.stake) - bet.stake;
    } else if (bet.outcome === 'loss') {
      cumulativeProfit -= bet.stake;
    }
    // Pushes and pending don't affect profit
    
    profitOverTime.push({
      date: new Date(bet.timestamp),
      profit: cumulativeProfit
    });
  });
  
  return profitOverTime;
};

/**
 * Simulate bankroll growth with different staking methods
 * @param {Array} bets - Array of bet objects
 * @param {number} initialBankroll - Starting bankroll amount
 * @param {number} kellyFraction - Fraction of Kelly criterion to use (0-1)
 * @returns {Object} Simulation results for different staking methods
 */
export const simulateBankrollGrowth = (bets, initialBankroll = 1000, kellyFraction = 0.5) => {
  if (bets.length === 0) return {
    dates: [],
    flatStake: [],
    percentageStake: [],
    kellyStake: []
  };
  
  // Sort bets by date
  const sortedBets = [...bets].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const dates = [];
  const flatStake = [];
  const percentageStake = [];
  const kellyStake = [];
  
  // Initialize bankrolls
  let flatBankroll = initialBankroll;
  let percentageBankroll = initialBankroll;
  let kellyBankroll = initialBankroll;
  
  // Fixed parameters
  const flatBetAmount = initialBankroll * 0.02; // 2% of initial bankroll
  const percentageBetRatio = 0.02; // 2% of current bankroll
  
  // Kelly parameters
  let kellyWins = 0;
  let kellyLosses = 0;
  
  sortedBets.forEach((bet, index) => {
    dates.push(new Date(bet.timestamp));
    
    // Flat staking
    if (bet.outcome === 'win') {
      flatBankroll += (bet.odds * flatBetAmount) - flatBetAmount;
    } else if (bet.outcome === 'loss') {
      flatBankroll -= flatBetAmount;
    }
    flatStake.push(flatBankroll);
    
    // Percentage staking
    const percentageAmount = percentageBankroll * percentageBetRatio;
    if (bet.outcome === 'win') {
      percentageBankroll += (bet.odds * percentageAmount) - percentageAmount;
    } else if (bet.outcome === 'loss') {
      percentageBankroll -= percentageAmount;
    }
    percentageStake.push(percentageBankroll);
    
    // Kelly staking
    // Update win/loss count
    if (bet.outcome === 'win') {
      kellyWins++;
    } else if (bet.outcome === 'loss') {
      kellyLosses++;
    }
    
    // Calculate Kelly fraction if we have at least a few bets
    let kellyStakeAmount = kellyBankroll * 0.02; // Default to 2%
    
    if (index >= 5) { // Wait until we have some history
      const winRate = kellyWins / (kellyWins + kellyLosses);
      const avgOdds = sortedBets
        .slice(0, index)
        .filter(b => b.outcome === 'win' || b.outcome === 'loss')
        .reduce((sum, b) => sum + b.odds, 0) / (kellyWins + kellyLosses);
      
      // Kelly formula
      const b = avgOdds - 1;
      const p = winRate;
      const q = 1 - p;
      const kellyCriterion = Math.max(0, (b * p - q) / b) || 0;
      
      // Use a fraction of Kelly (usually 0.5 or less)
      kellyStakeAmount = kellyBankroll * kellyCriterion * kellyFraction;
      
      // Safety cap at 10% of bankroll
      kellyStakeAmount = Math.min(kellyStakeAmount, kellyBankroll * 0.1);
    }
    
    if (bet.outcome === 'win') {
      kellyBankroll += (bet.odds * kellyStakeAmount) - kellyStakeAmount;
    } else if (bet.outcome === 'loss') {
      kellyBankroll -= kellyStakeAmount;
    }
    kellyStake.push(kellyBankroll);
  });
  
  return {
    dates,
    flatStake,
    percentageStake,
    kellyStake
  };
}; 