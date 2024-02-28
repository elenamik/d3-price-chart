"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Prices } from "./actions";
import * as d3 from "d3";

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  });

  useEffect(() => {
    function handleResize(e: any) {
      setWindowDimensions({
        innerWidth: e.target.innerWidth,
        innerHeight: e.target.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const LINE_COLORS = [
  "#ff7f0e", // orange
  "#1f77b4", // blue
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
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
    padding?: number;
  };
}> = ({
  prices,
  options = {
    height: 200,
    width: 280,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 30,
    padding: 5,
  },
}) => {
  const { innerWidth } = useWindowDimensions();

  const MAX_WIDTH = 600;

  const opts = useMemo(() => {
    const w = Math.min(innerWidth, MAX_WIDTH);
    return {
      width: w,
      height: w * 0.75, // 3:4 aspect ratio
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 30,
      padding: 5,
    };
  }, [options, innerWidth]);

  const tokens = prices ? Object.keys(prices) : [];

  const sample = useMemo(() => {
    if (!prices) return;
    return prices[tokens[0]];
  }, [tokens, prices]);

  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  const yBounds = useMemo(() => {
    if (!prices) return;
    let yMin: number | null = null;
    let yMax: number | null = null;
    tokens.forEach((t) => {
      const item = prices[t];
      const vals = item.series.map((i) => i.value);

      yMax = Math.max(...vals, yMax ?? vals[0]);
      yMin = Math.min(...vals, yMin ?? vals[0]);
    });
    return {
      min: yMin,
      max: yMax,
    };
  }, [prices]);

  const { xAxis, yAxis } = useMemo(() => {
    return {
      xAxis: d3
        .scaleTime()
        .domain(d3.extent(sample.series.map((d) => new Date(d.time * 1000))))
        .range([0 + opts.marginLeft + opts.padding, opts.width - 10]),
      yAxis: d3
        .scaleLinear()
        .domain(d3.extent([yBounds?.min, yBounds?.max]))
        .range([opts.height - opts.marginBottom - opts.padding, 10]),
    };
  }, [yBounds, opts]);

  // for x ticks
  const uniqueDays = useMemo(() => {
    if (!prices) return [];

    const sample = prices[tokens[0]].series;
    const uniqueDays = new Set();
    sample.forEach(function (d) {
      const date = new Date(d.time * 1000);
      const day = date.toISOString().split("T")[0];
      uniqueDays.add(day);
    });
    return uniqueDays.size;
  }, [prices, tokens]);

  const line = d3
    .line()
    .x((d) => {
      return xAxis(new Date(d.time * 1000));
    })
    .y((d) => yAxis(d.value));

  useEffect(() => {
    d3.select(gx.current).call(
      d3
        .axisBottom(xAxis)
        .tickSizeOuter(0)
        .ticks(uniqueDays)
        .tickFormat(d3.timeFormat("%m/%d")),
    );
  }, [gx, xAxis, uniqueDays]);

  useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(yAxis).tickSizeOuter(0));
  }, [gy, yAxis]);

  if (!prices) {
    return <div>No data to show</div>;
  }

  return (
    <>
      <svg width={opts.width} height={opts.height}>
        <g
          ref={gx}
          transform={`translate(0,${opts.height - opts.marginBottom})`}
        />
        <g ref={gy} transform={`translate(${opts.marginLeft},0)`} />
        {tokens.map((t, i) => {
          const data = prices[t];
          return (
            <Fragment key={`token-data-${i}`}>
              <path
                fill="none"
                stroke={LINE_COLORS[i]}
                strokeWidth="1.5"
                d={line(data.series)}
              />
              <g
                fill={LINE_COLORS[i]}
                stroke={LINE_COLORS[i]}
                strokeWidth="1.5"
              >
                {data.series.map((d, i) => (
                  <circle
                    key={i}
                    cx={xAxis(new Date(d.time * 1000))}
                    cy={yAxis(d.value)}
                    r="0.4"
                  />
                ))}
              </g>
            </Fragment>
          );
        })}
      </svg>
    </>
  );
};

export default PriceGrid;
