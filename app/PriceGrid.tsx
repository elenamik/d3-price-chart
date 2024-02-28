import { Prices } from "./actions";

const PriceGrid: React.FC<{ prices?: Prices }> = (prices) => {
  if (!prices) {
    return <div>No data to show</div>;
  }

  return <div>{JSON.stringify(prices)}</div>;
};

export default PriceGrid;
