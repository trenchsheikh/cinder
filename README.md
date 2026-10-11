# Spark

Responsive Spark landing page with a light-blue background, a Three.js globe and orbiting sparks. The header logo is a generated transparent raster asset. Text, navigation and buttons are accessible HTML.

## Run

Requires Node.js 20 or newer. Install dependencies with `npm ci` before running.

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

The transparent Spark logo and favicon are stored in `public/assets/`. The landing page recolours the logo for contrast on light blue. DM Sans is self-hosted; its license is included alongside the font files.

## Animated globe

The landing page uses a light-blue background and a real Three.js globe with Natural Earth land points, a subtle grid, atmospheric rim and three shooting-star beams. Drag the globe with a mouse or touch to rotate it; gentle pointer movement also shifts the view. Automatic rotation takes about six minutes per revolution. Three.js is pinned and served locally from the build output. Geography is prepared at build time using world-atlas and topojson-client; no external CDN or runtime map service is required. Natural Earth data is public domain. The animation respects reduced motion, pauses in hidden tabs, caps rendering resolution and displays a static fallback when WebGL is unavailable.
