# PaperStack

A journal-style research site for publishing papers on AI, cybersecurity, and
the web. Built with Next.js (App Router), TypeScript, and Tailwind CSS,
deployed on Netlify.

> Status: foundation (step 1 of 10) — routes, design system, and the content
> pipeline land in later steps. Full documentation will be added in step 10.

## Stack

- **Framework:** Next.js (App Router) with TypeScript in strict mode
- **Styling:** Tailwind CSS v4, light editorial theme
- **Content:** MDX papers under `content/papers/` with gray-matter frontmatter,
  rendered with next-mdx-remote (RSC); GFM, KaTeX math, Shiki code highlighting
- **Search:** MiniSearch
- **Hosting:** Netlify — Next.js adapter (auto-provisioned), Netlify Blobs for
  any dynamic storage needs

## Getting started

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
npm run dev
```

## Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the development server           |
| `npm run build`        | Production build                       |
| `npm run start`        | Serve the production build             |
| `npm run lint`         | ESLint                                 |
| `npm run typecheck`    | TypeScript with no emit                |
| `npm run format`       | Prettier (with Tailwind class sorting) |
| `npm run format:check` | Prettier check only                    |

## Content layout

- `content/papers/<slug>/index.mdx` — one folder per paper; an optional
  `paper.pdf` alongside it is served from `public/papers/`
- `content/authors/<id>.json` — one file per author
- `content/topics/topics.json` — topic taxonomy

## Environment

See `.env.example`. Note that Netlify Blobs needs **no credentials** when the
app runs on Netlify (or via `netlify dev`) — the platform injects them.
