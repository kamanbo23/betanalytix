// API services for fetching data

// Fetch betting data
export async function fetchBettingData() {
  try {
    // Uncomment and adapt when your API is ready
    // const response = await fetch('https://your-api.com/betting-data');
    // if (!response.ok) throw new Error('Failed to fetch betting data');
    // return await response.json();
    
    // Mock data for testing
    return mockBettingData();
  } catch (error) {
    console.error('Error fetching betting data:', error);
    throw error;
  }
}

// Fetch user statistics
export async function fetchUserStats() {
  try {
    // Uncomment and adapt when your API is ready
    // const response = await fetch('https://your-api.com/user-stats');
    // if (!response.ok) throw new Error('Failed to fetch user stats');
    // return await response.json();
    
    // Mock data for testing
    return mockUserStats();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

// Mock data for development
function mockBettingData() {
  return {
    bets: Array(20).fill().map((_, i) => ({
      id: i + 1,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      event: `Event ${i + 1}`,
      betType: ['Moneyline', 'Spread', 'Over/Under'][i % 3],
      stake: 100 + (i * 10),
      odds: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 400 + 100),
      result: ['win', 'loss', 'push'][i % 3],
      profit: ['win', 'push'].includes(['win', 'loss', 'push'][i % 3]) 
        ? Math.floor(Math.random() * 200) 
        : -Math.floor(Math.random() * 100)
    })),
    chartData: {
      profitLoss: {
        labels: Array(30).fill().map((_, i) => new Date(Date.now() - i * 86400000).toISOString().split('T')[0]).reverse(),
        data: Array(30).fill().map(() => Math.floor(Math.random() * 400 - 200)),
      },
      winRateBySport: {
        labels: ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer'],
        data: [65, 72, 58, 49, 62]
      },
      roiByBetType: {
        labels: ['Moneyline', 'Spread', 'Over/Under', 'Parlay', 'Prop'],
        data: [15.2, 8.7, -3.5, 22.1, 5.4]
      },
      stakeDistribution: {
        labels: ['$1-50', '$51-100', '$101-200', '$201-500', '$500+'],
        data: [15, 35, 30, 15, 5]
      },
      performanceByOdds: {
        labels: ['-500+', '-499 to -200', '-199 to -101', 'Even', '+101 to +200', '+201 to +500', '+501+'],
        data: [95, 72, 64, 52, 48, 32, 21]
      }
    }
  };
}

function mockUserStats() {
  return {
    totalBets: 245,
    winRate: 62.4,
    wins: 153,
    losses: 92,
    pushes: 0,
    profitLoss: 1893.5,
    roi: 18.2,
    averageOdds: -110,
    averageStake: 104.25,
    streaks: {
      currentStreak: 3,
      longestWinStreak: 8,
      longestLossStreak: 4
    },
    bestDay: {
      date: '2023-04-15',
      profit: 580
    },
    worstDay: {
      date: '2023-03-22',
      loss: 420
    }
  };
} 