import { fetchPrices } from "./actions";
import dynamic from "next/dynamic";

const PriceGrid = dynamic(
  //removing complexity of SSR
  () => import("./PriceGrid"),
  { ssr: false },
);
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
  } catch (error) {
    console.log("there was an error fetching data", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-8">
      <PriceGrid title={"ATOM-NTRN 7 DAY"} prices={prices} />
    </main>
  );
}
