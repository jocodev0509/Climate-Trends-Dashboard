import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ChartData } from '../../types';

interface LineChartProps {
  data: ChartData[];
  title: string;
  xLabel: string;
  yLabel: string;
  color?: string;
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  xLabel,
  yLabel,
  color = '#3B82F6',
  width = 800,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;
    console.log(data);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x as number) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Line generator
    const line = d3
      .line<ChartData>()
      .x(d => xScale(d.x as number))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(xLabel);

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(yLabel);

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title);

    // Add line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.x as number))
      .attr('cy', d => yScale(d.y))
      .attr('r', 3)
      .attr('fill', color)
      .on('mouseover', function(event, d) {
        // Tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(`${xLabel}: ${d.x}<br/>${yLabel}: ${d.y.toFixed(1)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.selectAll('.tooltip').remove();
      });

  }, [data, title, xLabel, yLabel, color, width, height]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
};