"use server";

import { z } from "zod";

const ASTROPORT_API_URL = "https://app.astroport.fi/api/trpc/charts.prices";
type DateRange = "D7"; // no other types specificied at the moment

const PriceSchema = z.record(
  z.object({
    series: z.array(
      z.object({
        time: z.number(),
        value: z.number(),
      }),
    ),
    priceChangePercentage: z.number(),
    minValue: z.number(),
    maxValue: z.number(),
  }),
);
const AstroPortResponseSchema = z.object({
  result: z.object({
    data: z.object({
      json: PriceSchema,
    }),
  }),
});

export type Prices = z.infer<typeof PriceSchema>;

export async function fetchPrices(params: {
  tokens: string[];
  chainId: string;
  dateRange: DateRange;
}) {
  const { tokens, chainId, dateRange } = params;

  const res = await fetch(
    ASTROPORT_API_URL +
      "?" +
      new URLSearchParams({
        input: JSON.stringify({
          json: {
            tokens,
            chainId,
            dateRange,
          },
        }),
      }),
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data " + res.status + "" + res.statusText);
  }

  const data = await res.json();
  const valid = AstroPortResponseSchema.parse(data);
  return valid.result.data.json;
}
