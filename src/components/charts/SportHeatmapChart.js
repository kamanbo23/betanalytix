import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import { groupBetsBy, calculateROI } from '../../utils/bettingCalculations';

const SportHeatmapChart = ({ bets }) => {
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
    
    // Group bets by sport
    const sportGroups = groupBetsBy(completedBets, 'sport');
    
    // Define odds ranges
    const oddsRanges = [
      { name: '1.01-1.50', min: 1.01, max: 1.5 },
      { name: '1.51-2.00', min: 1.51, max: 2.0 },
      { name: '2.01-3.00', min: 2.01, max: 3.0 },
      { name: '3.01-5.00', min: 3.01, max: 5.0 },
      { name: '5.01+', min: 5.01, max: Infinity }
    ];
    
    // Prepare data for heatmap
    const heatmapData = [];
    
    Object.entries(sportGroups).forEach(([sport, sportBets]) => {
      // Only include sports with at least 3 bets
      if (sportBets.length < 3) return;
      
      oddsRanges.forEach(range => {
        // Filter bets by odds range
        const rangeBets = sportBets.filter(bet => 
          bet.odds >= range.min && bet.odds <= range.max
        );
        
        // Only include cells with at least 2 bets
        if (rangeBets.length >= 2) {
          const roi = calculateROI(rangeBets);
          
          heatmapData.push({
            sport,
            oddsRange: range.name,
            roi,
            count: rangeBets.length
          });
        }
      });
    });
    
    if (heatmapData.length === 0) {
      return; // No data to display
    }
    
    // Get unique sports and sort alphabetically
    const sports = [...new Set(heatmapData.map(d => d.sport))].sort();
    
    // Get unique odds ranges in the correct order
    const ranges = oddsRanges.map(r => r.name);
    
    // Set up dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 100 };
    const cellSize = 50;
    const width = margin.left + margin.right + cellSize * ranges.length;
    const height = margin.top + margin.bottom + cellSize * sports.length;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create color scale for ROI
    const colorScale = d3.scaleLinear()
      .domain([-0.5, 0, 0.5])
      .range(['#ff1744', '#2c2c2c', '#00e676'])
      .clamp(true);
    
    // Create scales for positioning
    const x = d3.scaleBand()
      .domain(ranges)
      .range([0, cellSize * ranges.length])
      .padding(0.05);
    
    const y = d3.scaleBand()
      .domain(sports)
      .range([0, cellSize * sports.length])
      .padding(0.05);
    
    // Add x-axis (odds ranges)
    svg.append('g')
      .attr('transform', `translate(0,${cellSize * sports.length})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '0.5em')
      .attr('dy', '0.5em')
      .attr('transform', 'rotate(45)')
      .style('fill', '#b3b3b3');
    
    // Add x-axis label
    svg.append('text')
      .attr('x', (cellSize * ranges.length) / 2)
      .attr('y', cellSize * sports.length + 45)
      .attr('text-anchor', 'middle')
      .style('fill', '#b3b3b3')
      .text('Odds Range');
    
    // Add y-axis (sports)
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#b3b3b3');
    
    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(cellSize * sports.length) / 2)
      .attr('y', -70)
      .attr('text-anchor', 'middle')
      .style('fill', '#b3b3b3')
      .text('Sport');
    
    // Add title
    svg.append('text')
      .attr('x', (cellSize * ranges.length) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('fill', '#f5f5f5')
      .style('font-size', '14px')
      .text('ROI by Sport and Odds Range');
    
    // Create a group for each cell
    const cells = svg.selectAll('.cell')
      .data(heatmapData)
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('transform', d => `translate(${x(d.oddsRange)},${y(d.sport)})`);
    
    // Add rectangle for each cell
    cells.append('rect')
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => colorScale(d.roi))
      .attr('stroke', '#1e1e1e')
      .attr('stroke-width', 1);
    
    // Add ROI text to each cell
    cells.append('text')
      .attr('x', x.bandwidth() / 2)
      .attr('y', y.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', d => Math.abs(d.roi) > 0.3 ? '#f5f5f5' : '#f5f5f5')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => `${(d.roi * 100).toFixed(0)}%`);
    
    // Add sample size text to each cell
    cells.append('text')
      .attr('x', x.bandwidth() / 2)
      .attr('y', y.bandwidth() - 8)
      .attr('text-anchor', 'middle')
      .style('fill', '#b3b3b3')
      .style('font-size', '9px')
      .text(d => `n=${d.count}`);
    
    // Add legend
    const legendWidth = 200;
    const legendHeight = 15;
    
    const legendScale = d3.scaleLinear()
      .domain([-0.5, 0, 0.5])
      .range([0, legendWidth / 2, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
      .tickValues([-0.5, -0.25, 0, 0.25, 0.5])
      .tickFormat(d => `${(d * 100).toFixed(0)}%`);
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${(cellSize * ranges.length - legendWidth) / 2},${-25})`);
    
    // Create gradient for legend
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'roi-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(-0.5));
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', colorScale(0));
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(0.5));
    
    // Add colored rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#roi-gradient)');
    
    // Add legend axis
    legend.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis)
      .selectAll('text')
      .style('fill', '#b3b3b3')
      .style('font-size', '9px');
    
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
    cells.on('mouseover', function(event, d) {
      d3.select(this).select('rect')
        .transition()
        .duration(200)
        .attr('stroke', '#f5f5f5')
        .attr('stroke-width', 2);
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
      tooltip.html(`
        <div>
          <strong>Sport:</strong> ${d.sport}
          <br/>
          <strong>Odds Range:</strong> ${d.oddsRange}
          <br/>
          <strong>ROI:</strong> ${(d.roi * 100).toFixed(1)}%
          <br/>
          <strong>Sample Size:</strong> ${d.count} bets
        </div>
      `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', function() {
      d3.select(this).select('rect')
        .transition()
        .duration(500)
        .attr('stroke', '#1e1e1e')
        .attr('stroke-width', 1);
      
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
    
  }, [bets]);
  
  return (
    <div ref={chartRef} style="width: 100%; height: 100%;">
      {(!bets || bets.length < 5) && (
        <div class="chart-placeholder"></div>
      )}
    </div>
  );
};

export default SportHeatmapChart; 