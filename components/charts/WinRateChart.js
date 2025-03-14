import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { groupBetsByOddsRange, calculateWinRate } from '../../utils/bettingCalculations';

const WinRateChart = ({ bets, sportFilter }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!bets || bets.length < 3) {
      // Not enough data to render a meaningful chart
      return;
    }
    
    // Filter bets by sport if needed
    const filteredBets = sportFilter !== 'all' 
      ? bets.filter(bet => bet.sport === sportFilter)
      : bets;
    
    // Only include completed bets (win or loss)
    const completedBets = filteredBets.filter(bet => 
      bet.outcome === 'win' || bet.outcome === 'loss'
    );
    
    if (completedBets.length < 3) {
      return; // Not enough data points
    }
    
    // Group bets by odds range
    const oddsRanges = groupBetsByOddsRange(completedBets);
    
    // Calculate win rate for each odds range
    const chartData = Object.entries(oddsRanges).map(([range, rangeBets]) => {
      const winRate = calculateWinRate(rangeBets);
      const avgOdds = rangeBets.reduce((sum, bet) => sum + bet.odds, 0) / rangeBets.length;
      
      return {
        range,
        winRate,
        avgOdds,
        count: rangeBets.length
      };
    }).filter(d => d.count > 0); // Only include ranges with bets
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    if (chartData.length === 0) {
      return; // No data to display
    }
    
    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleLinear()
      .domain([1, d3.max(chartData, d => d.avgOdds) * 1.1])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    
    const radius = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count)])
      .range([5, 20]);
    
    // Create axes
    const xAxis = d3.axisBottom(x)
      .ticks(5);
    
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${(d * 100).toFixed(0)}%`);
    
    // Add axes to chart
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', '#b3b3b3');
    
    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('fill', '#b3b3b3');
    
    // Style the axes
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#2c2c2c');
    
    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('fill', '#b3b3b3')
      .text('Average Odds');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('fill', '#b3b3b3')
      .text('Win Rate');
    
    // Add reference line for break-even win rate
    const breakEvenLine = svg.append('g');
    
    // Function to calculate break-even win rate based on odds
    const breakEvenWinRate = odds => 1 / odds;
    
    // Create line data points
    const lineData = [];
    for (let odds = 1.1; odds <= d3.max(chartData, d => d.avgOdds) * 1.1; odds += 0.1) {
      lineData.push({
        odds,
        winRate: breakEvenWinRate(odds)
      });
    }
    
    // Create line generator
    const line = d3.line()
      .x(d => x(d.odds))
      .y(d => y(d.winRate))
      .curve(d3.curveMonotoneX);
    
    // Add the break-even line
    breakEvenLine.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', '#757575')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('d', line);
    
    // Add break-even label
    breakEvenLine.append('text')
      .attr('x', x(lineData[lineData.length - 1].odds) - 80)
      .attr('y', y(lineData[lineData.length - 1].winRate) - 10)
      .attr('text-anchor', 'start')
      .style('fill', '#757575')
      .style('font-size', '10px')
      .text('Break-even win rate');
    
    // Add data points
    const points = svg.selectAll('.data-point')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => x(d.avgOdds))
      .attr('cy', d => y(d.winRate))
      .attr('r', d => radius(d.count))
      .attr('fill', d => {
        // Color based on whether it's above or below break-even
        const breakEven = breakEvenWinRate(d.avgOdds);
        return d.winRate > breakEven ? 'rgba(0, 230, 118, 0.7)' : 'rgba(255, 23, 68, 0.7)';
      })
      .attr('stroke', '#1e1e1e')
      .attr('stroke-width', 1);
    
    // Add tooltip
    const tooltip = d3.select(chartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(37, 37, 37, 0.9)')
      .style('color', '#f5f5f5')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 10);
    
    // Add interactivity
    points.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke-width', 2);
      
      const breakEven = breakEvenWinRate(d.avgOdds);
      const profitMargin = (d.winRate - breakEven) * 100;
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
      tooltip.html(`
        <div>
          <strong>Odds Range:</strong> ${d.range}
          <br/>
          <strong>Win Rate:</strong> ${(d.winRate * 100).toFixed(1)}%
          <br/>
          <strong>Break-even:</strong> ${(breakEven * 100).toFixed(1)}%
          <br/>
          <strong>Margin:</strong> ${profitMargin >= 0 ? '+' : ''}${profitMargin.toFixed(1)}%
          <br/>
          <strong>Sample Size:</strong> ${d.count} bets
        </div>
      `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr('stroke-width', 1);
      
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
    
  }, [bets, sportFilter]);
  
  return (
    <div ref={chartRef} style="width: 100%; height: 100%;">
      {(!bets || bets.length < 3) && (
        <div class="chart-placeholder"></div>
      )}
    </div>
  );
};

export default WinRateChart; 