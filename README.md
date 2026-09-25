# Aditya Kumar Portfolio

A single-page React and Vite portfolio featuring CineStream, KIEPL ERP–CRM, and CardBox.

## Local development

- Install dependencies: npm ci
- Start the local site: npm run dev

## Final Netlify build

- Check source: npm run lint
- Generate the deployment folder: npm run build

The existing Netlify site is [exor-portfolio.netlify.app](https://exor-portfolio.netlify.app) and is connected to the [exor-26/Portfolio](https://github.com/exor-26/Portfolio) repository. Netlify builds `main` with `npm run build` and publishes `dist`, as configured in `netlify.toml`.

The generated `dist` folder can also be uploaded to that existing site for a manual production deploy. Keep the existing Netlify project when doing so; creating a new project would change the URL.

This site has no server component or client-side route paths. Its navigation uses page anchors, so a redirect rule is not needed for this version.

## Content and design

- Project copy, delivery status, roles, and links: `src/data/projects.js`.
- Page sections and personal information: `src/AdityaPortfolio.jsx`.
- Reusable case studies and links: `src/components/`.
- Responsive layout and visual tokens: `src/index.css`.
- Social sharing card: `public/social-preview.png`.

The site uses a self-hosted Manrope Latin font under the SIL Open Font License (`public/fonts/OFL.txt`) and a system serif. It has no analytics, external runtime fonts, or backend. Native HTML disclosures keep engineering details accessible without extra JavaScript state. Reduced-motion preferences are respected.

Only CineStream, KIEPL ERP–CRM, and CardBox are featured. CineStream is an independent published product; KIEPL is a live private client platform; CardBox is contract work in development. The KIEPL and CardBox repositories are private and are not linked as public source. Keep security descriptions specific to verified controls and avoid unsupported metrics or guarantees.

To preview a production build on Windows, run `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4174` after the build. Production deployments use the existing Netlify project and the repository's `main` branch.
