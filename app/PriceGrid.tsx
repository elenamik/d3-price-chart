'use client'
import { useEffect, useRef, useState } from "react";
import { Prices } from "./actions";
import * as d3 from "d3";


// 7 day price chart
// displays 7 day prices
// define x-y axis
// define avg price
// define max, min

const PriceGrid: React.FC<{ prices?: Prices,
options?: {
    width?: number,
    height?: number,
    marginTop?: number,
    marginRight ?: number,
    marginBottom ?: number,
    marginLeft?: number,
}
}> = ({prices, options
}) => {
    // destructure with default values
    const {
        width = 280,
        height = 200,
        marginTop = 20,
        marginRight = 20,
        marginBottom = 20,
        marginLeft = 30
    } = options || {};

 console.log('prices',prices)
    const items = prices? Object.keys(prices):[]
  
    const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
    const gx = useRef();
    const gy = useRef();

 

    // const x = d3.scaleTime().range([0, width])
    // const y = d3.scaleLinear().range([0, height])

    // const svg = d3.select('#price-chart').append('svg').attr('width', width+margin.left+margin.right).attr('height', height+margin.top+margin.bottom).append('g')
    // .attr('transform',`translate(${margin.left},${margin.top})`)

    const dataset=[{
        date: new Date('2022-01-01'), value:200
    },
    {
        date: new Date('2022-02-01'), value:150
    },
    {
        date: new Date('2022-03-01'), value:220
    }]

    // // what data fits into the range
    // x.domain(d3.extent(dataset, d=>d.date))
    // y.domain([0, d3.max(dataset, d=>d.value)])
    // const line = d3.line((d, i) => x(i), y);


    // draw axes
    // svg.append('g').call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b %Y')))



    
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  );


  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  if (!prices) {
    return <div>No data to show</div>;
  }

  return (<>
 
    <svg width={width} height={height}>
    <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data)}
      />
      {/* <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g> */}
    </svg>
    {JSON.stringify(prices)}
    </>)
};

export default PriceGrid;
