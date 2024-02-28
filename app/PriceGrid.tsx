"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Prices } from "./actions";
import * as d3 from "d3";

const LINE_COLORS = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // olive
    "#17becf"  // cyan
  ];
  

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
    padding?:number
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
    padding= 5
  } = options || {};

  console.log("prices", prices);
  const tokens = prices ? Object.keys(prices) : [];
  const item1 = prices ? prices["untrn"] : ({} as Prices["string"]);
  const series1Formatted = useMemo(() => {
    return item1.series.map((d) => {
      return {
        date: new Date(d.time * 1000),
        value: d.value,
      };
    });
  }, [prices]);

  const dayCount = useMemo(() => {
    const uniqueDays = new Set();
    series1Formatted.forEach(function (d) {
      const day = d.date.toISOString().split("T")[0];
      uniqueDays.add(day);
    });
    return uniqueDays.size;
  }, [series1Formatted]);

  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  const {xAxis, yAxis} = useMemo(()=>{
 return {
    xAxis :d3
    .scaleTime()
    .domain(d3.extent(series1Formatted.map((d) => d.date)))
    .range([0+marginLeft+padding, width-10]),
    yAxis:d3
    .scaleLinear()
    .domain(d3.extent(series1Formatted.map((d) => d.value)))
    .range([height-marginBottom-padding, 10])
 }

  },[series1Formatted, marginLeft,padding,width,height,marginBottom])


  const line = d3
    .line()
    .x((d) => xAxis(d.date))
    .y((d) => yAxis(d.value));

  useEffect(() => {
    d3.select(gx.current).call(
      d3.axisBottom(xAxis).tickSizeOuter(0).ticks(dayCount).tickFormat(d3.timeFormat("%m/%d")),
    );
  }, [gx, xAxis, dayCount]);

  useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(yAxis).tickSizeOuter(0));
  }, [gy, yAxis]);



  if (!prices) {
    return <div>No data to show</div>;
  }

  return (
    <>

      <svg   width={width} height={height} >
        
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path
          fill="none"
          stroke={LINE_COLORS[0]}
          strokeWidth="1.5"
          d={line(series1Formatted)}
        />
        <g fill={LINE_COLORS[0]}         stroke={LINE_COLORS[0]}
 strokeWidth="1.5">
        {series1Formatted.map((d,i) => (
          <circle key={i} cx={xAxis(d.date)} cy={yAxis(d.value)} r="1.5" />
        ))}
      </g>
      </svg>
    </>
  );
};

export default PriceGrid;
