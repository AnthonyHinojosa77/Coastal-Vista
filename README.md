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
