// AI Service for BetAnalytix
// Provides betting insights analysis functionality

/**
 * Generate betting insights using local analytics
 * @param {Array} bets - Array of betting data
 * @returns {Promise} - Promise resolving to insights data
 */
const generateInsights = async (bets) => {
  try {
    // Simulate API delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Prepare betting data for analysis
    const bettingData = prepareBettingData(bets);
    
    // Generate insights based on betting patterns
    return generateLocalInsights(bettingData);
  } catch (error) {
    console.error('Error generating insights:', error);
    return getFallbackInsights(bets);
  }
};

/**
 * Prepare betting data in a format suitable for analysis
 * @param {Array} bets - Raw betting data
 * @returns {Object} - Processed data for analysis
 */
function prepareBettingData(bets) {
  // Filter completed bets
  const completedBets = bets.filter(bet => 
    bet.result === 'win' || bet.result === 'loss'
  );
  
  // Basic stats
  const totalBets = completedBets.length;
  const wins = completedBets.filter(bet => bet.result === 'win').length;
  const winRate = wins / totalBets;
  
  // Calculate ROI
  const totalStaked = completedBets.reduce((sum, bet) => sum + parseFloat(bet.stake || 0), 0);
  const totalReturns = completedBets.reduce((sum, bet) => {
    return sum + (bet.result === 'win' ? parseFloat(bet.profit || 0) : 0);
  }, 0);
  const profit = totalReturns - totalStaked;
  const roi = totalStaked > 0 ? profit / totalStaked : 0;
  
  // Group by categories
  const byCategory = {};
  ['sport', 'betType'].forEach(category => {
    byCategory[category] = {};
    completedBets.forEach(bet => {
      const value = bet[category] || 'Unknown';
      if (!byCategory[category][value]) {
        byCategory[category][value] = {
          count: 0,
          wins: 0,
          stakes: 0,
          returns: 0
        };
      }
      
      byCategory[category][value].count++;
      byCategory[category][value].wins += bet.result === 'win' ? 1 : 0;
      byCategory[category][value].stakes += parseFloat(bet.stake || 0);
      byCategory[category][value].returns += bet.result === 'win' ? 
        parseFloat(bet.profit || 0) : 0;
    });
  });
  
  return {
    totalBets,
    wins,
    winRate,
    totalStaked,
    totalReturns,
    profit,
    roi,
    byCategory
  };
}

/**
 * Generate insights based on local analytics
 * @param {Object} data - Processed betting data
 * @returns {Array} - Array of insights
 */
