import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type ClimateData = {
  year: number;
  precipitation: number;
};

type Props = {
  data: ClimateData[];
};

export default function PrecipitationAreaChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.precipitation)! * 1.1])
      .nice()
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    g.append('g').call(d3.axisLeft(y));

    const area = d3
      .area<ClimateData>()
      .x((d) => x(d.year))
      .y0(height)
      .y1((d) => y(d.precipitation));

    g.append('path')
      .datum(data)
      .attr('fill', '#6b7280')
      .attr('opacity', 0.5)
      .attr('d', area);
  }, [data]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Precipitation by Year</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
