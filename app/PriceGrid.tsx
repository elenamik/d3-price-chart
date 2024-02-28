"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Prices } from "./actions";
import * as d3 from "d3";

// 7 day price chart
// displays 7 day prices
// define x-y axis
// define avg price
// define max, min

const PriceGrid: React.FC<{
  prices?: Prices;

  options?: {
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
  };
}> = ({ prices, options }) => {
  // destructure with default values
  const {
    width = 280,
    height = 200,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 30,
  } = options || {};

  console.log("prices", prices);
  const items = prices ? Object.keys(prices) : [];

  const gx = useRef();
  const gy = useRef();

  const item1 = prices ? prices["untrn"] : ({} as Prices["string"]);

  const times1 = item1.series.map((d) => {
    return new Date(d.time * 1000);
  });

  const values1 = item1.series.map((d) => {
    return d.value;
  });

  const dayCount = useMemo(() => {
    const uniqueDays = new Set();
    times1.forEach(function (date) {
      const day = new Date(date).toISOString().split("T")[0];
      uniqueDays.add(day);
    });
    return uniqueDays.size;
  }, [times1]);

  console.log("times", times1);
  console.log("values", values1);

  //   const x1 = d3.scaleTime().domain(d3.extent(item1.series, d=> new Date(d.time)))
  // const x1 = d3.scaleLinear().domain([0,300]).range([0,300])
  // const y1 = d3.scaleLinear(d3.extent(item1.series, d=>d.value))
  //   const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);

  const xt = d3.scaleTime().domain(d3.extent(times1)).range([0, width]);
  const y1 = d3.scaleLinear().domain(d3.extent(values1)).range([height, 0]);

  //   const line = d3.line((d, i) => xt(i), y1);
  const line = d3
    .line()
    .x((d) => {
        
        console.log('line: x - ',d)
        return xt(new Date(d.time*1000))})
    .y((d) => y1(d.value));

  useEffect(() => {
    d3.select(gx.current).call(
      d3.axisBottom(xt).ticks(dayCount).tickFormat(d3.timeFormat("%m/%d")),
    );
  }, [gx, xt, dayCount]);

  useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(y1));
  }, [gy, y1]);

  if (!prices) {
    return <div>No data to show</div>;
  }

  return (
    <>
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d={line(item1.series)}
        />
        {/* <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g> */}
      </svg>
      {JSON.stringify(prices)}
    </>
  );
};

export default PriceGrid;
