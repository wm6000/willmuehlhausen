# willmuehlhausen.com — spec

## What this is

A personal site with two jobs, in one codebase:

1. **A portfolio.** Data pipelines, machine learning and platform work, each written up
   with its architecture, stack and what it taught me.
2. **An advisor.** A single call on what to do next, from training history, calendar and
   mountain conditions combined. It is itself the portfolio's centrepiece — the site is
   an example of the kind of thing the portfolio claims I build.

The advisor is the reason a stranger stays on the site. The portfolio is the reason they
were sent to it. Neither is a sub-page of the other.

## Audience

- **A hiring manager or collaborator**, skimming for evidence, signed out, on a phone,
  for ninety seconds. Everything load-bearing must survive that.
- **Me**, signed in, using the advisor as a real tool during a ski or training week.

Signed out is the default and must never look like a degraded version of signed in — it
runs on example data and says so.

## Routes

| Route | Owes the visitor | Milestone |
|---|---|---|
| `/` | The claim, and three doors: Advisor, Projects, Profile | M0 ✓ |
| `/advisor` | Today's call, a recap of the week behind you, and a seven-day outlook — in that order | M1 ✓ |
| `/projects` | The blog-style listing, filterable by tag — see [projects.md](projects.md) | M2 ✓ |
| `/projects/:slug` | One post, free to carry its own custom features | M2 ✓ |
| `/profile` | Connections, ranked sports, plan context, email opt-ins, ski settings | M3 ✓ |
| `/login` | Sign in, on a mock session — see [auth.md](auth.md) | M3 ✓ |
| `*` | A real 404 that offers a way back | M0 ✓ |

`/profile` is deliberately absent from the top nav — it lives in the auth menu, and in the
footer's site column. See `NAV` in [src/data/site.ts](../src/data/site.ts).

## Milestones

- **M0 — shell.** Routing, theming (light/dark/system, remembered), design tokens, the
  primitive layer, header with drawer, footer, skip link, scroll reset. Complete.
  Unbuilt routes render `RoutePlaceholder`, which names the milestone that fills them
  in — an unfinished page must never read as a broken one.
- **M1 — advisor.** Built: today's call with a plain-language adjustment box, a recap of
  the week behind you, and the seven-day outlook, all on mock data. It also carried a
  "where to go" section — a city and pass picker, ranked ski areas and a Leaflet map —
  which came out once the profile became 55 ranked sports and that section read as
  ski-specific furniture. It returns when it can serve whatever sports someone ranked;
  the code is in git history and the dependency came out with it. The old site kept ski and training
  as two separate advisors with two separate seven-day lists; here a day carries snow,
  calendar and load together, and `verdictFor` in [src/lib/advisor.ts](../src/lib/advisor.ts)
  turns the three into one call. That reconciliation is the product.
- **M2 — projects.** Built, as a blog: a uniform index in `src/data/projects.ts` drives
  the listing, and each post is its own component free to carry its own custom features.
  [projects.md](projects.md) has the convention. Both posts are drafts — real prose wanted.
- **M3 — profile and session.** Built. The mock `SessionProvider`, the email-then-password
  login modelled on strava.com ([auth.md](auth.md)), `RequireSession` gating `/profile`,
  the session-aware auth menu, and the profile itself: connections, the Strava sport
  catalogue ranked into tiers, the plan context, and ski settings. Switching a sport off is what lets the advisor drop the
  parts of itself a given person doesn't need.
- **Later — real backend.** Real auth, real Strava and calendar reads, real conditions.
  Only at that point does `DATA_SOURCE.kind` flip to `"live"`.

## Rules that don't bend

**Honesty about data.** `DATA_SOURCE.kind` in [src/data/site.ts](../src/data/site.ts) is
the single switch. While it says `"mock"`, the footer carries a "Sample data" chip and any
page showing advisor numbers carries a banner. **No page may claim real conditions while
it says `"mock"`.** Setting it to `"live"` removes both everywhere, and nothing else.

