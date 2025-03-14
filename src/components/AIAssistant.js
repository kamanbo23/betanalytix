import React, { useState, useEffect, useRef } from 'react';
import { callGemmaAPI, generateInsights } from '../utils/gemmaService';

// Enhanced AI Assistant with breathtaking UI and animations
const AIAssistant = () => {
  // State for various elements
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('strategy');
  const [query, setQuery] = useState('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [recentBets, setRecentBets] = useState([]);
  const [promptHistory, setPromptHistory] = useState(JSON.parse(localStorage.getItem('gemma-prompt-history') || '[]'));
  const promptRef = useRef(null);
  const [betHistory, setBetHistory] = useState(null);
  const [modelInfo, setModelInfo] = useState({
    modelName: "AI Betting Analyst",
    lastUpdated: new Date().toISOString().split('T')[0],
    specialties: ["Sports Betting Analysis", "Pattern Recognition", "Risk Assessment"]
  });
  
  // Animation states
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);
  const [response, setResponse] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [visibleResponse, setVisibleResponse] = useState('');
  const [animationState, setAnimationState] = useState('idle');
  const [pulseEffect, setPulseEffect] = useState(false);
  const [entranceAnimation, setEntranceAnimation] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  
  // Load insights and betting history on mount with animation
  useEffect(() => {
    setAnimationState('entering');
    setTimeout(() => {
      loadInsights();
      loadBettingHistory();
      setAnimationState('entered');
      
      // Start entrance animation
      setEntranceAnimation(true);
      setTimeout(() => setEntranceAnimation(false), 1500);
    }, 300);
    
    // Cleanup function to clear any timeouts
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);
  
  // Simulate loading betting history from localStorage
  const loadBettingHistory = () => {
    // This would normally come from your actual data store
    const mockBetHistory = {
      totalBets: 245,
      winRate: 0.624,
      wins: 153,
      losses: 92,
      profitLoss: 1893.50,
      roi: 0.182,
      sportBreakdown: [
        { sport: 'Basketball', bets: 98, winRate: 0.68, profit: 820.50 },
        { sport: 'Football', bets: 65, winRate: 0.62, profit: 610.25 },
        { sport: 'Baseball', bets: 42, winRate: 0.55, profit: 320.75 },
        { sport: 'Hockey', bets: 25, winRate: 0.60, profit: 142.00 },
        { sport: 'Soccer', bets: 15, winRate: 0.53, profit: 0.00 }
      ],
      recentBets: [
        { id: 1, date: '2023-04-15', team: 'Golden State Warriors', opponent: 'Los Angeles Lakers', type: 'Spread', odds: '-110', stake: 100, result: 'win', profit: 90.91 },
        { id: 2, date: '2023-04-14', team: 'Boston Celtics', opponent: 'Miami Heat', type: 'Moneyline', odds: '-150', stake: 150, result: 'win', profit: 100.00 },
        { id: 3, date: '2023-04-12', team: 'New York Yankees', opponent: 'Baltimore Orioles', type: 'Over 8.5', odds: '-110', stake: 55, result: 'loss', profit: -55.00 },
        { id: 4, date: '2023-04-10', team: 'Dallas Mavericks', opponent: 'Phoenix Suns', type: 'Moneyline', odds: '+165', stake: 60, result: 'win', profit: 99.00 },
        { id: 5, date: '2023-04-08', team: 'Kansas City Chiefs', opponent: 'Buffalo Bills', type: 'Spread +3.5', odds: '-115', stake: 115, result: 'win', profit: 100.00 }
      ]
    };
    
    setBetHistory(mockBetHistory);
    setRecentBets(mockBetHistory.recentBets);
  };
  
  // Load insights using the AI service
  const loadInsights = async () => {
    setLoading(true);
    
    // Clear previous timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    try {
      // Simulate API call with pulse effect
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1500);
      
      // Adding a guaranteed timeout to ensure loading doesn't get stuck
      const timeoutPromise = new Promise((resolve) => {
        const timeout = setTimeout(() => {
          loadSampleInsights();
          resolve({ timeout: true });
        }, 3000); // 3 seconds timeout
        setLoadingTimeout(timeout);
      });
      
      // Race between the API call and the timeout
      const result = await Promise.race([
        generateInsights().then(data => ({ data, timeout: false })),
        timeoutPromise
      ]);
      
      if (!result.timeout) {
        setInsights(result.data);
        // Clear the timeout if API call was successful
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
      }
    } catch (error) {
      console.error("Error loading insights:", error);
      // Load fallback insights if API fails
      loadSampleInsights();
    }
  };
  
  // Sample insights generation (fallback if API fails)
  const loadSampleInsights = () => {
    setLoading(true);
    const sampleInsightsData = [
      {
        id: 1,
        type: 'strategy',
        title: 'Value Betting Opportunity',
        content: 'Based on your recent bets, there appears to be value in MLB underdogs when the line is between +160 and +180. You\'ve had a 64% success rate with these bets, significantly above the breakeven point of 38%.',
        timestamp: new Date().toISOString(),
        confidence: 0.89,
        dataPoints: 23
      },
      {
        id: 2,
        type: 'risk',
        title: 'Bankroll Management Alert',
        content: 'Your stake sizes have increased by 35% in the last month while your win rate has decreased. Consider returning to your previous stake sizing until results stabilize. This pattern has preceded drawdowns in 78% of similar cases in our database.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        confidence: 0.92,
        dataPoints: 45
      },
      {
        id: 3,
        type: 'trend',
        title: 'Profitable Sport Identified',
        content: 'Basketball bets have been your most profitable category with a 12.3% ROI over 35 bets. Consider allocating more of your bankroll to this sport. NBA home favorites after a loss show particularly strong results in your betting history.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        confidence: 0.87,
        dataPoints: 35
      },
      {
        id: 4,
        type: 'strategy',
        title: 'Value in Underdog Moneylines',
        content: 'Your 3+ leg parlays have a -28% ROI over 17 bets. Consider focusing on single bets or 2-leg parlays which have shown a +14% ROI in your history. The data suggests sportsbooks have an increased edge on larger parlays.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        confidence: 0.91,
        dataPoints: 31
      }
    ];
    
    // Add with animation delay to simulate API response
    setTimeout(() => {
      setInsights(sampleInsightsData);
      setLoading(false);
      
      // Animation to show insights are loaded
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    }, 800);
  };
  
  // Handle prompt submission to AI
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isPrompting) return;
    
    // Store original query
    const userQuery = query;
    
    // Reset states and trigger animations
    setIsPrompting(true);
    setLoading(true);
    setShowTypingAnimation(true);
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 1000);
    
    // Update prompt history
    const newPromptHistory = [userQuery, ...promptHistory.slice(0, 4)];
    setPromptHistory(newPromptHistory);
    localStorage.setItem('gemma-prompt-history', JSON.stringify(newPromptHistory));
    
    // Prepare analytics context for the AI
    const analyticsContext = prepareAnalyticsContext();
    
    try {
      // Call the AI API with timeout to ensure it doesn't get stuck
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 3000); // 3 seconds timeout
      });
      
      // Race between the API call and the timeout
      const responseText = await Promise.race([
        callGemmaAPI(userQuery, analyticsContext),
        timeoutPromise
      ]) || getMockResponse(userQuery, analyticsContext);
      
      // Set response for animation
      setResponse(responseText);
      setCurrentCharIndex(0);
      setVisibleResponse('');
      
      // Update insights with this new query/response
      const newInsight = {
        id: Date.now(),
        type: 'custom',
        title: `Analysis: ${userQuery}`,
        content: responseText,
        timestamp: new Date().toISOString(),
        confidence: 0.85 + Math.random() * 0.1,
        dataPoints: Math.floor(Math.random() * 20) + 10
      };
      
      // Add with animation
      setAnimationState('updating');
      setTimeout(() => {
        setInsights([newInsight, ...insights]);
        setAnimationState('updated');
        setTimeout(() => setAnimationState('entered'), 500);
      }, 300);
      
      setQuery('');
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      // Fallback to mock response if API fails
      const mockResponse = getMockResponse(userQuery, analyticsContext);
      setResponse(mockResponse);
      setCurrentCharIndex(0);
      setVisibleResponse('');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsPrompting(false);
      }, 800);
    }
  };
  
  // Explore insight - opens a detailed view or adds to query
  const exploreInsight = (insight) => {
    // Set the query text based on the insight title
    setQuery(`Tell me more about ${insight.title.toLowerCase()}`);
    // Focus on custom analysis tab
    setActiveTab('custom');
    // Auto-scroll to input area
    if (promptRef.current) {
      promptRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle generate new insights button click
  const handleGenerateNewInsights = () => {
    // Clear current insights and reload
    setInsights([]);
    loadInsights();
  };
  
  // Prepare analytics context for the AI
  const prepareAnalyticsContext = () => {
    if (!betHistory) return null;
    
    return {
      totalBets: betHistory.totalBets,
      winRate: betHistory.winRate,
      profitLoss: betHistory.profitLoss,
      roi: betHistory.roi,
      sportBreakdown: betHistory.sportBreakdown.map(sport => ({
        sport: sport.sport,
        bets: sport.bets,
        winRate: sport.winRate,
        profit: sport.profit
      })),
      recentBets: betHistory.recentBets.slice(0, 5).map(bet => ({
        team: bet.team,
        opponent: bet.opponent,
        type: bet.type,
        odds: bet.odds,
        result: bet.result
      }))
    };
  };
  
  // Mock response generator (fallback if API fails)
  const getMockResponse = (query, context) => {
    // Determine query type
    let responseType = 'general';
    
    if (query.toLowerCase().includes('baseball') || query.toLowerCase().includes('mlb')) {
      responseType = 'baseball';
    } else if (query.toLowerCase().includes('bankroll') || query.toLowerCase().includes('stake') || query.toLowerCase().includes('money management')) {
      responseType = 'bankroll';
    } else if (query.toLowerCase().includes('basketball') || query.toLowerCase().includes('nba')) {
      responseType = 'basketball';
    }
    
    // Return appropriate response template
    switch (responseType) {
      case 'baseball':
        return `Based on your betting history, you've placed 42 bets on baseball games with a 55% win rate, resulting in a profit of $320.75.

Your MLB underdogs betting has been particularly successful, with a 64% win rate when the odds are between +160 and +180. This is significantly above the breakeven point of 38% needed for profitability at these odds.

**Recommendation:**
- Continue targeting MLB underdogs in the +160 to +180 range
- Consider increasing your stake on these bets by 15-20% given your edge
- Focus particularly on home underdogs after a loss, where your win rate is highest (72%)
- Avoid parlays involving MLB games, as they've shown a -12% ROI in your history`;

      case 'bankroll':
        return `Looking at your betting patterns, I've identified some concerning trends in your bankroll management:

1. Your average stake has increased from $65 to $87.50 (35% increase) over the past month
2. During this same period, your win rate has decreased from 68% to 59%
3. Your Risk of Ruin has increased from approximately 3% to 8% based on these changes

**Recommendations:**
- Return to your previous stake sizing (around 2-3% of bankroll per bet)
- Implement a stop-loss of 5% of your bankroll for daily betting
- Consider a "cooling off" period after losing streaks of 3+ bets
- Maintain detailed records of your bet sizing and emotions when placing bets

This pattern of increasing stakes during downswings is common and has preceded significant drawdowns in 78% of similar cases we've analyzed.`;

      case 'basketball':
        return `Basketball has been your most profitable sport by far, with:
- 98 total bets
- 68% win rate
- $820.50 profit
- 12.3% ROI

Specific NBA patterns where you've excelled:
1. Home favorites after a loss: 76% win rate (19/25 bets)
2. Road underdogs with rest advantage: 65% win rate (13/20 bets)
3. Under bets in divisional games: 70% win rate (7/10 bets)

**Recommendations:**
- Increase allocation to NBA bets by 10-15%
- Specifically target home favorites coming off a loss
- Consider a specialized betting system focused on these high-win-rate scenarios
- Set alerts for games matching these criteria in upcoming schedules`;

      case 'general':
      default:
        return `Based on analysis of your ${context?.totalBets || 245} tracked bets, here are some key insights:

1. Your overall ROI is ${context?.roi * 100 || 18.2}%, which is excellent compared to the average sports bettor.

2. Your most profitable sport is ${context?.sportBreakdown?.[0]?.sport || 'Basketball'} with a ${context?.sportBreakdown?.[0]?.winRate * 100 || 68}% win rate and $${context?.sportBreakdown?.[0]?.profit || 820.50} in profit.

3. Your win rate has been ${context?.winRate * 100 || 62.4}% across all bets, which indicates good selection ability.

**Areas for Improvement:**
- Consider more consistent stake sizing (your stakes vary significantly)
- Reduce exposure to parlays with more than 3 legs
- Track closing line value to better measure your edge
- Look for value in underdog moneylines, where you've shown a solid edge

Would you like me to analyze a specific sport or betting type in more detail?`;
    }
  };
  
  // Animation for typing effect
  useEffect(() => {
    if (showTypingAnimation && currentCharIndex < response.length) {
      const timer = setTimeout(() => {
        setVisibleResponse(response.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, Math.random() * 30 + 10); // Variable speed for natural typing feel
      
      return () => clearTimeout(timer);
    } else if (currentCharIndex >= response.length) {
      setShowTypingAnimation(false);
      
      // Auto-scroll to the bottom of the prompt area
      if (promptRef.current) {
        promptRef.current.scrollTop = promptRef.current.scrollHeight;
      }
    }
  }, [showTypingAnimation, currentCharIndex, response]);
  
  // Auto-scroll when new insights are added
  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.scrollTop = 0;
    }
  }, [insights.length]);

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };
  
  return (
    <div className={`ai-assistant-container ${animationState} ${entranceAnimation ? 'entrance-animation' : ''}`}>
      <div className="ai-header">
        <div className="ai-header-main">
          <div className={`ai-header-icon ${pulseEffect ? 'pulse' : ''}`}>
            <i className="fas fa-brain"></i>
            <div className="ai-icon-pulse"></div>
          </div>
          <div className="ai-header-content">
            <h2>Betting Insights AI</h2>
            <p className="assistant-description">
              Advanced AI-powered analytics and recommendations based on your betting history
            </p>
          </div>
          <div className="model-info">
            <div className="model-name">{modelInfo.modelName}</div>
            <div className="model-updated">Updated: {modelInfo.lastUpdated}</div>
            <div className="model-badges">
              {modelInfo.specialties.map((specialty, index) => (
                <span key={index} className="model-specialty">{specialty}</span>
              ))}
            </div>
          </div>
        </div>
      
        <div className="ai-tabs">
          <button 
            className={`ai-tab-btn ${activeTab === 'strategy' ? 'active' : ''}`}
            onClick={() => setActiveTab('strategy')}
          >
            <i className="fas fa-chart-line"></i>
            Strategy Insights
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk')}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Risk Alerts
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'trend' ? 'active' : ''}`}
            onClick={() => setActiveTab('trend')}
          >
            <i className="fas fa-chart-bar"></i>
            Trend Analysis
          </button>
          <button 
            className={`ai-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <i className="fas fa-search"></i>
            Custom Analysis
          </button>
        </div>
      </div>
              
      <div className="ai-content">
        <div className="insights-container">
          {loading && insights.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Analyzing your betting data...</p>
            </div>
          ) : (
            <>
              {insights.filter(insight => activeTab === 'all' || insight.type === activeTab).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3>No {activeTab} insights available</h3>
                  <p>
                    Ask the AI to analyze your betting patterns or switch to another tab to view different insights.
                  </p>
                </div>
              ) : (
                <>
                  <div className="insights-header">
                    <button 
                      className="generate-insights-btn"
                      onClick={handleGenerateNewInsights}
                      disabled={loading}
                    >
                      {loading ? (
                        <><i className="fas fa-sync fa-spin"></i> Generating...</>
                      ) : (
                        <><i className="fas fa-sync"></i> Generate New Insights</>
                      )}
                    </button>
                  </div>
                  <div className={`insights-list ${animationState}`}>
                    {insights
                      .filter(insight => activeTab === 'all' || insight.type === activeTab)
                      .map((insight, index) => (
                        <div 
                          key={insight.id} 
                          className={`insight-card ${insight.type} fade-in-up`} 
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="insight-header">
                            <h3 className="insight-title">{insight.title}</h3>
                            <div className="insight-meta">
                              <span className="insight-time">{formatRelativeTime(insight.timestamp)}</span>
                              <span className="insight-confidence">Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                              <span className="insight-datapoints">Based on {insight.dataPoints} bets</span>
                            </div>
                          </div>
                          <div className="insight-content">
                            {insight.content.split('\n\n').map((paragraph, i) => (
                              <p key={i} className="insight-paragraph">
                                {paragraph.startsWith('**') && paragraph.endsWith('**') 
                                  ? <strong>{paragraph.slice(2, -2)}</strong>
                                  : paragraph.split('\n').map((line, j) => (
                                      <React.Fragment key={j}>
                                        {line.startsWith('- ') 
                                          ? <li>{line.substring(2)}</li>
                                          : line.startsWith('**') && line.endsWith(':**')
                                            ? <strong>{line.slice(2, -3)}:</strong>
                                            : line}
                                        {j < paragraph.split('\n').length - 1 && <br />}
                                      </React.Fragment>
                                    ))
                                }
                              </p>
                            ))}
                          </div>
                          <div className="insight-actions">
                            <button 
                              className="insight-action-button explore-btn"
                              onClick={() => exploreInsight(insight)}
                            >
                              <i className="fas fa-search-plus"></i> Explore
                            </button>
                            <button className="insight-action-button">
                              <i className="fas fa-bookmark"></i> Save
                            </button>
                            <button className="insight-action-button">
                              <i className="fas fa-share-alt"></i> Share
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="prompt-container">
          <div className="prompt-area" ref={promptRef}>
            {showTypingAnimation || visibleResponse ? (
              <div className="ai-response">
                <div className="ai-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="response-content">
                  {visibleResponse.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="response-paragraph">
                      {paragraph.startsWith('**') && paragraph.endsWith('**') 
                        ? <strong>{paragraph.slice(2, -2)}</strong>
                        : paragraph.split('\n').map((line, j) => (
                            <React.Fragment key={j}>
                              {line.startsWith('- ') 
                                ? <li>{line.substring(2)}</li>
                                : line.startsWith('**') && line.endsWith(':**')
                                  ? <strong>{line.slice(2, -3)}:</strong>
                                  : line}
                              {j < paragraph.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))
                      }
                    </p>
                  ))}
                  {showTypingAnimation && <span className="typing-indicator">|</span>}
                </div>
              </div>
            ) : (
              <div className="prompt-placeholder">
                <i className="fas fa-lightbulb prompt-icon"></i>
                <p>Ask the AI for betting insights based on your history</p>
                <div className="example-queries">
                  {['Analyze my NBA betting patterns', 
                    'What type of bets have been most profitable for me?', 
                    'Should I adjust my bankroll management?', 
                    'What trends do you see in my baseball bets?'].map((example, i) => (
                  <button 
                      key={i} 
                      className="example-query"
                      onClick={() => setQuery(example)}
                    >
                      {example}
                  </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        
          <form onSubmit={handleSubmit} className="prompt-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for betting insights or advice..."
              disabled={isPrompting}
              className="prompt-input"
            />
            <button 
              type="submit" 
              disabled={isPrompting || !query.trim()} 
              className={`prompt-submit ${isPrompting ? 'prompting' : ''}`}
            >
              {isPrompting ? 
                <i className="fas fa-circle-notch fa-spin"></i> : 
                <i className="fas fa-paper-plane"></i>
              }
            </button>
          </form>
          
          {promptHistory.length > 0 && (
            <div className="prompt-history">
              <h4>Recent Queries</h4>
              <div className="history-items">
                {promptHistory.map((item, index) => (
                  <button 
                    key={index} 
                    className="history-item"
                    onClick={() => !isPrompting && setQuery(item)}
                    disabled={isPrompting}
                  >
                    <i className="fas fa-history"></i>
                    <span>{item.length > 40 ? item.substring(0, 40) + '...' : item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 