# Spark

Responsive landing page matching the approved navy and icy-blue Spark concept. The header logo and orbital background are generated raster image assets, not CSS illustrations. Text, navigation and buttons are accessible HTML.

## Run

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:5173. For a production bundle, run `npm run build`; serve `dist/` on any static host. `npm start` previews that bundle locally.

## Vercel deployment

The repository's `vercel.json` explicitly selects the static framework, runs `npm run build` and publishes `dist/`. Vercel serves the generated HTML, CSS, JavaScript, images and fonts directly; `npm start` is only a local preview command, not a production server on Vercel.

Connect this repository with production branch `main` and leave the Root Directory at the repository root. After merging changes, confirm the production deployment points to the newest `main` commit. The landing page is `/`; the terminal entry is `/terminal.html?view=explore` (or `launch`, `portfolio`, `rewards`). No environment variables are needed for this landing release.

If an older deployment is still shown, check that the domain is assigned to this project and that the newest deployment is promoted to Production. A successful preview deployment does not update the production domain.

## Scope

- Landing page with responsive navigation, Open terminal CTA and How it works dialog.
- Connect wallet requests a connection from an installed Phantom provider; without one, it shows wallet guidance. No transaction signatures are requested.
- Navigation goes to a terminal entry page with Explore, Launch, Portfolio and Rewards routes. These explicitly show that the live protocol integration is not enabled yet.
- Pump.fun coin discovery, launch/trade execution, fee sharing and custom buyback/burn automation remain separate implementation work. No mock prices or fake transactions are shown.

## Assets

Generated from the approved Spark mockup: `public/assets/spark-background.webp` and `public/assets/spark-logo.png`. The Spark logo has a real alpha channel and renders without filters or blend modes. The regenerated 16:9 background uses aspect-preserving cover scaling; the source is 1672 × 941 pixels. DM Sans is self-hosted; its license is included alongside the font files.
