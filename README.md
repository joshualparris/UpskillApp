# UpskillApp

UpskillApp is a local pathway planner for Josh and Kristy Parris in Dubbo NSW. It tracks employment agencies, training options, funding/support pathways, contact follow-ups, and practical next actions.

## What it includes

- Agency CRM with priority scoring for Josh and Kristy
- Training pathway planner for ICT, nursing, GP/clinic, immunisation, and return-to-work options
- Follow-up tracker with contact status and due-date highlighting
- Weekly plan export to clipboard or Markdown download
- Parent Pathways funding and appointment planning

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Deploy

Vercel can deploy this repository directly with the default Vite settings.

For GitHub Pages:

```bash
$env:GITHUB_PAGES="true"
npm run deploy:gh-pages
```

Seed provider/contact data is deliberately marked as needing verification unless it has a recent verified date. The app is designed for manual notes and public-source research imports, not unlawful scraping.
