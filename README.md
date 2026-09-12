# willmuehlhausen.com

Personal site: a portfolio, and RecAdvisor, which combines activity history, calendar and
mountain conditions into one call on what to do next.

React 19, TypeScript, Vite, plain CSS on design tokens. No framework, no CSS framework,
no component library.

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `lint`, then a production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Structure check, parity check, then `tsc --noEmit`, then ESLint |
| `npm run structure` | Structure check only |
| `npm run eslint` | ESLint only |
| `npm run parity` | Parity check only — the in-browser classifier vs. scikit-learn |

## Docs

[AGENTS.md](AGENTS.md) holds the working conventions — structure rules, TypeScript
gotchas, how to verify a change. `docs/` holds the longer-lived writing — start with [the spec](docs/spec.md) for what the
site is, what each route owes the visitor, and the milestones.

## Structure rules

Three rules, enforced by `scripts/check-structure.mjs` — one file, zero dependencies, wired
into `npm run lint` so `npm run build` cannot pass while one is broken.

1. **At most 7 files per directory.** Subdirectories don't count. Split rather than sprawl.
2. **No CSS outside `src/styles/`.** Stylesheets are imported once from `src/main.tsx`, which
   makes cascade order explicit instead of a side effect of module resolution order.
3. **No raw DOM tags outside `src/ui/`.** Pages, components and layout compose from `@/ui`.

Not ESLint rules, deliberately: two of the three are directory facts rather than facts
about one file's syntax tree, which is the only thing ESLint reasons about. Tuning knobs
are the three constants at the top of the script. ESLint runs alongside it in the same
`npm run lint`, covering the per-file concerns it *is* good at — hooks, accessibility and
type-aware correctness. Config in [config/eslint.config.mjs](config/eslint.config.mjs).

### Working with rule 3

`src/ui/` is the primitive layer and the only place raw tags are legal. When a page needs
markup it can't express, the fix is to add or extend a primitive — not to reach for a `<div>`.
`src/ui/escapes/` exists for the cases where a bare element genuinely is the answer
(`SkipLink`, a ref target for a map to mount into), so those stay collected in one place
instead of scattered.

Pages import from `@/ui` and never name a subfolder, so the `text` / `box` / `controls` /
`display` / `escapes` split can change without touching a consumer.

## Layout

```
config/     tsconfig.json, vite.config.ts   (root tsconfig.json is a shim that extends it)
scripts/    check-structure.mjs, parity.mjs, extract-whale-maps.mjs, fixtures/
public/     favicon, the exported disaster-response model, and the whale map data
src/
  ui/       the primitive layer + barrel
  layout/   header, footer, drawer, page shell
  pages/    one file per route
  components/  feature components, grouped by domain
  data/     site content, types, repositories
  lib/      pure functions
  styles/   every stylesheet
```

## Data

Everything RecAdvisor shows is currently sample data. `DATA_SOURCE.kind` in
`src/data/site.ts` is the single switch: while it says `"mock"`, the footer carries a
"Sample data" chip and pages that show RecAdvisor numbers carry a banner. Setting it to
`"live"` removes both everywhere. No page may claim real conditions while it says `"mock"`.

Placeholder URLs in `src/data/site.ts` (`EXTERNAL`) want replacing before launch.

## Status

M0, M1 and M2 are complete, and sign-in from M3 with them:

- **Shell** — routing, theming, design tokens, primitives, header, footer.
- **`/recadvisor`** — today's call, ranked ski picks with a Leaflet map, the seven-day
  outlook and the plain-language adjustment box, on mock data.
- **`/projects`** — a blog-style listing, and posts that carry their own custom features.
  The disaster-response post is written, and runs the real trained classifier in the
  browser: 1,800 decision stumps exported to JSON, with `npm run lint` failing the build
  if any of 7,200 predictions disagrees with scikit-learn. The whale post carries its
  three maps as real Leaflet maps rebuilt from the old site's Folium exports — 40.4MB of
  generated iframes down to about 1.6MB of data, and 34,932 sightings drawn on a canvas
  instead of as 34,932 DOM nodes.
- **`/login`** — email-then-password on a mock session, gating `/profile`.
- **`/profile`** — connections, and a switch per activity with its preferences beneath.
  Switching one off drops it from RecAdvisor's reasoning, not just its display.

RecAdvisor still runs on sample data, and says so. The disaster-response post is the
exception in the other direction: real corpus, real trained model, real evaluation
numbers — see [docs/projects.md](docs/projects.md) for how it gets into the browser. See
[docs/spec.md](docs/spec.md) for the whole picture.
