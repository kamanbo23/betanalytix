/**
 * Gemma API Service - Handles integration with OpenRouter's Gemma 3 model
 */

// API key for OpenRouter (stored here for demo purposes, should be secured in production)
const OPENROUTER_API_KEY = "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";
const MODEL = "google/gemma-3-27b-it:free";

/**
 * Call the Gemma API via OpenRouter
 * @param {string} prompt - The user's prompt text
 * @param {object} context - Context information about betting history
 * @returns {Promise<string>} - The model's response
 */
export const callGemmaAPI = async (prompt, context) => {
  try {
    // Format the prompt with context information
    const enhancedPrompt = formatPromptWithContext(prompt, context);
    
    // Call OpenRouter API (OpenAI-compatible endpoint)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin, // Site URL for rankings
        "X-Title": "BetAnalytix Dashboard" // Site title for rankings
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are Gemma, an AI betting assistant for BetAnalytix. Your role is to analyze betting patterns, provide insights on strategies, identify risks, and help users improve their betting ROI. All responses should be factual, objective, and focused on data-driven analysis. Never encourage reckless gambling behavior. Always emphasize responsible betting practices and bankroll management."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Gemma API:", error);
    throw new Error("Failed to get response from Gemma AI. Please try again later.");
  }
};

/**
 * Format the user prompt with betting context for more relevant responses
 * @param {string} prompt - The user's original prompt
 * @param {object} context - Betting history and statistics
 * @returns {string} - Enhanced prompt with context
 */
const formatPromptWithContext = (prompt, context) => {
  if (!context) return prompt;

  // Format context data for inclusion in the prompt
  const formattedContext = `
Here is my betting history context:
- Total bets: ${context.totalBets}
- Win rate: ${(context.winRate * 100).toFixed(1)}%
- Total profit/loss: $${context.profitLoss.toFixed(2)}
- ROI: ${(context.roi * 100).toFixed(1)}%

Sport breakdown:
${context.sportBreakdown.map(sport => 
  `- ${sport.sport}: ${sport.bets} bets, ${(sport.winRate * 100).toFixed(1)}% win rate, $${sport.profit.toFixed(2)} profit`
).join('\n')}

Recent bets:
${context.recentBets.map(bet => 
  `- ${bet.team} vs ${bet.opponent}: ${bet.type}, odds ${bet.odds}, result: ${bet.result}`
).join('\n')}

Based on this betting history, please answer my question: ${prompt}
`;

  return formattedContext;
};

/**
 * Generate sample insights using the Gemma API
 * @returns {Promise<Array>} - Array of insight objects
 */
export const generateInsights = async () => {
  try {
    // Prompts for different types of insights
    const insightPrompts = [
      {
        type: 'strategy',
        prompt: "Analyze my betting history and provide a strategic insight about where I have an edge or value betting opportunity. Focus on specific patterns that show positive expected value."
      },
      {
        type: 'risk',
        prompt: "Analyze my betting history for risk factors. Identify any concerning patterns in my betting behavior, stake sizing, or specific bet types that might lead to losses."
      },
      {
        type: 'trend',
        prompt: "Analyze my betting history and identify a significant trend or pattern that has emerged recently. This could be improvement or decline in specific sports, bet types, or other factors."
      }
    ];
    
    // Call the API for each insight type
    const insights = [];
    let id = 1;
    
    for (const promptData of insightPrompts) {
      // We'd use real context in production
      const mockContext = {
        totalBets: 245,
        winRate: 0.624,
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
          { team: 'Golden State Warriors', opponent: 'Los Angeles Lakers', type: 'Spread', odds: '-110', result: 'win' },
          { team: 'Boston Celtics', opponent: 'Miami Heat', type: 'Moneyline', odds: '-150', result: 'win' },
          { team: 'New York Yankees', opponent: 'Baltimore Orioles', type: 'Over 8.5', odds: '-110', result: 'loss' }
        ]
      };
      
      try {
        // Get response from Gemma API
        const response = await callGemmaAPI(promptData.prompt, mockContext);
        
        // Extract title and content (first paragraph as title, rest as content)
        const paragraphs = response.split('\n\n').filter(p => p.trim());
        const title = paragraphs[0].replace(/^[#\-*•]+\s*/, '').trim();
        const content = paragraphs.slice(1).join('\n\n');
        
        insights.push({
          id: id++,
          type: promptData.type,
          title: title,
          content: content || paragraphs[0], // Use first paragraph as content if no other paragraphs
          timestamp: new Date().toISOString(),
          confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7 and 0.95
          dataPoints: Math.floor(Math.random() * 40) + 10 // Random data points between 10 and 50
        });
      } catch (error) {
        console.error(`Error generating ${promptData.type} insight:`, error);
        // Add fallback insight if API call fails
        insights.push(getFallbackInsight(promptData.type, id++));
      }
    }
    
    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    // Return fallback insights if everything fails
    return [
      getFallbackInsight('strategy', 1),
      getFallbackInsight('risk', 2),
      getFallbackInsight('trend', 3)
    ];
  }
};

/**
 * Get a fallback insight if API calls fail
 * @param {string} type - Insight type (strategy, risk, trend)
 * @param {number} id - Insight ID
 * @returns {object} - Fallback insight object
 */
const getFallbackInsight = (type, id) => {
  const insights = {
    strategy: {
      title: 'Value Betting Opportunity',
      content: 'Based on your recent bets, there appears to be value in MLB underdogs when the line is between +160 and +180. You\'ve had a 64% success rate with these bets, significantly above the breakeven point of 38%.'
    },
    risk: {
      title: 'Bankroll Management Alert',
      content: 'Your stake sizes have increased by 35% in the last month while your win rate has decreased. Consider returning to your previous stake sizing until results stabilize. This pattern has preceded drawdowns in 78% of similar cases in our database.'
    },
    trend: {
      title: 'Profitable Sport Identified',
      content: 'Basketball bets have been your most profitable category with a 12.3% ROI over 35 bets. Consider allocating more of your bankroll to this sport. NBA home favorites after a loss show particularly strong results in your betting history.'
    }
  };
  
  return {
    id,
    type,
    title: insights[type].title,
    content: insights[type].content,
    timestamp: new Date().toISOString(),
    confidence: 0.85,
    dataPoints: 25
  };
}; 