import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { calculateCumulativeProfitOverTime } from '../../utils/bettingCalculations';

const ProfitChart = ({ bets, timeRange, sportFilter }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!bets || bets.length < 2) {
      // Not enough data to render a meaningful chart
      return;
    }
    
    // Filter bets based on time range and sport
    let filteredBets = [...bets];
    
    if (sportFilter !== 'all') {
      filteredBets = filteredBets.filter(bet => bet.sport === sportFilter);
    }
    
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (timeRange) {
        case '7days':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filteredBets = filteredBets.filter(bet => new Date(bet.timestamp) >= cutoffDate);
      }
    }
    
    // Calculate profit over time
    const profitData = calculateCumulativeProfitOverTime(filteredBets);
    
    if (profitData.length < 2) {
      return; // Not enough data points
    }
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
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
      .domain(d3.extent(profitData, d => d.date))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([
        d3.min(profitData, d => d.profit) < 0 ? d3.min(profitData, d => d.profit) * 1.1 : 0,
        d3.max(profitData, d => d.profit) * 1.1
      ])
      .range([height, 0]);
    
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
      .y(d => y(d.profit))
      .curve(d3.curveMonotoneX);
    
    // Add zero line if we have negative values
    if (d3.min(profitData, d => d.profit) < 0) {
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .style('stroke', '#2c2c2c')
        .style('stroke-dasharray', '3,3');
    }
    
    // Add the line path
    const path = svg.append('path')
      .datum(profitData)
      .attr('fill', 'none')
      .attr('stroke', d => profitData[profitData.length - 1].profit >= 0 ? '#00e676' : '#ff1744')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add gradient area under the line
    const area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.profit))
      .curve(d3.curveMonotoneX);
    
    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'profit-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', profitData[profitData.length - 1].profit >= 0 ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 23, 68, 0.3)');
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(0, 0, 0, 0)');
    
    // Add the area
    svg.append('path')
      .datum(profitData)
      .attr('fill', 'url(#profit-gradient)')
      .attr('d', area);
    
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
    
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', function(event) {
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisect(profitData, x0, 1);
        const d0 = profitData[i - 1];
        const d1 = profitData[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        
        tooltip.html(`
          <div>
            <strong>Date:</strong> ${d.date.toLocaleDateString()}
            <br/>
            <strong>Profit:</strong> ${d.profit >= 0 ? '+' : ''}$${d.profit.toFixed(2)}
          </div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
  }, [bets, timeRange, sportFilter]);
  
  return (
    <div ref={chartRef} style="width: 100%; height: 100%;">
      {(!bets || bets.length < 2) && (
        <div class="chart-placeholder"></div>
      )}
    </div>
  );
};

export default ProfitChart; 