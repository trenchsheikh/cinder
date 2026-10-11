# Cinder

Responsive landing page matching the approved navy and icy-blue Cinder concept. The header logo and orbital background are generated raster image assets, not CSS illustrations. Text, navigation and buttons are accessible HTML.

## Run

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:5173. For a production bundle, run `npm run build`; serve `dist/` on any static host. `npm start` previews that bundle locally.

## Scope

- Landing page with responsive navigation, Open terminal CTA and How it works dialog.
- Connect wallet requests a connection from an installed Phantom provider; without one, it shows wallet guidance. No transaction signatures are requested.
- Navigation goes to a terminal entry page with Explore, Launch, Portfolio and Rewards routes. These explicitly show that the live protocol integration is not enabled yet.
- Pump.fun coin discovery, launch/trade execution, fee sharing and custom buyback/burn automation remain separate implementation work. No mock prices or fake transactions are shown.

## Assets

Generated from the approved Cinder mockup: `public/assets/cinder-background.webp` and `public/assets/cinder-logo.webp`. The logo uses a contrast filter and screen blending to remove its dark plate without redrawing the mark or lettering. DM Sans is self-hosted; its license is included alongside the font files.
