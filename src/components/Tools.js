import React, { useState, useEffect } from 'react';

// Enhanced Tools component with improved UI and functionality
const Tools = () => {
  const [activeCalculator, setActiveCalculator] = useState('odds');
  const [oddsFormat, setOddsFormat] = useState('decimal');
  const [values, setValues] = useState({
    // Odds converter
    oddsValue: '',
    // Expected value
    probability: 50,
    payoutOdds: 2.0,
    // Kelly criterion
    bankroll: 1000,
    kellyWinProb: 55,
    kellyOdds: 2.0,
    // Parlay
    parlayLegs: [{ odds: '2.0', probability: '50' }],
    // Hedge
    originalBet: 100,
    originalOdds: 2.0,
    hedgeOdds: 1.5
  });
  
  // Animation state
  const [isCalculatorChanging, setIsCalculatorChanging] = useState(false);
  const [calculatorClasses, setCalculatorClasses] = useState('');
  
  // Handle calculator tab changes with smooth transitions
  const handleCalculatorChange = (calculator) => {
    if (activeCalculator === calculator) return;
    
    setIsCalculatorChanging(true);
    setCalculatorClasses('calculator-exit');
    
    setTimeout(() => {
      setActiveCalculator(calculator);
      setCalculatorClasses('calculator-enter');
      
      setTimeout(() => {
        setCalculatorClasses('');
        setIsCalculatorChanging(false);
      }, 500);
    }, 300);
  };

  const handleInputChange = (field, value) => {
    setValues({
      ...values,
      [field]: value
    });
  };
  
  // Handle parlay leg changes
  const handleParlayLegChange = (index, field, value) => {
    const updatedLegs = [...values.parlayLegs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: value
    };
    
    setValues({
      ...values,
      parlayLegs: updatedLegs
    });
  };
  
  // Add a new parlay leg
  const addParlayLeg = () => {
    setValues({
      ...values,
      parlayLegs: [
        ...values.parlayLegs,
        { odds: '', probability: '' }
      ]
    });
  };
  
  // Remove a parlay leg
  const removeParlayLeg = (index) => {
    if (values.parlayLegs.length <= 1) return;
    
    const updatedLegs = [...values.parlayLegs];
    updatedLegs.splice(index, 1);
    
    setValues({
      ...values,
      parlayLegs: updatedLegs
    });
  };

  const convertOdds = (value, from, to) => {
    if (!value) return '';
    
    let decimal;
    
    // Convert input to decimal first
    if (from === 'decimal') {
      decimal = parseFloat(value);
    } else if (from === 'american') {
      if (value > 0) {
        decimal = (value / 100) + 1;
      } else {
        decimal = (100 / Math.abs(value)) + 1;
      }
    } else if (from === 'fractional') {
      const parts = value.split('/');
      if (parts.length === 2) {
        decimal = (parseFloat(parts[0]) / parseFloat(parts[1])) + 1;
      } else {
        return '';
      }
    }
    
    if (isNaN(decimal)) return '';
    
    // Convert decimal to target format
    if (to === 'decimal') {
      return decimal.toFixed(2);
    } else if (to === 'american') {
      if (decimal >= 2.0) {
        return '+' + Math.round((decimal - 1) * 100);
      } else {
        return Math.round(-100 / (decimal - 1)).toString();
      }
    } else if (to === 'fractional') {
      // Simple conversion, not handling simplification of fractions
      const frac = decimal - 1;
      if (Math.abs(frac - Math.round(frac)) < 0.01) {
        return Math.round(frac) + '/1';
      } else {
        const denominator = 100;
        const numerator = Math.round(frac * denominator);
        return numerator + '/' + denominator;
      }
    }
    
    return '';
  };

  const calculateEV = (probability, payoutOdds) => {
    const prob = probability / 100;
    const payout = (payoutOdds - 1);
    const ev = (prob * payout) - ((1 - prob) * 1);
    return (ev * 100).toFixed(2);
  };

  const calculateKelly = (winProb, odds) => {
    const prob = winProb / 100;
    const q = 1 - prob;
    const b = odds - 1;
    
    // Kelly formula: (bp - q) / b
    const fraction = (b * prob - q) / b;
    
    // Return value between 0 and 1
    return Math.max(0, Math.min(1, fraction)).toFixed(4);
  };

  const calculateParlayOdds = (legs) => {
    const filteredLegs = legs.filter(leg => leg.odds && parseFloat(leg.odds) > 0);
    
    if (filteredLegs.length === 0) return 1;
    
    const parlayOdds = filteredLegs.reduce((acc, leg) => {
      return acc * parseFloat(leg.odds);
    }, 1);
    
    return parlayOdds.toFixed(2);
  };

  const calculateHedge = (originalBet, originalOdds, hedgeOdds) => {
    const originalPayout = originalBet * originalOdds;
    const hedgeAmount = originalPayout / hedgeOdds;
    
    return {
      hedgeAmount: hedgeAmount.toFixed(2),
      profit: (originalPayout - originalBet - hedgeAmount).toFixed(2)
    };
  };
  
  // For proper number formatting
  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '-';
    return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="tools-container">
      <h2 className="tools-title">Betting Tools & Calculators</h2>
      <p className="tools-description">
        Powerful calculators to optimize your betting strategy and improve decision making.
      </p>
      
      <div className="calculator-selector">
        <button 
          className={`calc-tab ${activeCalculator === 'odds' ? 'active' : ''}`}
          onClick={() => handleCalculatorChange('odds')}
          disabled={isCalculatorChanging}
        >
          <i className="fas fa-exchange-alt"></i>
          <span>Odds Converter</span>
        </button>
        <button 
          className={`calc-tab ${activeCalculator === 'ev' ? 'active' : ''}`}
          onClick={() => handleCalculatorChange('ev')}
          disabled={isCalculatorChanging}
        >
          <i className="fas fa-balance-scale"></i>
          <span>Expected Value</span>
        </button>
        <button 
          className={`calc-tab ${activeCalculator === 'kelly' ? 'active' : ''}`}
          onClick={() => handleCalculatorChange('kelly')}
          disabled={isCalculatorChanging}
        >
          <i className="fas fa-percentage"></i>
          <span>Kelly Criterion</span>
        </button>
        <button 
          className={`calc-tab ${activeCalculator === 'parlay' ? 'active' : ''}`}
          onClick={() => handleCalculatorChange('parlay')}
          disabled={isCalculatorChanging}
        >
          <i className="fas fa-link"></i>
          <span>Parlay Calculator</span>
        </button>
        <button 
          className={`calc-tab ${activeCalculator === 'hedge' ? 'active' : ''}`}
          onClick={() => handleCalculatorChange('hedge')}
          disabled={isCalculatorChanging}
        >
          <i className="fas fa-shield-alt"></i>
          <span>Hedge Calculator</span>
        </button>
      </div>
      
      <div className={`calculator-container card ${calculatorClasses}`}>
        {activeCalculator === 'odds' && (
          <div className="odds-converter calculator">
            <h3>Odds Converter</h3>
            <div className="calculator-inputs">
              <div className="form-group">
                <label>Enter Odds</label>
                <input
                  type="text"
                  value={values.oddsValue}
                  onChange={(e) => handleInputChange('oddsValue', e.target.value)}
                  placeholder="Enter odds value"
                  className="glass-input"
                />
              </div>
              
              <div className="form-group">
                <label>Format</label>
                <select
                  value={oddsFormat}
                  onChange={(e) => setOddsFormat(e.target.value)}
                  className="glass-input"
                >
                  <option value="decimal">Decimal</option>
                  <option value="american">American</option>
                  <option value="fractional">Fractional</option>
                </select>
              </div>
            </div>
            
            <div className="calculator-results">
              <div className="result-row">
                <div className="result-label">Decimal:</div>
                <div className="result-value highlight">
                  {values.oddsValue ? convertOdds(values.oddsValue, oddsFormat, 'decimal') : '-'}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">American:</div>
                <div className="result-value">
                  {values.oddsValue ? convertOdds(values.oddsValue, oddsFormat, 'american') : '-'}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Fractional:</div>
                <div className="result-value">
                  {values.oddsValue ? convertOdds(values.oddsValue, oddsFormat, 'fractional') : '-'}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Implied Probability:</div>
                <div className="result-value accent">
                  {values.oddsValue && !isNaN(parseFloat(convertOdds(values.oddsValue, oddsFormat, 'decimal'))) 
                    ? (100 / parseFloat(convertOdds(values.oddsValue, oddsFormat, 'decimal'))).toFixed(2) + '%' 
                    : '-'}
                </div>
              </div>
            </div>
            
            <div className="info-box">
              <h4>Using the Odds Converter</h4>
              <p>Enter odds in your preferred format and instantly see conversions to all other formats. This helps compare odds across different sportsbooks and regions.</p>
            </div>
          </div>
        )}
        
        {activeCalculator === 'ev' && (
          <div className="ev-calculator calculator">
            <h3>Expected Value Calculator</h3>
            <div className="calculator-inputs">
              <div className="form-group">
                <label>Your Assessed Probability (%)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={values.probability}
                  onChange={(e) => handleInputChange('probability', e.target.value)}
                  className="glass-input"
                />
              </div>
          
          <div className="form-group">
                <label>Payout Odds (Decimal)</label>
            <input 
              type="number" 
              min="1.01" 
              step="0.01" 
                  value={values.payoutOdds}
                  onChange={(e) => handleInputChange('payoutOdds', e.target.value)}
              className="glass-input"
            />
          </div>
            </div>
            
            <div className="calculator-results">
              <div className="result-row">
                <div className="result-label">Expected Value:</div>
                <div className={`result-value ${parseFloat(calculateEV(values.probability, values.payoutOdds)) > 0 ? 'positive' : 'negative'}`}>
                  {calculateEV(values.probability, values.payoutOdds)}%
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Implied Probability:</div>
                <div className="result-value">
                  {(100 / values.payoutOdds).toFixed(2)}%
                </div>
          </div>
          
              <div className="result-row">
                <div className="result-label">Edge:</div>
                <div className={`result-value ${(values.probability - (100 / values.payoutOdds)) > 0 ? 'positive' : 'negative'}`}>
                  {(values.probability - (100 / values.payoutOdds)).toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="ev-gauge">
              <div 
                className="ev-gauge-fill" 
                style={{ 
                  width: `${Math.min(100, Math.max(0, parseFloat(calculateEV(values.probability, values.payoutOdds)) + 50))}%`,
                  background: parseFloat(calculateEV(values.probability, values.payoutOdds)) > 0 
                    ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.8))' 
                    : 'linear-gradient(90deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.8))'
                }}
              ></div>
            </div>
            
            <div className="info-box">
              <h4>About Expected Value</h4>
              <p>Expected Value (EV) helps determine if a bet offers value. A positive EV means the bet is profitable long-term. Always look for bets where your assessed probability is higher than the implied probability from the odds.</p>
            </div>
          </div>
        )}
        
        {activeCalculator === 'kelly' && (
          <div className="kelly-calculator calculator">
            <h3>Kelly Criterion Calculator</h3>
            <div className="calculator-inputs">
            <div className="form-group">
              <label>Bankroll ($)</label>
              <input 
                type="number" 
                min="1" 
                step="1" 
                  value={values.bankroll}
                  onChange={(e) => handleInputChange('bankroll', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="form-group">
              <label>Win Probability (%)</label>
              <input 
                type="number" 
                min="1" 
                max="99" 
                  value={values.kellyWinProb}
                  onChange={(e) => handleInputChange('kellyWinProb', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="form-group">
              <label>Decimal Odds</label>
              <input 
                type="number" 
                min="1.01" 
                step="0.01" 
                  value={values.kellyOdds}
                  onChange={(e) => handleInputChange('kellyOdds', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          
            <div className="calculator-results">
              <div className="result-row">
                <div className="result-label">Kelly Percentage:</div>
                <div className="result-value highlight">
                  {(parseFloat(calculateKelly(values.kellyWinProb, values.kellyOdds)) * 100).toFixed(2)}%
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Suggested Stake:</div>
                <div className="result-value">
                  ${(values.bankroll * parseFloat(calculateKelly(values.kellyWinProb, values.kellyOdds))).toFixed(2)}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Half Kelly (Conservative):</div>
                <div className="result-value">
                  ${(values.bankroll * parseFloat(calculateKelly(values.kellyWinProb, values.kellyOdds)) / 2).toFixed(2)}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Quarter Kelly (Very Conservative):</div>
                <div className="result-value">
                  ${(values.bankroll * parseFloat(calculateKelly(values.kellyWinProb, values.kellyOdds)) / 4).toFixed(2)}
                </div>
            </div>
            </div>
            
            <div className="info-box">
              <h4>Bankroll Management</h4>
              <p>The Kelly Criterion helps optimize your bet sizing for maximum bankroll growth. Many professional bettors use Half Kelly or Quarter Kelly to reduce volatility while still capturing most of the growth potential.</p>
            </div>
          </div>
        )}
        
        {activeCalculator === 'parlay' && (
          <div className="parlay-calculator calculator">
            <h3>Parlay Calculator</h3>
          
          <div className="parlay-legs">
              {values.parlayLegs.map((leg, index) => (
                <div key={index} className="parlay-leg">
                  <div className="leg-header">
                    <span className="leg-number">Leg {index + 1}</span>
                    <button
                      type="button"
                      className="remove-leg-btn"
                      onClick={() => removeParlayLeg(index)}
                      disabled={values.parlayLegs.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                </div>
                  
                <div className="form-group">
                  <label>Decimal Odds</label>
                  <input 
                    type="number" 
                    min="1.01" 
                    step="0.01" 
                    value={leg.odds}
                      onChange={(e) => handleParlayLegChange(index, 'odds', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Probability (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={leg.probability}
                      onChange={(e) => handleParlayLegChange(index, 'probability', e.target.value)}
                    className="glass-input"
                  />
                  </div>
                </div>
              ))}
              
                <button 
                type="button"
                className="add-leg-btn"
                onClick={addParlayLeg}
              >
                <i className="fas fa-plus"></i> Add Leg
                </button>
              </div>
            
            <div className="calculator-results mt-lg">
              <div className="result-row">
                <div className="result-label">Parlay Odds:</div>
                <div className="result-value highlight">
                  {calculateParlayOdds(values.parlayLegs)}
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">Implied Probability:</div>
                <div className="result-value">
                  {(100 / parseFloat(calculateParlayOdds(values.parlayLegs))).toFixed(2)}%
                </div>
              </div>
              
              <div className="result-row">
                <div className="result-label">True Probability:</div>
                <div className="result-value">
                  {values.parlayLegs
                    .filter(leg => leg.probability && leg.odds)
                    .reduce((acc, leg) => acc * (parseFloat(leg.probability) / 100), 1) * 100
                    .toFixed(2)}%
                </div>
          </div>
          
              <div className="result-row">
                <div className="result-label">Edge:</div>
                <div className={`result-value ${
                  (values.parlayLegs
                    .filter(leg => leg.probability && leg.odds)
                    .reduce((acc, leg) => acc * (parseFloat(leg.probability) / 100), 1) * 100) -
                  (100 / parseFloat(calculateParlayOdds(values.parlayLegs))) > 0 ? 'positive' : 'negative'
                }`}>
                  {(
                    (values.parlayLegs
                      .filter(leg => leg.probability && leg.odds)
                      .reduce((acc, leg) => acc * (parseFloat(leg.probability) / 100), 1) * 100) -
                    (100 / parseFloat(calculateParlayOdds(values.parlayLegs)))
                  ).toFixed(2)}%
                </div>
            </div>
            </div>
            
            <div className="info-box">
              <h4>About Parlays</h4>
              <p>Parlays combine multiple bets for higher potential payouts, but all legs must win. While tempting, most parlays have negative expected value due to compounding vig. Use this calculator to find rare +EV parlay opportunities.</p>
            </div>
          </div>
        )}
        
        {activeCalculator === 'hedge' && (
          <div className="hedge-calculator calculator">
            <h3>Hedge Calculator</h3>
            <div className="calculator-inputs">
            <div className="form-group">
              <label>Original Bet Amount ($)</label>
              <input 
                type="number" 
                min="1" 
                step="1" 
                  value={values.originalBet}
                  onChange={(e) => handleInputChange('originalBet', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="form-group">
                <label>Original Odds (Decimal)</label>
              <input 
                type="number" 
                min="1.01" 
                step="0.01" 
                  value={values.originalOdds}
                  onChange={(e) => handleInputChange('originalOdds', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="form-group">
                <label>Hedge Odds (Decimal)</label>
              <input 
                type="number" 
                min="1.01" 
                step="0.01" 
                  value={values.hedgeOdds}
                  onChange={(e) => handleInputChange('hedgeOdds', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          
            <div className="calculator-results">
              <div className="result-row">
                <div className="result-label">Hedge Bet Amount:</div>
                <div className="result-value highlight">
                  ${formatNumber(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).hedgeAmount)}
            </div>
            </div>
              
              <div className="result-row">
                <div className="result-label">Total Wagered:</div>
                <div className="result-value">
                  ${formatNumber(parseFloat(values.originalBet) + parseFloat(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).hedgeAmount))}
            </div>
          </div>
          
              <div className="result-row">
                <div className="result-label">Guaranteed Profit:</div>
                <div className={`result-value ${parseFloat(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).profit) > 0 ? 'positive' : 'negative'}`}>
                  ${formatNumber(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).profit)}
          </div>
        </div>
              
              <div className="result-row">
                <div className="result-label">Return on Investment:</div>
                <div className={`result-value ${parseFloat(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).profit) > 0 ? 'positive' : 'negative'}`}>
                  {((parseFloat(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).profit) / 
                    (parseFloat(values.originalBet) + parseFloat(calculateHedge(values.originalBet, values.originalOdds, values.hedgeOdds).hedgeAmount))) * 100).toFixed(2)}%
          </div>
      </div>
      </div>
      
            <div className="info-box">
              <h4>Using the Hedge Calculator</h4>
              <p>Hedging allows you to lock in profits or minimize losses by placing a bet on the opposite outcome. This calculator helps you determine the optimal hedge bet amount to guarantee a profit regardless of outcome.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="tools-footer">
        <p className="disclaimer">
          <i className="fas fa-info-circle"></i> These calculators are for informational purposes only. Always verify results and bet responsibly.
        </p>
        
        <a href="#" className="learn-more-link">
          Learn more about betting mathematics <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
};

export default Tools; 