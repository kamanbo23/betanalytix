import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';

const RiskGaugeChart = ({ sharpeRatio }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height + margin.top})`);
    
    // Gauge configuration
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.7;
    
    // Define the gauge scale
    const scale = d3.scaleLinear()
      .domain([-1, 0, 1, 2, 3])
      .range([-Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2]);
    
    // Create the gauge arc
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    // Create the colored segments
    const segments = [
      { name: 'Poor', startValue: -1, endValue: 0, color: '#ff1744' },
      { name: 'Average', startValue: 0, endValue: 1, color: '#ffc107' },
      { name: 'Good', startValue: 1, endValue: 2, color: '#64dd17' },
      { name: 'Excellent', startValue: 2, endValue: 3, color: '#00e676' }
    ];
    
    // Add the colored segments
    segments.forEach(segment => {
      const segmentArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .startAngle(scale(segment.startValue))
        .endAngle(scale(segment.endValue));
      
      svg.append('path')
        .attr('d', segmentArc)
        .attr('fill', segment.color)
        .attr('opacity', 0.7);
      
      // Add segment labels
      const labelAngle = scale((segment.startValue + segment.endValue) / 2);
      const labelRadius = radius + 15;
      const x = Math.sin(labelAngle) * labelRadius;
      const y = -Math.cos(labelAngle) * labelRadius;
      
      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '10px')
        .style('fill', '#b3b3b3')
        .text(segment.name);
    });
    
    // Add the gauge outline
    svg.append('path')
      .attr('d', arc)
      .attr('fill', 'none')
      .attr('stroke', '#2c2c2c')
      .attr('stroke-width', 1);
    
    // Add tick marks
    const ticks = [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
    
    ticks.forEach(tick => {
      const tickAngle = scale(tick);
      const innerPoint = {
        x: Math.sin(tickAngle) * innerRadius,
        y: -Math.cos(tickAngle) * innerRadius
      };
      const outerPoint = {
        x: Math.sin(tickAngle) * (radius + 5),
        y: -Math.cos(tickAngle) * (radius + 5)
      };
      
      svg.append('line')
        .attr('x1', innerPoint.x)
        .attr('y1', innerPoint.y)
        .attr('x2', outerPoint.x)
        .attr('y2', outerPoint.y)
        .attr('stroke', '#2c2c2c')
        .attr('stroke-width', 1);
      
      // Add tick labels for main ticks
      if (Number.isInteger(tick)) {
        svg.append('text')
          .attr('x', Math.sin(tickAngle) * (radius + 20))
          .attr('y', -Math.cos(tickAngle) * (radius + 20))
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .style('font-size', '10px')
          .style('fill', '#b3b3b3')
          .text(tick);
      }
    });
    
    // Add the needle
    const needleValue = Math.max(-1, Math.min(3, sharpeRatio));
    const needleAngle = scale(needleValue);
    
    const needleLine = [
      [Math.sin(needleAngle) * (radius - 10), -Math.cos(needleAngle) * (radius - 10)],
      [0, 0]
    ];
    
    svg.append('path')
      .datum(needleLine)
      .attr('d', d3.line())
      .attr('stroke', '#f5f5f5')
      .attr('stroke-width', 2);
    
    // Add needle circle
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', '#f5f5f5');
    
    // Add value text
    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#f5f5f5')
      .text(sharpeRatio.toFixed(2));
    
    // Add title
    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius / 2 - 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#b3b3b3')
      .text('Sharpe Ratio');
    
    // Add description
    const description = getRiskDescription(sharpeRatio);
    
    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius / 2 + 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', description.color)
      .text(description.text);
    
  }, [sharpeRatio]);
  
  // Helper function to get risk description
  const getRiskDescription = (sharpeRatio) => {
    if (sharpeRatio < 0) {
      return { text: 'Underperforming Risk-Free Rate', color: '#ff1744' };
    } else if (sharpeRatio < 1) {
      return { text: 'Below Average Returns', color: '#ffc107' };
    } else if (sharpeRatio < 2) {
      return { text: 'Good Risk-Adjusted Returns', color: '#64dd17' };
    } else {
      return { text: 'Excellent Risk-Adjusted Returns', color: '#00e676' };
    }
  };
  
  return (
    <div ref={chartRef} style="width: 100%; height: 100%;">
      {isNaN(sharpeRatio) && (
        <div class="chart-placeholder"></div>
      )}
    </div>
  );
};

export default RiskGaugeChart; 