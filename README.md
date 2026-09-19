# Coastal Vista

Cinematic drone portfolio site for Coastal Vista, built with React, TypeScript, Vite, GSAP, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Contact form configuration

This project sends inquiries through Formspree.

1. Copy `.env.example` to `.env`.
2. Set `VITE_FORMSPREE_ENDPOINT` to your Formspree endpoint.

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

## Deployment

GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`.

After merge to `main`, the workflow builds and deploys the site to:

[coastal-vista.com](https://coastal-vista.com/), with the standalone gallery at [coastal-vista.com/gallery.html](https://coastal-vista.com/gallery.html).

## Photo-led design

The page uses six approved real photographs with separate desktop and phone crops in `public/images/real/`. Harbor Bridge pass 5 opens the page; the family portrait forms the background of the closing contact introduction. The original image files remain preserved.

Navigation links between the homepage sections and the standalone gallery. Photo panels use GSAP pinned transitions, text fades, and subtle image movement. The supplied Coastal Vista emblem appears at the upper left of the opening photograph, with its own arrival and scroll-return fade. Reduced-motion visitors receive a static layout. The equipment section and Formspree integration are retained. Local form delivery requires `VITE_FORMSPREE_ENDPOINT`; without it, the form offers the existing direct-email fallback.

## Portfolio

The Work link opens `gallery.html`, a separate, filterable library of 14 photographs and six films. Images open at full size and full films load on demand in a native dialog. Muted inline previews load and play when at least 55% of a video card is in view. They pause offscreen or behind the viewer and stop after 10 seconds, or at the end of a shorter clip. A preview toggle lets visitors pause them; reduced-motion visitors start with previews disabled. Browsers that block autoplay retain the poster and the full-film viewer.

Vite builds both `index.html` and `gallery.html`, so direct gallery visits and refreshes work on GitHub Pages without a routing fallback. Web files live in `public/portfolio/`; the original media is kept separately in OneDrive.

See `docs/portfolio-release.md` for the media selection and release checks. Run `npm run qa` and `npm run qa:webkit` with the production preview running at `http://127.0.0.1:5174`, or set `QA_URL` to another preview/live URL. The form regression check requires a build with `VITE_FORMSPREE_ENDPOINT` configured; it intercepts requests and sends no inquiry. Set `CHROME_PATH` if Chrome is installed elsewhere. Browser QA screenshots and JSON reports are saved to `QA_OUTPUT` (default `/tmp/cv-gallery-qa`).
