# willmuehlhausen.com — spec

## What this is

A portfolio. The things I've built, each written up with its architecture, stack and what
it taught me. Deliberately not scoped to a domain: the work spans mechanical design,
factory systems, data and machine learning, and the listing is tagged rather than themed
so it can hold all of it.

It used to be two things. RecAdvisor — the training advisor that reads activity history,
calendar and mountain conditions and makes one call on the day — shared this codebase and
this domain, and now has its own of both at **recadvisor.app**. It is linked from here as
a project, because that is what it is from this site's point of view. What the two still
share is the design language, via
[`@wm/design-tokens`](https://github.com/wm6000/design-tokens).

Why they split: the advisor grew a real backend, real auth and real user data, and none of
that belongs behind the same deploy as a static portfolio. A hiring manager reading a
project write-up and a signed-in user planning a ski week want different things from a
page, and were being served the same bundle.

## Audience

**A hiring manager or collaborator**, skimming for evidence, on a phone, for ninety
seconds. Everything load-bearing must survive that. There is no signed-in state any more —
every visitor sees the same site, which is the whole site.

## Routes

| Route | Owes the visitor |
|---|---|
| `/` | What I do, and two doors: the projects, and RecAdvisor |
| `/projects` | The blog-style listing, filterable by tag — see [projects.md](projects.md) |
| `/projects/:slug` | One post, free to carry its own custom features |
| `*` | A real 404 that offers a way back |

Every route is built. There is no `RoutePlaceholder` any more — it existed for unbuilt
milestones, and there aren't any.

## Rules that don't bend

**Honesty about the work.** Never invent facts about a project — stacks, metrics,
outcomes. Placeholder text that announces itself beats plausible fiction, which is what
`DraftNotice` is for: both posts are drafts and say so. The inverse binds too — the
disaster-response classifier claims to *be* the trained model, so `scripts/parity.mjs`
proves it on every build, replaying 200 messages and comparing 7,200 predictions against
scikit-learn. **A claim about what the code is needs a check, not a comment.**

**Structure over sprawl.** Three rules, enforced by
[scripts/check-structure.mjs](../scripts/check-structure.mjs) and wired into `npm run lint`
so a build cannot pass while one is broken: at most 7 files per directory; no CSS outside
`src/styles/`; no raw DOM tags outside `src/ui/`. The reasoning, and how to work with rule
3, is in the root [README](../README.md#structure-rules).

**Tokens are shared, components are not.** Every colour, space, size and duration resolves
to a token, and the tokens come from `@wm/design-tokens` so a palette change lands on both
sites rather than on whichever one someone remembered. The primitive layer in `src/ui/` is
*not* shared — recadvisor.app has its own copy, free to diverge. That was the deliberate
trade at the split: shared components would have meant one repo's refactor breaking the
other's deploy, for two apps that render almost nothing in common.

**No dependency without a reason that survives being said out loud.** React, React Router,
TypeScript, Vite, and Leaflet. Leaflet left once already, when RecAdvisor's map went,
rather than sit unused at a third of the bundle; it came back for the whale-blog maps,
which are the post's argument rather than decoration on it. It is dynamically imported, so
only that route pays the 43KB. Plain CSS on design tokens — no CSS framework, no component
library. Every primitive in `src/ui/` is ours, which is why rule 3 can be absolute.

**Accessible by construction.** Skip link, one `<main>`, headings that descend, focus
visible, the drawer trapping and restoring focus. These live in the primitives and the
shell so pages get them without asking.

## Non-goals

- A blog or a CMS. Project writeups are content in `src/data/`, not posts.
- Analytics, cookie banners, newsletter capture, chat widgets.
- Accounts of any kind. Sign-in left with the advisor, and nothing here needs it.
- SSR, until something needs it. It's a static build served as one.

## Open

- Real prose for both project posts. They are drafts and say so.
- Replace the placeholder URLs in `EXTERNAL` ([src/data/site.ts](../src/data/site.ts)).
- `recadvisor.app` is linked from the home page and the footer before it serves anything.
  Either ship it or drop the links — a portfolio that links to a dead product is worse
  than one that doesn't mention it.
