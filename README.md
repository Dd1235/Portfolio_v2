# dedeepya.avancha — portfolio

Personal portfolio with a low-level systems aesthetic: animated ring buffers, cache-line sweeps,
Kafka backpressure gauges, and benchmark-style project cards. Dark mode is the primary look;
light mode is a research-notebook variant. **No backend** — the whole site is a static Vite + React SPA.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Editing content (the admin page)

All site content — profile, projects, blogs, experience, skills — lives in one file:
`src/content/content.json`.

Visit `/admin` (linked as `0xAD` in the footer; passphrase in `src/pages/Admin.tsx` — change it).
Edits there update the site instantly but are stored **only in your browser's localStorage**.
To publish them for everyone:

1. Admin → **Data → export content.json**
2. Replace `src/content/content.json` with the download
3. Commit and redeploy

The admin gate is a deterrent, not security — anything in the bundle is public. If that matters,
strip the `/admin` route before deploying.

Blogs support two sources: `"local"` posts (markdown rendered on-site at `/writing/<slug>`) and
`"medium"` posts (cards that link out). Both support tags, reading time, featured flag,
visibility toggle, and related-project links.

## Deploy

The repo ships configs for all three common hosts:

- **Vercel** — `npx vercel` from the repo root; `vercel.json` handles the SPA rewrite.
- **Netlify** — connect the repo or `npx netlify deploy`; `netlify.toml` sets build + redirects.
- **GitHub Pages** — build and push `dist/` (SPA deep links need a 404.html copy of index.html:
  `cp dist/index.html dist/404.html` before publishing).

## Layout

```
src/
  content/content.json   all site data (single source of truth)
  state/                 ThemeContext (dark/light), ContentContext (data + admin overrides)
  components/            Nav, Footer, cards, chips, Motif micro-icons, markdown renderer
  diagrams/              animated SVG diagrams (ring buffer, kafka pipeline, inverted index,
                         ML pipeline, cache grid, BFS, anomaly heatmap, waveform)
  pages/                 Home, About, Projects, ProjectDetail, Writing, BlogPost, DSA, ML,
                         Contact, Admin, NotFound
  styles/                tokens (theme variables), base, components, pages
```

Diagram colors all come from CSS custom properties, so both themes recolor them for free.
Animations pause under `prefers-reduced-motion` and when the tab is hidden (`src/diagrams/useTick.ts`).

Theme can be forced via URL for sharing/screenshots: `/?theme=light` or `/?theme=dark`.
