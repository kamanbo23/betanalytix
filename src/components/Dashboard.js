import React, { useState, useEffect } from 'react';
// Import Recharts components
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
// Import your API services and tools
// import { fetchBettingData, fetchUserStats } from '../services/api';
// import { calculateMetrics, processApiData } from '../utils/dataProcessing';
// import { Chart } from '../components/Chart';

function Dashboard({ navigateToBetLogger }) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [bettingData, setBettingData] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30D');
  const [metrics, setMetrics] = useState({
    totalBets: 245,
    winRate: '62.4%',
    wins: 153,
    losses: 92,
    pushes: 0,
    profitLoss: '+$1,893.50',
    roi: '+18.2%',
    avgOdds: '+143',
    avgStake: '$87.50',
    bestSport: 'Basketball',
    bestBetType: 'Moneyline',
    streak: 'W4',
    bestLeague: 'NBA'
  });
  
  const [activeTab, setActiveTab] = useState('overview');

  // Load data from localStorage or use mock data as fallback
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user has logged any bets in localStorage
        const savedBets = localStorage.getItem('bets');
        let userHasBets = false;
        let userBets = [];
        
        if (savedBets) {
          try {
            userBets = JSON.parse(savedBets);
            userHasBets = userBets && userBets.length > 0;
          } catch (e) {
            console.error('Error parsing saved bets:', e);
          }
        }
        
        if (userHasBets) {
          // Use the user's actual bets
          console.log('Using user\'s logged bets for dashboard');
          
          // This would normally be more sophisticated with actual calculations
          // Basic implementation for now
          const userMetrics = calculateUserMetrics(userBets);
          
          // Generate profit trend data from user bets
          const profitTrend = generateProfitTrend(userBets);
          
          // Generate sport breakdown from user bets
          const sportBreakdown = generateSportBreakdown(userBets);
          
          // Generate bet type breakdown from user bets
          const betTypeBreakdown = generateBetTypeBreakdown(userBets);
          
          setMetrics(userMetrics);
          
          setBettingData({
            recentBets: userBets.map(bet => ({
              id: bet.id,
              date: bet.selectedDate,
              team: bet.team,
              opponent: bet.opponent,
              type: bet.betType,
              odds: bet.odds,
              stake: `$${bet.stake}`,
              // Would normally have a result field, mocking as 'pending' for now
              result: 'pending', 
              profit: 'Pending',
              isUserData: true // Add flag to indicate this is user data
            })),
            profitTrend: profitTrend,
            sportBreakdown: sportBreakdown,
            betTypeBreakdown: betTypeBreakdown,
            isDemo: false // Flag to indicate this is NOT demo data
          });
          
          setIsLoading(false);
        } else {
          // No user bets, fall back to mock data
          console.log('No user bets found, using demo data');
          
          // Using mock data for now
          setTimeout(() => {
            setBettingData({
              // Mock betting data
              recentBets: [
                { id: 1, date: '2023-04-15', team: 'Golden State Warriors', opponent: 'Los Angeles Lakers', type: 'Spread', odds: '-110', stake: '$100', result: 'win', profit: '+$90.91', isUserData: false },
                { id: 2, date: '2023-04-14', team: 'Boston Celtics', opponent: 'Miami Heat', type: 'Moneyline', odds: '-150', stake: '$150', result: 'win', profit: '+$100.00', isUserData: false },
                { id: 3, date: '2023-04-12', team: 'New York Yankees', opponent: 'Baltimore Orioles', type: 'Over 8.5', odds: '-110', stake: '$55', result: 'loss', profit: '-$55.00', isUserData: false },
                { id: 4, date: '2023-04-10', team: 'Dallas Mavericks', opponent: 'Phoenix Suns', type: 'Moneyline', odds: '+165', stake: '$60', result: 'win', profit: '+$99.00', isUserData: false },
                { id: 5, date: '2023-04-08', team: 'Kansas City Chiefs', opponent: 'Buffalo Bills', type: 'Spread +3.5', odds: '-115', stake: '$115', result: 'win', profit: '+$100.00', isUserData: false }
              ],
              profitTrend: [
                { date: '2023-03-15', profit: 0 },
                { date: '2023-03-20', profit: -120 },
                { date: '2023-03-25', profit: -200 },
                { date: '2023-03-30', profit: 150 },
                { date: '2023-04-05', profit: 300 },
                { date: '2023-04-10', profit: 450 },
                { date: '2023-04-15', profit: 1893.50 }
              ],
              sportBreakdown: [
                { sport: 'Basketball', bets: 98, winRate: 68, profit: 820.50 },
                { sport: 'Football', bets: 65, winRate: 62, profit: 610.25 },
                { sport: 'Baseball', bets: 42, winRate: 55, profit: 320.75 },
                { sport: 'Hockey', bets: 25, winRate: 60, profit: 142.00 },
                { sport: 'Soccer', bets: 15, winRate: 53, profit: 0.00 }
              ],
              betTypeBreakdown: [
                { type: 'Moneyline', bets: 120, winRate: 65, profit: 950.50 },
                { type: 'Spread', bets: 85, winRate: 58, profit: 520.75 },
                { type: 'Over/Under', bets: 40, winRate: 62, profit: 422.25 }
              ],
              isDemo: true // Flag to indicate this IS demo data
            });
            setIsLoading(false);
          }, 1000);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Helper function to generate profit trend data from user bets
  const generateProfitTrend = (bets) => {
    // For demo purposes without real results, create a simple trend
    // In a real app, this would calculate actual cumulative profit over time
    
    if (!bets || bets.length === 0) {
      return [{ date: new Date().toISOString().split('T')[0], profit: 0 }];
    }
    
    // Sort bets by date
    const sortedBets = [...bets].sort((a, b) => {
      return new Date(a.selectedDate) - new Date(b.selectedDate);
    });
    
    // Get the earliest date
    const earliestDate = new Date(sortedBets[0].selectedDate);
    const latestDate = new Date(sortedBets[sortedBets.length - 1].selectedDate);
    
    // If dates are within a short period, create some artificial points
    if ((latestDate - earliestDate) / (1000 * 60 * 60 * 24) < 5) {
      // Less than 5 days of data, create artificial trend
      const startDate = new Date(earliestDate);
      startDate.setDate(startDate.getDate() - 3);
      
      const trend = [
        { date: formatDate(startDate), profit: 0 }
      ];
      
      // Add some random points for visual effect
      let cumulativeProfit = 0;
      for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Add some randomness to the profit
        const dayProfit = (Math.random() * 200) - 100;
        cumulativeProfit += dayProfit;
        
        trend.push({
          date: formatDate(date),
          profit: Math.round(cumulativeProfit)
        });
      }
      
      return trend;
    }
    
    // Build trend points from real bet dates
    const trend = [
      { date: formatDate(earliestDate), profit: 0 }
    ];
    
    let cumulativeProfit = 0;
    sortedBets.forEach((bet, index) => {
      // Simulate some profit/loss since we don't have real results
      // In a real app, this would use the actual bet results
      const betProfit = Math.random() > 0.4 ? 
        parseFloat(bet.stake) * (Math.random() * 1.5) : 
        -parseFloat(bet.stake);
      
      cumulativeProfit += betProfit;
      
      trend.push({
        date: bet.selectedDate,
        profit: Math.round(cumulativeProfit)
      });
    });
    
    return trend;
  };
  
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Helper function to generate sport breakdown from user bets
  const generateSportBreakdown = (bets) => {
    if (!bets || bets.length === 0) {
      return [];
    }
    
    // Group bets by sport
    const sportGroups = {};
    bets.forEach(bet => {
      const sport = bet.sport || 'Unknown';
      if (!sportGroups[sport]) {
        sportGroups[sport] = {
          sport,
          bets: 0,
          wins: 0,
          losses: 0,
          profit: 0
        };
      }
      
      sportGroups[sport].bets += 1;
      
      // Simulate win/loss for visualization purposes
      // In a real app, this would use actual results
      if (Math.random() > 0.4) {
        sportGroups[sport].wins += 1;
        sportGroups[sport].profit += parseFloat(bet.stake) * (Math.random() * 1.5);
      } else {
        sportGroups[sport].losses += 1;
        sportGroups[sport].profit -= parseFloat(bet.stake);
      }
    });
    
    // Convert to array and calculate win rates
    return Object.values(sportGroups).map(group => {
      return {
        sport: group.sport,
        bets: group.bets,
        winRate: Math.round((group.wins / group.bets) * 100),
        profit: Math.round(group.profit * 100) / 100
      };
    });
  };
  
  // Helper function to generate bet type breakdown from user bets
  const generateBetTypeBreakdown = (bets) => {
    if (!bets || bets.length === 0) {
      return [];
    }
    
    // Group bets by type
    const typeGroups = {};
    bets.forEach(bet => {
      const type = bet.betType || 'Unknown';
      if (!typeGroups[type]) {
        typeGroups[type] = {
          type,
          bets: 0,
          wins: 0,
          losses: 0,
          profit: 0
        };
      }
      
      typeGroups[type].bets += 1;
      
      // Simulate win/loss for visualization purposes
      if (Math.random() > 0.4) {
        typeGroups[type].wins += 1;
        typeGroups[type].profit += parseFloat(bet.stake) * (Math.random() * 1.5);
      } else {
        typeGroups[type].losses += 1;
        typeGroups[type].profit -= parseFloat(bet.stake);
      }
    });
    
    // Convert to array and calculate win rates
    return Object.values(typeGroups).map(group => {
      return {
        type: group.type,
        bets: group.bets,
        winRate: Math.round((group.wins / group.bets) * 100),
        profit: Math.round(group.profit * 100) / 100
      };
    });
  };
  
  // Calculate metrics from user bets
  const calculateUserMetrics = (bets) => {
    // Simple calculation of basic metrics from user bets
    // In a real app, this would be more sophisticated
    
    const totalBets = bets.length;
    
    // For demo purposes, calculate a simple average stake
    let totalStake = 0;
    bets.forEach(bet => {
      totalStake += Number(bet.stake) || 0;
    });
    
    const avgStake = totalStake > 0 ? `$${(totalStake / totalBets).toFixed(2)}` : '$0.00';
    
    // Group bets by sport to find the most common
    const sportCounts = {};
    bets.forEach(bet => {
      if (bet.sport) {
        sportCounts[bet.sport] = (sportCounts[bet.sport] || 0) + 1;
      }
    });
    
    let bestSport = 'None';
    let highestCount = 0;
    Object.keys(sportCounts).forEach(sport => {
      if (sportCounts[sport] > highestCount) {
        highestCount = sportCounts[sport];
        bestSport = sport;
      }
    });
    
    // Generate simulated metrics for visual display
    // In a real app, these would be calculated from actual results
    const simulatedWins = Math.floor(totalBets * 0.6);
    const simulatedLosses = totalBets - simulatedWins;
    const simulatedWinRate = totalBets > 0 ? `${Math.round((simulatedWins / totalBets) * 100)}%` : '0%';
    
    // Simulate profit/loss based on stake and win rate
    const simulatedProfitValue = Math.round((totalStake * 0.15) * 100) / 100;
    const simulatedProfit = simulatedProfitValue > 0 ? `+$${simulatedProfitValue.toFixed(2)}` : `-$${Math.abs(simulatedProfitValue).toFixed(2)}`;
    
    // Calculate ROI
    const simulatedRoi = totalStake > 0 ? `${Math.round((simulatedProfitValue / totalStake) * 100)}%` : '0%';
    
    return {
      totalBets,
      winRate: simulatedWinRate,
      wins: simulatedWins,
      losses: simulatedLosses,
      pushes: 0,
      profitLoss: simulatedProfit,
      roi: simulatedRoi,
      avgOdds: 'Varies',
      avgStake,
      bestSport,
      bestBetType: 'Pending', // Would calculate from results in a full implementation
      streak: 'N/A', // Would calculate from results in a full implementation
      bestLeague: 'Pending' // Would calculate from results in a full implementation
    };
  };

  // Render actual charts instead of placeholders
  const renderChart = (type) => {
    if (!bettingData) {
      return (
        <div className="chart-placeholder" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
          borderRadius: '8px',
          background: 'rgba(15, 15, 15, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
          <p style={{ textAlign: 'center', color: '#b0b0b0' }}>
            No data available to display charts
          </p>
        </div>
      );
    }
    
    // Different chart rendering based on type
    switch(type) {
      case 'Profit/Loss Trend':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bettingData.profitTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{fill: '#b0b0b0'}} />
              <YAxis tick={{fill: '#b0b0b0'}} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
              <Area type="monotone" dataKey="profit" stroke="#2196f3" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'Win Rate by Sport':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bettingData.sportBreakdown}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="sport" tick={{fill: '#b0b0b0'}} />
              <YAxis tick={{fill: '#b0b0b0'}} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
              <Legend wrapperStyle={{color: '#b0b0b0'}} />
              <Bar dataKey="winRate" name="Win Rate (%)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'Profit by Bet Type':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bettingData.betTypeBreakdown}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="type" tick={{fill: '#b0b0b0'}} />
              <YAxis tick={{fill: '#b0b0b0'}} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
              <Legend wrapperStyle={{color: '#b0b0b0'}} />
              <Bar dataKey="profit" name="Profit" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'Sports Breakdown':
        // Create more readable data format for pie chart
        const sportsPieData = bettingData.sportBreakdown.map(item => ({
          name: item.sport,
          value: item.bets
        }));
        
        const SPORTS_COLORS = ['#8884d8', '#4caf50', '#ff5722', '#2196f3', '#ffc107', '#9c27b0'];
        
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sportsPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sportsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SPORTS_COLORS[index % SPORTS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'Bet Type Analysis':
        // Create more readable data format for pie chart
        const typePieData = bettingData.betTypeBreakdown.map(item => ({
          name: item.type,
          value: item.bets
        }));
        
        const TYPE_COLORS = ['#ff5722', '#4caf50', '#2196f3', '#ffc107', '#9c27b0'];
        
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {typePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'Stake vs. ROI':
        // Generate a scatter plot of stake vs ROI
        // For demo, we'll create synthetic data based on betting patterns
        const stakeRoiData = bettingData.recentBets.map(bet => {
          const stake = parseFloat(bet.stake.replace('$', ''));
          // Generate a random ROI between -100% and +200%
          const roi = Math.round((Math.random() * 300) - 100);
          return {
            name: `${bet.team} vs ${bet.opponent}`,
            stake,
            roi
          };
        });
        
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={stakeRoiData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{fill: '#b0b0b0'}} />
              <YAxis tick={{fill: '#b0b0b0'}} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
              <Legend wrapperStyle={{color: '#b0b0b0'}} />
              <Bar dataKey="roi" name="ROI (%)" fill="#ff5722" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'Time of Day Performance':
        // Generate synthetic time of day performance data
        const timeOfDayData = [
          { time: 'Morning', winRate: 65, bets: 48 },
          { time: 'Afternoon', winRate: 59, bets: 73 },
          { time: 'Evening', winRate: 71, bets: 102 },
          { time: 'Night', winRate: 54, bets: 22 }
        ];
        
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={timeOfDayData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" tick={{fill: '#b0b0b0'}} />
              <YAxis tick={{fill: '#b0b0b0'}} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} labelStyle={{color: '#2196f3'}} itemStyle={{color: '#e0e0e0'}} />
              <Legend wrapperStyle={{color: '#b0b0b0'}} />
              <Bar dataKey="winRate" name="Win Rate (%)" fill="#2196f3" />
              <Bar dataKey="bets" name="Number of Bets" fill="#9c27b0" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="chart-placeholder" style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px',
            borderRadius: '8px',
            background: 'rgba(15, 15, 15, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <p style={{ textAlign: 'center', color: '#b0b0b0' }}>
              {type} Chart
              <br />
              <span style={{ fontSize: '0.9rem' }}>(Data visualization to be implemented)</span>
            </p>
          </div>
        );
    }
  };

  const renderRecentBets = () => {
    if (!bettingData || !bettingData.recentBets || bettingData.recentBets.length === 0) {
      return (
        <div className="empty-state" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(25, 118, 210, 0.05)',
          borderRadius: '8px',
          border: '1px dashed rgba(25, 118, 210, 0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
          <h3 style={{ marginBottom: '10px', color: '#e2e2e2' }}>No Bets Found</h3>
          <p style={{ maxWidth: '500px', color: '#b0b0b0', marginBottom: '20px' }}>
            You haven't logged any bets yet, or you've cleared your data. Start tracking your betting performance by logging your bets!
          </p>
          <button className="log-bet-button" 
            onClick={() => {
              // Navigate to BetLogger component
              if (navigateToBetLogger) {
                // Use provided navigation function if available
                navigateToBetLogger();
              } else {
                // Try to navigate via window.location as fallback
                window.location.href = '/betlogger';
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Start Logging Bets
          </button>
        </div>
      );
    }

    // Use the isDemo flag to determine if these are demo bets or user bets
    const isDemo = bettingData.isDemo;
    const isPendingResult = bettingData.recentBets.some(bet => bet.result === 'pending');
    
    return (
      <div className="recent-bets">
        {isDemo && (
          <div className="demo-data-banner" style={{
            background: 'rgba(255, 87, 51, 0.1)',
            border: '1px solid rgba(255, 87, 51, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#ff5733',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                <span style={{ marginRight: '8px' }}>⚠️</span>
                You're viewing DEMO DATA
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#e0e0e0' }}>
                These are sample bets to demonstrate the dashboard. Log your own bets to replace this demo data!
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="log-bet-button" 
                onClick={() => {
                  // Navigate to BetLogger component
                  if (navigateToBetLogger) {
                    navigateToBetLogger();
                  } else {
                    window.location.href = '/betlogger';
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Log Bets
              </button>
              <button 
                className="clear-data-button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This will remove the demo data and any existing bet history so you can start fresh.')) {
                    // Clear localStorage
                    localStorage.removeItem('bets');
                    
                    // Reset state to empty
                    setBettingData({
                      recentBets: [],
                      profitTrend: [{ date: new Date().toISOString().split('T')[0], profit: 0 }],
                      sportBreakdown: [],
                      betTypeBreakdown: [],
                      isDemo: false
                    });
                    
                    setMetrics({
                      totalBets: 0,
                      winRate: '0%',
                      wins: 0,
                      losses: 0,
                      pushes: 0,
                      profitLoss: '$0.00',
                      roi: '0%',
                      avgOdds: 'N/A',
                      avgStake: '$0.00',
                      bestSport: 'None',
                      bestBetType: 'None',
                      streak: 'N/A',
                      bestLeague: 'None'
                    });
                  }
                }}
                style={{
                  background: 'rgba(220, 53, 69, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Remove Demo
              </button>
            </div>
          </div>
        )}
        
        {!isDemo && isPendingResult && (
          <div className="info-banner" style={{
            background: 'rgba(25, 118, 210, 0.1)',
            border: '1px solid rgba(25, 118, 210, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#e0e0e0',
            fontSize: '0.95rem'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Your logged bets:</strong> You've started logging your bets! To track results, you'll need to update each bet with its outcome in the Pro version. For now, we're showing your logged bets with pending results.
            </p>
          </div>
        )}
        
        <table className="bets-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Match</th>
              <th>Bet Type</th>
              <th>Odds</th>
              <th>Stake</th>
              <th>Result</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {bettingData.recentBets.map(bet => (
              <tr key={bet.id} className={`bet-row ${bet.result === 'win' ? 'win' : bet.result === 'loss' ? 'loss' : 'pending'} ${!bet.isUserData ? 'demo-data' : ''}`}>
                <td>{bet.date}</td>
                <td>{bet.team} vs {bet.opponent}</td>
                <td>{bet.type}</td>
                <td>{bet.odds}</td>
                <td>{bet.stake}</td>
                <td className={`result ${bet.result}`}>
                  {!bet.isUserData && <span className="demo-badge" style={{ fontSize: '0.7rem', background: 'rgba(255, 87, 51, 0.2)', padding: '2px 4px', borderRadius: '4px', marginRight: '5px' }}>DEMO</span>}
                  {bet.result === 'pending' ? 'PENDING' : bet.result.toUpperCase()}
                </td>
                <td className={bet.profit === 'Pending' ? 'pending' : bet.profit.startsWith('+') ? 'profit' : 'loss'}>{bet.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Glowing background effect */}
      <div className="dashboard-glow-effect"></div>
      
      {/* Fixed Announcement Banner */}
      {showAnnouncement && (
        <div className="announcement-banner" style={{
          position: 'relative', // Change from fixed position to relative
          zIndex: 1, // Lower z-index
          marginBottom: '15px', // Add margin below
          backgroundColor: 'rgba(10, 10, 15, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '10px 15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          fontWeight: 'normal',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          <div className="announcement-content" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span role="img" aria-label="rocket" className="announcement-icon" style={{
              fontSize: '1.5rem',
              marginTop: '2px'
            }}>🚀</span>
            <div className="announcement-text" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div>
                <strong>BetAnalytix Pro Coming Soon:</strong>
                <span> We're working on importing data directly from betting apps with real-time sports information updates.</span>
              </div>
              
              <div>
                <strong style={{ color: '#ff5733' }}>⚠️ Important:</strong>
                <span> Clear the demo data from both Recent Bets section and the main dashboard before logging your own bets. Use the "Remove Demo" button in each section.</span>
              </div>
              
              <div className="announcement-contact" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                Questions or feedback? Email <a href="mailto:lkamanboina@gmail.com">lkamanboina@gmail.com</a>
              </div>
            </div>
            <button 
              className="announcement-close"
              onClick={() => setShowAnnouncement(false)}
              aria-label="Close announcement"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e0e0e0',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0',
                marginTop: '-5px',
                marginRight: '-5px',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Your Betting Dashboard</h1>
        
        <div className="dashboard-controls">
          <div className="control-item">
            <select 
              className="select-control"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
              <option value="YTD">Year to Date</option>
              <option value="ALL">All Time</option>
            </select>
          </div>
          
          <div className="control-item">
            <button className="refresh-button">
              <span className="refresh-icon">↻</span> Refresh
            </button>
          </div>
        </div>

        {/* Clear Data Button */}
        <div className="dashboard-actions" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginBottom: '15px',
          paddingRight: '10px'
        }}>
          <button 
            className="clear-data-button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data? This will remove all bets from your history and reset the dashboard to an empty state.')) {
                // Clear localStorage
                localStorage.removeItem('bets');
                
                // Reset state
                setBettingData({
                  recentBets: [],
                  profitTrend: [{ date: new Date().toISOString().split('T')[0], profit: 0 }],
                  sportBreakdown: [],
                  betTypeBreakdown: []
                });
                
                setMetrics({
                  totalBets: 0,
                  winRate: '0%',
                  wins: 0,
                  losses: 0,
                  pushes: 0,
                  profitLoss: '$0.00',
                  roi: '0%',
                  avgOdds: 'N/A',
                  avgStake: '$0.00',
                  bestSport: 'None',
                  bestBetType: 'None',
                  streak: 'N/A',
                  bestLeague: 'None'
                });
                
                // Show success message
                alert('All data has been cleared. Your bet history has been removed and you can now start fresh with your own bets!');
              }
            }}
            style={{
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <span style={{ marginRight: '5px' }}>🗑️</span> Clear All Data
          </button>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your betting analytics...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !error && (
        <div className="dashboard-content">
          {/* Dashboard Navigation Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance Analysis
            </button>
            <button 
              className={`tab-button ${activeTab === 'bets' ? 'active' : ''}`}
              onClick={() => setActiveTab('bets')}
            >
              Recent Bets
            </button>
          </div>
          
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Performance Summary - Replacing the metrics grid with a cleaner layout */}
              <section className="performance-summary">
                <div className="summary-header">
                  <h2>Betting Performance Summary</h2>
                </div>
                <div className="summary-content">
                  <div className="summary-row">
                    <div className="summary-stat profit-stat">
                      <div className="stat-label">Total Profit/Loss</div>
                      <div className="stat-value">{metrics.profitLoss}</div>
                    </div>
                    <div className="summary-stat roi-stat">
                      <div className="stat-label">Return on Investment</div>
                      <div className="stat-value">{metrics.roi}</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-label">Total Bets</div>
                      <div className="stat-value">{metrics.totalBets}</div>
                    </div>
                  </div>
                  <div className="summary-row">
                    <div className="summary-stat win-stat">
                      <div className="stat-label">Win Rate</div>
                      <div className="stat-value">{metrics.winRate}</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-label">Wins / Losses</div>
                      <div className="stat-value">{metrics.wins} / {metrics.losses}</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-label">Avg. Stake</div>
                      <div className="stat-value">{metrics.avgStake}</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Chart - Profit/Loss */}
              <section className="main-chart-section">
                <div className="section-header">
                  <h2>Profit/Loss Trend</h2>
                  <div className="time-range-selector">
                    {['7D', '30D', '90D', 'YTD', 'ALL'].map(range => (
                      <button 
                        key={range} 
                        className={`range-button ${timeRange === range ? 'active' : ''}`}
                        onClick={() => setTimeRange(range)}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                {renderChart('Profit/Loss Trend')}
              </section>

              {/* Additional Charts */}
              <section className="secondary-charts">
                <div className="chart-grid">
                  <div className="chart-card">
                    <h3>Win Rate by Sport</h3>
                    {renderChart('Win Rate by Sport')}
                  </div>
                  <div className="chart-card">
                    <h3>Profit by Bet Type</h3>
                    {renderChart('Profit by Bet Type')}
                  </div>
                </div>
              </section>

              {/* Recent Performance Summary */}
              <section className="recent-performance">
                <h2>Recent Performance</h2>
                <div className="performance-metrics">
                  <div className="performance-card">
                    <h3>Last 7 Days</h3>
                    <div className="performance-stats">
                      <div className="stat">
                        <span className="stat-label">Bets</span>
                        <span className="stat-value">14</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Win Rate</span>
                        <span className="stat-value">71.4%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Profit</span>
                        <span className="stat-value profit">+$312.75</span>
                      </div>
                    </div>
                  </div>
                  <div className="performance-card">
                    <h3>Last 30 Days</h3>
                    <div className="performance-stats">
                      <div className="stat">
                        <span className="stat-label">Bets</span>
                        <span className="stat-value">42</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Win Rate</span>
                        <span className="stat-value">64.3%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Profit</span>
                        <span className="stat-value profit">+$843.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          
          {/* Performance Analysis Tab Content */}
          {activeTab === 'performance' && (
            <section className="performance-analysis">
              <div className="analysis-grid">
                <div className="analysis-card">
                  <h3>Sports Breakdown</h3>
                  {renderChart('Sports Breakdown')}
                </div>
                <div className="analysis-card">
                  <h3>Bet Type Analysis</h3>
                  {renderChart('Bet Type Analysis')}
                </div>
                <div className="analysis-card">
                  <h3>Stake vs. ROI</h3>
                  {renderChart('Stake vs. ROI')}
                </div>
                <div className="analysis-card">
                  <h3>Time of Day Performance</h3>
                  {renderChart('Time of Day Performance')}
                </div>
              </div>
            </section>
          )}
          
          {/* Recent Bets Tab Content */}
          {activeTab === 'bets' && (
            <section className="recent-bets-section">
              <div className="section-header">
                <h2>Recent Bets</h2>
                <button className="log-bet-button" onClick={() => {
                  // Navigate to BetLogger component
                  if (navigateToBetLogger) {
                    // Use provided navigation function if available
                    navigateToBetLogger();
                  } else {
                    // Try to navigate via window.location as fallback
                    window.location.href = '/betlogger';
                  }
                }}>+ Log New Bet</button>
              </div>
              {renderRecentBets()}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// Simplified metric card component - removed since we're not using it anymore
// function MetricCard({ title, value, icon, color, isHighlight = false }) {
//   const isPositive = value && (value.includes('+') || value === 'W');
//   const isNegative = value && (value.includes('-') || value === 'L');
//   
//   const valueClass = isPositive ? 'positive' : isNegative ? 'negative' : '';
//   
//   // Create a value display that handles overflow
//   const displayValue = () => {
//     if (!value) return '';
//     
//     // If value is too long, use a smaller font size
//     const length = value.toString().length;
//     const fontSize = length > 6 ? 'small-value' : length > 4 ? 'medium-value' : '';
//     
//     return <div className={`metric-value ${valueClass} ${fontSize}`}>{value}</div>;
//   };
//   
//   return (
//     <div className={`metric-card ${isHighlight ? 'highlight' : ''}`}>
//       <div className="metric-icon" style={{ color: color }}>
//         {icon}
//       </div>
//       <div className="metric-content">
//         <h3 className="metric-title">{title}</h3>
//         {displayValue()}
//       </div>
//     </div>
//   );
// }

export default Dashboard; 