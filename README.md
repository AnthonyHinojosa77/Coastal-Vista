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

`https://anthonyhinojosa77.github.io/Coastal-Vista/`

## Photo-led design

The page uses six approved real photographs with separate desktop and phone crops in `public/images/real/`. Harbor Bridge pass 5 opens the page; the family portrait forms the background of the closing contact introduction. The original image files remain preserved.

Navigation uses section links; photo panels use GSAP pinned transitions, text fades, and subtle image movement. Reduced-motion visitors receive a static layout. The equipment section and Formspree integration are retained. Local form delivery requires `VITE_FORMSPREE_ENDPOINT`; without it, the form offers the existing direct-email fallback.

## Portfolio

The Work link opens a filterable library of 14 photographs and six films. Images open at full size and videos load on demand in a native dialog. The supplied Coastal Vista emblem appears at the bottom right of the contact section. Web files live in `public/portfolio/`; the original media is kept separately in OneDrive.

See `docs/portfolio-release.md` for the media selection and release checks. Run `npm run qa` with the site running at `http://127.0.0.1:5174`, or set `QA_URL` to another preview/live URL. Set `CHROME_PATH` if Chrome is installed elsewhere. Browser QA screenshots and its JSON report are saved to `QA_OUTPUT` (default `/tmp/cv-mvp-qa`).
