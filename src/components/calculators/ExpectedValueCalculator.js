import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { animateValue } from '../../utils/animationUtils';

const ExpectedValueCalculator = () => {
  // State for calculator inputs
  const [odds, setOdds] = useState('2.00');
  const [probability, setProbability] = useState('45');
  const [stakeAmount, setStakeAmount] = useState('100');
  
  // State for calculation results
  const [results, setResults] = useState({
    expectedValue: 0,
    potentialProfit: 0,
    potentialReturn: 0,
    breakEvenProbability: 0,
    edgePercentage: 0,
    recommendation: ''
  });
  
  // References for animation targets
  const evValueRef = useRef(null);
  const edgeValueRef = useRef(null);
  
  // Calculate expected value whenever inputs change
  useEffect(() => {
    calculateExpectedValue();
  }, [odds, probability, stakeAmount]);
  
  // Animate new results when they change
  useEffect(() => {
    if (evValueRef.current) {
      animateValue(
        evValueRef.current, 
        0, 
        results.expectedValue, 
        800, 
        '$', 
        '', 
        2
      );
    }
    
    if (edgeValueRef.current) {
      animateValue(
        edgeValueRef.current, 
        0, 
        results.edgePercentage, 
        800, 
        '', 
        '%', 
        2
      );
    }
  }, [results]);
  
  // Calculate expected value and related metrics
  const calculateExpectedValue = () => {
    // Parse input values
    const oddsValue = parseFloat(odds);
    const probValue = parseFloat(probability) / 100;
    const stake = parseFloat(stakeAmount);
    
    // Validate inputs
    if (isNaN(oddsValue) || isNaN(probValue) || isNaN(stake) || 
        oddsValue <= 0 || probValue <= 0 || probValue > 1 || stake <= 0) {
      return;
    }
    
    // Calculate potential profit and return
    const potentialProfit = stake * (oddsValue - 1);
    const potentialReturn = stake * oddsValue;
    
    // Calculate break-even probability
    const breakEvenProb = 1 / oddsValue;
    
    // Calculate expected value
    const winEV = probValue * potentialProfit;
    const loseEV = (1 - probValue) * (-stake);
    const expectedValue = winEV + loseEV;
    
    // Calculate edge percentage
    const edge = probValue - breakEvenProb;
    const edgePercentage = edge * 100;
    
    // Generate recommendation
    let recommendation = '';
    if (edgePercentage > 5) {
      recommendation = 'Strong value - consider a larger bet';
    } else if (edgePercentage > 2) {
      recommendation = 'Good value - worth betting';
    } else if (edgePercentage > 0) {
      recommendation = 'Slight value - proceed with caution';
    } else if (edgePercentage > -3) {
      recommendation = 'No value - avoid this bet';
    } else {
      recommendation = 'Negative value - definitely avoid';
    }
    
    // Update results
    setResults({
      expectedValue,
      potentialProfit,
      potentialReturn,
      breakEvenProbability: breakEvenProb * 100,
      edgePercentage,
      recommendation
    });
  };
  
  // Handle input changes
  const handleOddsChange = (e) => {
    setOdds(e.target.value);
  };
  
  const handleProbabilityChange = (e) => {
    // Limit to 0-100
    const value = Math.min(100, Math.max(0, e.target.value));
    setProbability(value);
  };
  
  const handleStakeChange = (e) => {
    setStakeAmount(e.target.value);
  };
  
  // Determine result color based on expected value
  const getResultColor = () => {
    if (results.expectedValue > 0) {
      return 'text-profit';
    } else if (results.expectedValue < 0) {
      return 'text-loss';
    }
    return '';
  };
  
  // Get edge color
  const getEdgeColor = () => {
    if (results.edgePercentage > 2) {
      return 'text-profit';
    } else if (results.edgePercentage < 0) {
      return 'text-loss';
    }
    return '';
  };
  
  return (
    <div class="calculator-container glass-dark slide-in-up">
      <h3 class="fade-in">Expected Value Calculator</h3>
      <p class="calculator-description slide-in-up delay-100">
        Calculate the expected value of a bet based on your estimated true probability and the odds offered.
      </p>
      
      <div class="calculator-form">
        <div class="form-group slide-in-up delay-200">
          <label for="oddsInput">Decimal Odds</label>
          <input
            id="oddsInput"
            type="number"
            step="0.01"
            min="1.01"
            value={odds}
            onInput={handleOddsChange}
          />
        </div>
        
        <div class="form-group slide-in-up delay-300">
          <label for="probInput">Your Estimated Win Probability (%)</label>
          <input
            id="probInput"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={probability}
            onInput={handleProbabilityChange}
          />
        </div>
        
        <div class="form-group slide-in-up delay-400">
          <label for="stakeInput">Stake Amount</label>
          <input
            id="stakeInput"
            type="number"
            step="1"
            min="1"
            value={stakeAmount}
            onInput={handleStakeChange}
          />
        </div>
      </div>
      
      <div class="results-grid slide-in-up delay-500">
        <div class="result-item">
          <div class="result-label">Expected Value</div>
          <div class={`result-value ${getResultColor()}`} ref={evValueRef}>
            ${results.expectedValue.toFixed(2)}
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-label">Your Edge</div>
          <div class={`result-value ${getEdgeColor()}`} ref={edgeValueRef}>
            {results.edgePercentage.toFixed(2)}%
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-label">Break-Even Probability</div>
          <div class="result-value">
            {results.breakEvenProbability.toFixed(2)}%
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-label">Potential Profit</div>
          <div class="result-value">
            ${results.potentialProfit.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div class="info-box glass slide-in-up delay-600">
        <h4>Recommendation</h4>
        <p>{results.recommendation}</p>
        <div class="ev-gauge">
          <div 
            class="ev-gauge-fill" 
            style={{ 
              width: `${Math.min(100, Math.max(0, results.edgePercentage + 10) * 5)}%`,
              backgroundColor: getEdgeColor() === 'text-profit' ? 'var(--color-accent-profit)' : 
                              getEdgeColor() === 'text-loss' ? 'var(--color-accent-loss)' : 
                              'var(--color-accent-secondary)'
            }}
          ></div>
        </div>
      </div>
      
      <div class="info-box glass-dark slide-in-up delay-700">
        <h4>What is Expected Value?</h4>
        <p>
          Expected Value (EV) is the average amount you can expect to win or lose per bet if you were to place the same bet many times.
          A positive EV means the bet has value, while a negative EV means the bookmaker has the edge.
        </p>
        <p>
          <strong>Formula:</strong> EV = (Probability × Potential Profit) - ((1 - Probability) × Stake)
        </p>
      </div>
    </div>
  );
};

export default ExpectedValueCalculator; 