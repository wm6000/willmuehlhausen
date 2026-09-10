# Agent guide

Operational conventions for this repo. Read [docs/spec.md](docs/spec.md) first for what the
site is and the rules that don't bend; this file is how to work in the code without
breaking them.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run lint` | Structure check, parity check, then `tsc --noEmit`, then ESLint. **Run this before claiming anything works.** |
| `npm run build` | `lint`, then a production build |
| `npm run structure` | Structure check only |
| `npm run eslint` | ESLint only |
| `npm run parity` | Parity check only — the browser classifier vs. recorded scikit-learn output |

There is no test framework yet. See **Verifying your work** below for what to do instead.

## The three structure rules

Enforced by [scripts/check-structure.mjs](scripts/check-structure.mjs) and wired into
`npm run lint`, so a build cannot pass while one is broken. They are the most common way
to get a red build here.

1. **At most 7 files per directory** (subdirectories don't count). `src/ui/inputs/`,
   `src/pages/` and `src/data/` are currently *at* the cap — adding a file to any of them
   forces a split first. Splitting is fine; the `@/ui` barrel hides it from consumers, and
   a subdirectory (as in `src/components/profile/sports/`) is the usual escape.
2. **No CSS outside `src/styles/`.** Stylesheets are imported once, in order, from
   [src/main.tsx](src/main.tsx). That file is where cascade order is decided.
3. **No raw DOM tags outside `src/ui/`.** Pages and components compose from `@/ui`. This
   includes `<svg>`, and it includes tags inside *string literals* — the checker is a
   regex over `.tsx` source, so an HTML string (a map attribution, say) belongs in a
   `.ts` file. `src/ui/escapes/` exists for the cases where a bare element genuinely is
   the answer.

When a page needs markup it can't express, **add or extend a primitive** — don't reach
for a `<div>`.

## ESLint

[config/eslint.config.mjs](config/eslint.config.mjs) — flat config, type-aware, running
`typescript-eslint` recommended plus `react-hooks` and `jsx-a11y`. It covers what the
other two checks can't see: `tsc` reasons about types, the structure check reasons about
directories, and neither knows a hook from a function.

- **`exhaustive-deps` is an error, not a warning.** A warning that never fails the build
  is a warning nobody reads. Where the rule is wrong, restructure so it isn't — a stable
  module-level constant instead of a fresh `[]` each render, say — rather than suppress.
- **Suppressions carry a reason.** The two `jsx-a11y/no-autofocus` disables in the app
  are focus *restoration* after a user action, which is the opposite of the problem the
  rule guards against. If you can't write that sentence, fix the code instead.
- **`src/ui/**` is exempt from `no-autofocus`** because the primitive layer forwards DOM
  capabilities without deciding to use them. The rule still applies at every call site.

There is no Prettier. Formatting is hand-maintained, with `.editorconfig` holding the
basics. Adding it would reformat about half the files, which is worth doing on top of a
commit rather than on top of uncommitted work.

## Imports

- Always `@/...`, never relative. The alias is configured in both
  [config/tsconfig.json](config/tsconfig.json) and [config/vite.config.ts](config/vite.config.ts).
- Consumers import from the `@/ui` barrel and **never name a subfolder**, so the
  `text` / `box` / `controls` / `inputs` / `display` / `escapes` split can change freely.
- Files *inside* `src/ui/` import each other by full path (`@/ui/cx`), not via the barrel.

## TypeScript

`strict`, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`verbatimModuleSyntax`, `noUnusedLocals`. Three of these bite regularly:

- **`exactOptionalPropertyTypes`** — a prop that may receive `undefined` must say so:
  `describedBy?: string | undefined`, not `describedBy?: string`.
- **`noUncheckedIndexedAccess`** — `array[0]` is `T | undefined`. Narrow it; don't assert.
- **`verbatimModuleSyntax`** — type-only imports need `import type`.

Naming here is **PascalCase for component files** (`Button.tsx`) and camelCase for
everything else (`credentials.ts`). This differs from the sibling `website` repo — don't
copy its kebab-case.

## Styling

- **Every colour, space, size and duration resolves to a token** in
  [src/styles/tokens.css](src/styles/tokens.css). No raw hex in a component's CSS.
- Adding a colour means adding it to **all three blocks**: `:root`, the
  `prefers-color-scheme: dark` block, and `:root[data-theme="dark"]`. Miss one and the
  theme toggle breaks in one direction only.
- Primitive styles go in `ui.css`; everything built on them in `components.css`.
- Animate nothing without a `prefers-reduced-motion` escape.

## Honesty rules

These are product invariants, not style. Breaking one is a bug, not a nitpick.

- `DATA_SOURCE.kind` in [src/data/site.ts](src/data/site.ts) is the single switch for
  "this is sample data". **No page may claim real conditions while it says `"mock"`.**
- A mock must say it's a mock, on the page: the login says no password is checked and
  unfinished posts render a `DraftNotice`. The inverse binds too — the disaster-response
  classifier claims to *be* the trained model, so `scripts/parity.mjs` proves it on every
  build. A claim about what the code is needs a check, not a comment.
- Never invent facts about the work — stacks, metrics, outcomes. Placeholder text that
  announces itself beats plausible fiction.

## Comments

Comments explain **why**, never what. The bar is a hidden constraint, a rejected
alternative, or a subtle invariant — the kind of thing the next person would otherwise
"fix". Match the density of the surrounding file; this codebase comments more than most,
and always at that altitude.

## Verifying your work

`npm run lint` and `npm run build` are the floor, not the ceiling. Nothing in either
runs the app.

- **Pure logic** runs directly: `node --experimental-strip-types --input-type=module -e '...'`
  importing straight from `src/lib/*.ts`. Good for `verdictFor`, credential rules, profile
  isolation.
- **Components** can be rendered without a browser: bundle a throwaway entry with esbuild
  (`alias: {'@': 'src'}`, `nodePaths: ['node_modules']`) and `renderToString` it, then
  assert on the HTML. Catches missing providers, crashes, and wrong conditional branches.
  Note `&` renders as `&amp;`.
- **The disaster-response classifier has its own gate.** `scripts/parity.mjs` bundles
  `src/lib/disaster/*` with esbuild and replays 200 messages recorded from the Python
  pipeline, failing on any of 7,200 bits. If you touch the tokenizer, the TF-IDF maths or
  the stump walk, this is the check that matters; regenerate the fixture only from a real
  `models/export_web.py` run, never by hand.
- **Anything a browser has and Node doesn't is unverified this way.** The whale-blog maps
  are exactly that: Leaflet needs a real layout, tiles need the network, and a canvas
  renderer draws nothing under `renderToString`. Verifying them means `npm run dev`, or
  driving a headless browser over CDP and reading pixels back off the canvas. Say plainly
  which you did rather than implying the render test covered it.

Put throwaway test files in the scratchpad, not the repo.

## Docs

`docs/` is the source of truth for *what* and *why*; the code is truth for *how*. When
behaviour changes, update the doc in the same change:

- [docs/spec.md](docs/spec.md) — routes, milestones, the rules that don't bend
- [docs/auth.md](docs/auth.md) — sign-in flow, credential rules, the mock session
- [docs/projects.md](docs/projects.md) — the projects blog, and adding a post

One topic per file, and add a row to [docs/README.md](docs/README.md) when you add one.

## Git

**This repo has no commits and no remote yet.** Nothing is recoverable from history, so
back up a file before a risky rewrite rather than trusting `git checkout`.

Conventions shared with the sibling repos (see `../CLAUDE.md`): trunk-based development,
squash-merge only, Conventional Commits for PR titles (`feat:`, `fix:`, `docs:`,
`chore:`, `refactor:`, `test:`). Don't commit or push unless asked.
