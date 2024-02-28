import PriceGrid from "./PriceGrid";
import { fetchPrices } from "./actions";

const TOKENS = {
  ATOM: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  NTRN: "untrn",
};

const CHAIN = "neutron-1";

export default async function Home() {
  let prices;
  try {
    prices = await fetchPrices({
      tokens: [TOKENS.ATOM, TOKENS.NTRN],
      chainId: CHAIN,
      dateRange: "D7",
    });
    console.log("### PRICES", prices);
  } catch (error) {
    console.log("there was an error fetching data", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hi</h1>
      <PriceGrid prices={prices} />
    </main>
  );
}
