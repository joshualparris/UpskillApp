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

## Backend (Vercel serverless)

- `GET /api/jobs` — Adzuna job search proxy (requires `ADZUNA_APP_ID` and `ADZUNA_API_KEY` in Vercel env)
- `GET/PUT /api/state` — optional cloud sync when `BLOB_READ_WRITE_TOKEN` is set

Copy `.env.example` to `.env.local` for local API testing, then run:

```bash
npm run dev:full
```

## Deploy

```bash
npm run deploy:vercel
```

Vercel deploys the Vite frontend and `/api` routes together.

For GitHub Pages:

```bash
$env:GITHUB_PAGES="true"
npm run deploy:gh-pages
```

Seed provider/contact data is deliberately marked as needing verification unless it has a recent verified date. The app is designed for manual notes and public-source research imports, not unlawful scraping.