function generateLocalInsights(data) {
  const insights = [];
  
  // Don't generate insights if we don't have enough data
  if (data.totalBets < 5) {
    return getFallbackInsights({ length: 4 });
  }
  
  // Overall performance insight
  if (data.roi > 0.05) {
    insights.push({
      type: 'success',
      message: `Your overall ROI of ${(data.roi * 100).toFixed(1)}% is impressive. You're showing a solid profit.`,
      recommendation: 'Continue your current strategy but consider increasing stake sizes on your most confident bets.'
    });
  } else if (data.roi > 0) {
    insights.push({
      type: 'success',
      message: `You're showing a positive ROI of ${(data.roi * 100).toFixed(1)}%, which is better than most bettors.`,
      recommendation: 'Focus on the sports and bet types where you\'re showing the highest ROI to maximize profits.'
    });
  } else {
    insights.push({
      type: 'danger',
      message: `Your current ROI is ${(data.roi * 100).toFixed(1)}%. You're currently losing money on your bets.`,
      recommendation: 'Review your betting strategy and consider focusing on sports where you have more knowledge or success.'
    });
  }
  
  // Win rate insight
  if (data.winRate > 0.55) {
    insights.push({
      type: 'success',
      message: `Your win rate of ${(data.winRate * 100).toFixed(1)}% is excellent, indicating good bet selection.`,
      recommendation: 'You have a good eye for value. Look for higher odds opportunities where you still have an edge.'
    });
  } else if (data.winRate < 0.45) {
    insights.push({
      type: 'danger',
      message: `Your win rate of ${(data.winRate * 100).toFixed(1)}% is concerning. You're losing more bets than you're winning.`,
      recommendation: 'Be more selective with your bets and focus on quality over quantity.'
    });
  }
  
  // Sport-specific insights
  Object.entries(data.byCategory.sport || {}).forEach(([sport, stats]) => {
    const sportRoi = stats.stakes > 0 ? (stats.returns - stats.stakes) / stats.stakes : 0;
    const sportWinRate = stats.count > 0 ? stats.wins / stats.count : 0;
    
    if (stats.count >= 5) {
      if (sportRoi > 0.1) {
        insights.push({
          type: 'success',
          message: `You're performing exceptionally well in ${sport} with an ROI of ${(sportRoi * 100).toFixed(1)}%.`,
          recommendation: `Consider focusing more of your bankroll on ${sport} betting where you have a clear edge.`
        });
      } else if (sportRoi < -0.1 && stats.count >= 5) {
        insights.push({
          type: 'danger',
          message: `You're struggling with ${sport} bets, showing an ROI of ${(sportRoi * 100).toFixed(1)}%.`,
          recommendation: `Either reduce your exposure to ${sport} or reassess your handicapping approach for these games.`
        });
      }
    }
  });
  
  // Bet type insights
  Object.entries(data.byCategory.betType || {}).forEach(([betType, stats]) => {
    const typeRoi = stats.stakes > 0 ? (stats.returns - stats.stakes) / stats.stakes : 0;
    
    if (stats.count >= 5) {
      if (typeRoi > 0.1) {
        insights.push({
          type: 'success',
          message: `Your ${betType} bets are performing well with an ROI of ${(typeRoi * 100).toFixed(1)}%.`,
          recommendation: `Consider increasing your focus on ${betType} wagers where you're demonstrating skill.`
        });
      } else if (typeRoi < -0.1) {
        insights.push({
          type: 'danger',
          message: `Your ${betType} bets are underperforming with an ROI of ${(typeRoi * 100).toFixed(1)}%.`,
          recommendation: `Reconsider your approach to ${betType} bets or reduce your exposure in this area.`
        });
      }
    }
  });
  
  // General advice insight
  insights.push({
    type: 'info',
    message: 'Consistent record-keeping is the foundation of betting success.',
    recommendation: 'Continue tracking all your bets and review your performance regularly to identify patterns.'
  });
  
  // Bankroll management insight
  insights.push({
    type: 'info',
    message: 'Proper bankroll management is crucial for long-term betting success.',
    recommendation: 'Consider using the Kelly Criterion calculator to optimize your bet sizing based on your edge.'
  });
  
  return insights;
}

/**
 * Get fallback insights if analysis fails
 * @param {Array} bets - Betting data
 * @returns {Array} - Basic fallback insights
 */
function getFallbackInsights(bets) {
  if (!bets || bets.length < 5) {
    return [
      {
        type: 'info',
        message: 'Log at least 5 bets to receive AI-powered insights.',
        recommendation: 'Continue tracking your bets to unlock personalized recommendations.'
      }
    ];
  }
  
  return [
    {
      type: 'info',
      message: 'Analysis is currently showing basic insights only.',
      recommendation: 'Refresh to see if more detailed insights become available.'
    },
    {
      type: 'success',
      message: 'Diversifying your betting portfolio can help reduce variance.',
      recommendation: 'Try to maintain a mix of different sports and bet types.'
    },
    {
      type: 'info',
      message: 'Consider tracking more detailed information about your bets.',
      recommendation: 'Note factors like home/away teams, weather conditions, and your reasoning for each bet.'
    }
  ];
}

// Export the service as a default object
export default {
  generateInsights
}; 