**One profile per person, and nobody inherits anyone else's.** A profile is stored under
its owner's key (`profile:<email>`), never a shared one. Signing out drops it from memory
as well as stopping it being read, so the next person to sign in on the same browser gets
their own profile or an empty one — never the last person's switches. Signed out there is
no key, so `loadProfile` returns empty and `saveProfile` is a no-op rather than writing to
a shared bucket. The advisor separately reads the profile only while signed in; the two
together mean a signed-out visitor can neither see nor leave behind a profile.

**A sport you haven't ranked is gone, not hidden.** The tiers on `/profile` are not a
display filter. Each sport in [src/data/sports.ts](../src/data/sports.ts) declares which
domain it feeds — snow, endurance, or neither — and `domainTiers` in
[src/lib/sports.ts](../src/lib/sports.ts) turns your picks into what `verdictFor` reasons
with. Rank no snow sports and the advice for the week genuinely changes: no ski verdict, no
mountains on the page, and **no mention of the snow in the reasoning either**. That last one
is the easy part to get wrong — telling a runner about fresh powder is the same failure as
showing them a ski section.

**Primary outranks Secondary.** Normally a hard session already on the plan beats a powder
day, because skiing instead is what quietly deletes the week's key workout. For someone who
ranks a snow sport Primary and everything else Secondary, that flips. It is the one place
ranking changes an answer, and it is deliberately the only one.

**Ranked, but not yet reasoned about.** Most of the 55 sports feed neither domain — the
advisor has snow and training load, and no swell, no wind and no court booking. Those
sports are recorded and the profile says plainly that nothing acts on them yet, rather than
letting a Primary-ranked sport silently do nothing.

**Nothing ranked means "not answered", not "none".** An empty set is treated as assume
everything, exactly as for a signed-out visitor, and the profile asks you to fill it in.
A new profile shows the whole product rather than an advisor that refuses to advise.

Adding a sport is an entry in `SPORTS`; the catalogue is Strava's, so in practice it changes
only when Strava's does.

**Email is opt-in, and only a literal `true` opts you in.** Both switches default to off,
and `hydrateEmails` in [src/lib/profile.ts](../src/lib/profile.ts) reads a stored value with
`=== true` rather than merging it — a truthy `"yes"`, `1` or `"false"` from a corrupt or
hand-edited profile resolves to off. Every other field can afford a permissive default;
a subscription cannot, because the failure mode is mail somebody never asked for. Nothing
is sent today and the section says so, rather than collecting a signup that goes nowhere.

**Not advice.** The site carries `DISCLAIMER` — *not avalanche-safety or medical advice* —
wherever it makes a call. The advisor suggests; it never certifies a slope is safe.

**Structure over sprawl.** Three rules, enforced by
[scripts/check-structure.mjs](../scripts/check-structure.mjs) and wired into `npm run lint`
so a build cannot pass while one is broken: at most 7 files per directory; no CSS outside
`src/styles/`; no raw DOM tags outside `src/ui/`. The reasoning, and how to work with rule
3, is in the root [README](../README.md#structure-rules).

**No dependency without a reason that survives being said out loud.** React, React Router,
TypeScript, Vite. That's the whole runtime list. Leaflet was here for the advisor's map and
left with it rather than sitting unused at a third of the bundle. Plain CSS on design
tokens — no CSS framework, no component library. Every primitive in `src/ui/` is ours,
which is why rule 3 can be absolute.

**Accessible by construction.** Skip link, one `<main>`, headings that descend, focus
visible, the drawer trapping and restoring focus. These live in the primitives and the
shell so pages get them without asking.

## Non-goals

- A blog or a CMS. Project writeups are content in `src/data/`, not posts.
- Analytics, cookie banners, newsletter capture, chat widgets.
- Anyone else's accounts. Signed-in is me, and a mock session for demonstration.
- SSR, until something needs it. It's a static build served as one.

## Open before launch

- Replace the placeholder URLs in `EXTERNAL` ([src/data/site.ts](../src/data/site.ts)).
- Decide the hosting target and the deploy path.
- Decide where advisor conditions data actually comes from, and whether it lands in
  `data-platform` first or is read directly.
