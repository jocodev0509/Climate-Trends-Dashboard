import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type ClimateData = {
  region: string;
  year: number;
  co2_level: number;
};

type Props = {
  data: ClimateData[];
};

export default function CO2BarChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 70, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group data by region + year and sum CO2 levels if multiple entries exist
    const nested = d3.rollups(
      data,
      (v) => d3.sum(v, (d) => d.co2_level),
      (d) => `${d.region} (${d.year})`
    );

    const x = d3
      .scaleBand()
      .domain(nested.map(([key]) => key))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(nested, ([, value]) => value)! * 1.1])
      .nice()
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(nested)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', ([key]) => x(key)!)
      .attr('width', x.bandwidth())
      .attr('y', ([, value]) => y(value))
      .attr('height', ([, value]) => height - y(value))
      .attr('fill', '#db4c3f');
  }, [data]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">CO₂ Levels by Region/Year</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
