This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Assumptions
- stack used is next14 (server components + app router) + d3 (for graphing)
- component should be responsive, smallest screen to support is 320px
- component does not accept sizing config (not important for use case), although it can be easily added
- data does not need to refreshed more frequently than page load (default cache behavior in next14)
- ts-ignores are OK - did not prioritize resolving d3 ts errors, since graph rendered fine
- no SDK to query astroport (needed to define own types)

## Quick Lint

``npx prettier . --write`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
