import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { simulateBankrollGrowth } from '../../utils/bettingCalculations';

const BankrollSimulationChart = ({ bets, metrics }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!bets || bets.length < 5) {
      // Not enough data to render a meaningful chart
      return;
    }
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Only include completed bets (win or loss)
    const completedBets = bets.filter(bet => 
      bet.outcome === 'win' || bet.outcome === 'loss'
    );
    
    if (completedBets.length < 5) {
      return; // Not enough data points
    }
    
    // Simulate bankroll growth with different staking methods
    const initialBankroll = 1000; // Start with $1000
    const kellyFraction = 0.5; // Use half Kelly for safety
    
    const simulation = simulateBankrollGrowth(
      completedBets,
      initialBankroll,
      kellyFraction
    );
    
    if (simulation.dates.length === 0) {
      return; // No data to display
    }
    
    // Prepare data for chart
    const flatData = simulation.dates.map((date, i) => ({
      date,
      value: simulation.flatStake[i],
      type: 'Flat (2%)'
    }));
    
    const percentageData = simulation.dates.map((date, i) => ({
      date,
      value: simulation.percentageStake[i],
      type: 'Percentage (2%)'
    }));
    
    const kellyData = simulation.dates.map((date, i) => ({
      date,
      value: simulation.kellyStake[i],
      type: 'Half Kelly'
    }));
    
    const chartData = [...flatData, ...percentageData, ...kellyData];
    
    // Set up dimensions
    const margin = { top: 20, right: 80, bottom: 30, left: 60 };
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
    const x = d3.scaleTime()
      .domain(d3.extent(simulation.dates))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max([
          d3.max(simulation.flatStake),
          d3.max(simulation.percentageStake),
          d3.max(simulation.kellyStake)
        ]) * 1.1
      ])
      .range([height, 0]);
    
    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(['Flat (2%)', 'Percentage (2%)', 'Half Kelly'])
      .range(['#448aff', '#b388ff', '#00e676']);
    
    // Create axes
    const xAxis = d3.axisBottom(x)
      .ticks(5)
      .tickFormat(d3.timeFormat('%b %d'));
    
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `$${d.toFixed(0)}`);
    
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
    
    // Create line generator
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    // Group data by staking method
    const groupedData = d3.group(chartData, d => d.type);
    
    // Add lines for each staking method
    groupedData.forEach((values, key) => {
      svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', color(key))
        .attr('stroke-width', 2)
        .attr('d', line);
    });
    
    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 10},10)`);
    
    const stakingMethods = ['Flat (2%)', 'Percentage (2%)', 'Half Kelly'];
    
    stakingMethods.forEach((method, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0,${i * 20})`);
      
      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(method));
      
      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 9)
        .attr('text-anchor', 'start')
        .style('fill', '#b3b3b3')
        .style('font-size', '12px')
        .text(method);
    });
    
    // Add initial bankroll line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(initialBankroll))
      .attr('y2', y(initialBankroll))
      .style('stroke', '#2c2c2c')
      .style('stroke-dasharray', '3,3');
    
    svg.append('text')
      .attr('x', 5)
      .attr('y', y(initialBankroll) - 5)
      .style('fill', '#b3b3b3')
      .style('font-size', '10px')
      .text(`Initial: $${initialBankroll}`);
    
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
    
    // Add interactive overlay
    const bisect = d3.bisector(d => d.date).left;
    
    // Create a group for the overlay and vertical line
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    // Add vertical line
    focus.append('line')
      .attr('class', 'tooltip-line')
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#f5f5f5')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '3,3');
    
    // Add circles for each line
    stakingMethods.forEach(method => {
      focus.append('circle')
        .attr('class', `circle-${method.replace(/\s+/g, '-').toLowerCase()}`)
        .attr('r', 5)
        .style('fill', color(method))
        .style('stroke', '#1e1e1e')
        .style('stroke-width', 1.5);
    });
    
    // Add overlay rectangle for mouse tracking
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('mousemove', function(event) {
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisect(flatData, x0, 1);
        
        if (i >= flatData.length) return;
        
        const d0 = flatData[i - 1];
        const d1 = flatData[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        
        const xPos = x(d.date);
        
        // Update vertical line position
        focus.select('.tooltip-line')
          .attr('x1', xPos)
          .attr('x2', xPos);
        
        // Update circle positions
        const flatValue = flatData.find(item => item.date === d.date);
        const percentageValue = percentageData.find(item => item.date === d.date);
        const kellyValue = kellyData.find(item => item.date === d.date);
        
        focus.select('.circle-flat-2')
          .attr('cx', xPos)
          .attr('cy', y(flatValue.value));
        
        focus.select('.circle-percentage-2')
          .attr('cx', xPos)
          .attr('cy', y(percentageValue.value));
        
        focus.select('.circle-half-kelly')
          .attr('cx', xPos)
          .attr('cy', y(kellyValue.value));
        
        // Update tooltip
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        
        tooltip.html(`
          <div>
            <strong>Date:</strong> ${d.date.toLocaleDateString()}
            <br/>
            <strong>Flat (2%):</strong> ${formatCurrency(flatValue.value)}
            <br/>
            <strong>Percentage (2%):</strong> ${formatCurrency(percentageValue.value)}
            <br/>
            <strong>Half Kelly:</strong> ${formatCurrency(kellyValue.value)}
          </div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      });
    
  }, [bets, metrics]);
  
  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div ref={chartRef} style="width: 100%; height: 100%;">
      {(!bets || bets.length < 5) && (
        <div class="chart-placeholder"></div>
      )}
    </div>
  );
};

export default BankrollSimulationChart; 