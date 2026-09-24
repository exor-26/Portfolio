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

Project copy and links are in src/AdityaPortfolio.jsx. The KIEPL and CardBox repositories are private client work and are intentionally not linked as public source.
