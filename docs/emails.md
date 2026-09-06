# Emails

Two switches exist on `/profile` — Daily and Weekly — and nothing sends them, because there
is no backend to send with. This is what they are meant to become, written down before it's
built because the timezone part is cheap to design for and expensive to retrofit.

**Nothing here is implemented.** The current model is `{ daily, weekly }` in
[src/data/profile.ts](../src/data/profile.ts).

## Three sends, not two

| Send | Carries | Why then |
|---|---|---|
| **Evening** | Tomorrow's call | People plan the next day the night before — this is the one that changes what someone actually does |
| **Morning** | Today's call, the same one `/advisor` opens with | For the decision you make on the way out of the door |
| **Weekly** | The recap, plus the week ahead | Sunday |

So `EmailPreferences` becomes `{ morning, evening, weekly }` — `daily` **splits** rather
than gaining a sibling. Anyone already opted into `daily` has to land somewhere explicit;
migrating them to both is opting them into something they didn't ask for, so the honest
default is morning only, or neither with a prompt.

Tomorrow's call needs no new data: `WEEK[1]` in [src/data/advisor.ts](../src/data/advisor.ts)
is already Tomorrow, and `verdictFor` takes any day.

## Sends are in the recipient's local time

"First thing" and "the evening" mean nothing in UTC. This is the constraint that shapes
everything else.

**Store an IANA zone, never an offset.** `America/Los_Angeles`, not `UTC-8`. An offset is
wrong for half the year — a 7am send pinned to one arrives at 8am after the clocks change —
and DST rules differ by country in ways only the zone database knows.

**Seed it from the browser; let the person change it.**
`Intl.DateTimeFormat().resolvedOptions().timeZone` is a good default and a bad authority:
it is the device's opinion. Travellers, dual-zone lives and misconfigured machines all break
it, and the failure is silent — mail simply arrives at the wrong hour.

**It's a profile field of its own.** It belongs on the record with everything else, and
goes to the database with it. Explicitly **not** derived from `connections.location`, which
is free text somebody typed ("Seattle, WA", "PNW", "home") and cannot reliably resolve to a
zone.

**"7am for everyone" is not one cron job.** Local-time sends mean either hourly buckets that
sweep whichever zones are due in that hour, or a scheduled job per recipient. Which one is a
real decision about the sending infrastructure, and making it before the infrastructure
exists is the whole reason this file is here.

**DST transitions need a defined answer.** On the spring-forward day the local hour a send
is scheduled in may not exist; on the autumn day it happens twice. Skip or clamp — but
decide, because the failure modes are a silently missing send and a duplicate, and both look
like bugs in something else.

**The advisor's own "today" is the same question.** `WEEK[0]` is Today relative to whoever
is reading. An evening email about tomorrow has to agree with what the site shows, so the
zone that schedules the send is also the zone that decides which day the content is about.

## What carries over from what's built

The opt-in rules in [spec.md](spec.md) hold for all three switches, not just the two that
exist today: default off, and `hydrateEmails` in [src/lib/profile.ts](../src/lib/profile.ts)
reads stored values with `=== true` rather than merging, so nothing but a literal true
subscribes anybody. Splitting `daily` doesn't relax that — it makes it matter more, since
there are then three ways to get it wrong.

And until something actually sends, the section on `/profile` says so.
