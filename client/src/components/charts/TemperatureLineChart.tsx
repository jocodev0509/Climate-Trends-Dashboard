import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type ClimateData = {
  year: number;
  avg_temp: number;
};

type Props = {
  data: ClimateData[];
  width?: number;
  height?: number;
};

export default function TemperatureLineChart({ data, width = 500, height = 500 }: Props) {
  const svgRef = useRef(null);

  useEffect(() => {
    // 1. Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 2. Select the SVG element and create a group for the chart
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart elements on re-render

    const chartGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- NEW: Group the data by region ---
    const dataByRegion = Array.from(
      d3.group(data, (d) => d.region) // {Link: This groups the raw data by the 'region' key https://github.com/d3/d3-array/blob/main/README.md#group}
    ); // Convert the Map to an array of [key, values] pairs

    // --- NEW: Get all unique region names ---
    const allRegions = Array.from(new Set(data.map((d) => d.region)));

    // 3. Define scales for x (date) and y (temperature)
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.avg_temp) - 1,
        d3.max(data, (d) => d.avg_temp) + 1,
      ])
      .range([chartHeight, 0]);

    // --- NEW: Define a color scale for regions ---
    const colorScale = d3
      .scaleOrdinal()
      .domain(allRegions)
      .range(d3.schemeCategory10); // {Link: Use a categorical color scheme, mapping each region to a distinct color https://d3js.org/d3-scale-chromatic/categorical}

    // 4. Create the line generator
    const line = d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.avg_temp));

    // 5. Add a line path for each region
    chartGroup
      .selectAll(".region-line") // Select all elements with class "region-line"
      .data(dataByRegion) // Bind the grouped data (each element is [regionName, dataArray])
      .join("path") // Join the data to path elements
      .attr("class", (d) => `region-line ${d[0].replace(/\s+/g, "-")}`) // Add class for styling, remove spaces from region name
      .attr("d", (d) => line(d[1])) // Pass the data array (d[1]) for the current region to the line generator
      .attr("fill", "none")
      .attr("stroke", (d) => colorScale(d[0])) // Use the color scale to get the color for the current region (d[0])
      .attr("stroke-width", 2);

    // 6. Add and style the x-axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

    // 7. Add and style the y-axis
    chartGroup.append("g").call(d3.axisLeft(yScale));

    // 8. Add axis labels
    chartGroup
      .append("text")
      .attr(
        "transform",
        `translate(${chartWidth / 2},${chartHeight + margin.bottom / 2})`
      )
      .style("text-anchor", "middle")
      .text("Year");

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - chartHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Temperature (°C)");

    // --- NEW: Add a legend ---
    const legend = chartGroup
      .append("g")
      .attr("transform", `translate(${chartWidth - 100}, ${0})`) // Position the legend
      .selectAll("g")
      .data(allRegions)
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Position each legend item

    legend
      .append("rect") // Color swatch
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => colorScale(d));

    legend
      .append("text") // Region name
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
