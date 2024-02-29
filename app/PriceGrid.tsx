"use client";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { Prices } from "./actions";
import * as d3 from "d3";
import { getTokenShortName, useWindowDimensions } from "./utils";

const MAX_WIDTH = 640;
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

const PriceGrid: React.FC<{
  prices?: Prices;
  title: string;
}> = ({ prices, title }) => {
  const { innerWidth } = useWindowDimensions();
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  const config = useMemo(() => {
    const w = Math.min(innerWidth, MAX_WIDTH);
    return {
      // sizing can be configurable, but I chose not to handle it here

      width: w * 0.86, // shrink so it all fits
      height: w * 0.75, // 3:4 aspect ratio
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 35,
      padding: 5,
    };
  }, [innerWidth]);

  const tokens = useMemo(
    () => (prices ? Object.entries(prices) : undefined),
    [prices],
  );

  const datesRangeSample = useMemo(() => {
    // for date axis (I make assumption all tokens will be consistent range)
    if (!tokens) return [];
    return tokens[0][1].series; // extract series first data point
  }, [tokens]);

  const yBounds = useMemo(() => {
    // calculate max and min range based on data
    if (!tokens) return;

    let yMin: number | null = null;
    let yMax: number | null = null;
    tokens.forEach(([, item]) => {
      const vals = item.series.map((i) => i.value);
      yMax = Math.max(...vals, yMax ?? vals[0]);
      yMin = Math.min(...vals, yMin ?? vals[0]);
    });

    return {
      min: yMin,
      max: yMax,
    };
  }, [tokens]);

  const { xAxis, yAxis } = useMemo(() => {
    return {
      xAxis: d3
        .scaleTime()
        //@ts-ignore
        .domain(d3.extent(datesRangeSample.map((d) => new Date(d.time * 1000))))
        .range([0 + config.marginLeft + config.padding, config.width]),
      yAxis: d3
        .scaleLinear()
        //@ts-ignore
        .domain(d3.extent([yBounds.min, yBounds.max])) //todo: show decimal pts
        .range([config.height - config.marginBottom - config.padding, 0]),
    };
  }, [datesRangeSample, yBounds, config]);

  // for x ticks
  const uniqueDays = useMemo(() => {
    if (!tokens) return [];

    const uniqueDays = new Set();
    datesRangeSample.forEach(function (d) {
      const date = new Date(d.time * 1000);
      const day = date.toISOString().split("T")[0];
      uniqueDays.add(day);
    });
    return uniqueDays.size;
  }, [tokens, datesRangeSample]);

  const line = d3
    .line()
    .x((d) => {
      //@ts-ignore
      return xAxis(new Date(d.time * 1000));
    })
    //@ts-ignore
    .y((d) => yAxis(d.value));

  useEffect(() => {
    d3.select(gx.current).call(
      //@ts-ignore

      d3
        .axisBottom(xAxis)
        .tickSizeOuter(0)
        .ticks(uniqueDays)
        .tickFormat(d3.timeFormat("%m/%d")),
    );
  }, [gx, xAxis, uniqueDays]);

  useEffect(() => {
    d3.select(gy.current).call(
      //@ts-ignore
      d3
        .axisLeft(yAxis)
        .tickSizeOuter(0)
        .tickFormat((d) => d3.format(".2f")(d)),
    );
  }, [gy, yAxis]);

  const dataSummary = useMemo(() => {
    if (!tokens) return;

    return tokens.map(([token, item], i) => {
      const vals = item.series.map((i) => i.value);

      return {
        name: getTokenShortName(token),
        index: i,
        min: Math.min(...vals),
        max: Math.max(...vals),
        avg: vals.reduce((acc, curr) => acc + curr, 0) / vals.length,
      };
    });
  }, [tokens]);

  if (!prices) {
    return <div>No data to show</div>;
  }

  return (
    <div className="px-4">
      <div className="font-bold text-3xl text-center">{title}</div>
      <svg width={config.width} height={config.height}>
        <g
          ref={gx}
          transform={`translate(0,${config.height - config.marginBottom})`}
        />
        <g ref={gy} transform={`translate(${config.marginLeft},0)`} />
        {tokens?.map(([t, data], i) => {
          return (
            <Fragment key={`token-data-${i}`}>
              <path
                fill="none"
                stroke={LINE_COLORS[i]}
                strokeWidth="1.5"
                //@ts-ignore
                d={line(data.series)}
              />
              <g
                fill={LINE_COLORS[i]}
                stroke={LINE_COLORS[i]}
                strokeWidth="1.5"
              >
                {data.series.map((d, i) => (
                  <circle
                    key={`point-${t}-${i}`}
                    cx={xAxis(new Date(d.time * 1000))}
                    cy={yAxis(d.value)}
                    r="0.6"
                  />
                ))}
              </g>
            </Fragment>
          );
        })}
      </svg>
      <div className="flex flex-col gap-6 p-4 justify-center">
        {dataSummary?.map((item, i) => {
          return (
            <div
              key={`summary-${i}`}
              className="flex gap-2 items-center  flex-wrap "
            >
              <div className="flex gap-2 items-center">
                <div
                  className="w-4 h-4"
                  style={{
                    background: LINE_COLORS[i],
                  }}
                ></div>
                <div className="text-lg font-bold">${item.name} </div>
              </div>

              <div className="opacity-70 text-sm">
                <span className="font-semibold">Weekly Average:</span>$
                {item.avg.toFixed(2)}{" "}
              </div>
              <div className="opacity-70 text-sm">
                <span className="font-semibold">Weekly Min:</span>$
                {item.min.toFixed(2)}{" "}
              </div>

              <div className="opacity-70 text-sm">
                <span className="font-semibold">Weekly Max:</span>$
                {item.max.toFixed(2)}{" "}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceGrid;
