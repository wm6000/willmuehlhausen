# Emails

Three switches exist on `/profile` — Morning, Evening and Weekly — and nothing sends them,
because there is no backend to send with.

**The switches are built; the sending is not.** `EmailPreferences` in
[src/data/profile.ts](../src/data/profile.ts) is `{ morning, evening, weekly }`. Everything
under *Sends are in the recipient's local time* below is still a requirement, not a
description — it is written down because it is cheap to design for and expensive to
retrofit.

## Three sends, not two

| Send | Carries | Why then |
|---|---|---|
| **Evening** | Tomorrow's call | People plan the next day the night before — this is the one that changes what someone actually does |
| **Morning** | Today's call, the same one `/recadvisor` opens with | For the decision you make on the way out of the door |
| **Weekly** | The recap, plus the week ahead | Sunday |

`daily` **split** rather than gaining a sibling. It described itself as "the morning's
call", so `hydrateEmails` in [src/lib/profile.ts](../src/lib/profile.ts) migrates a stored
`daily: true` to `morning` and **never** to `evening`: somebody who agreed to one email a
day still gets one email a day. Migrating them into both would be doubling the mail on the
strength of a rename, which is the same consent failure as opting them in from scratch.

Tomorrow's call needs no new data: `WEEK[1]` in [src/data/advisor.ts](../src/data/advisor.ts)
is already Tomorrow, and `verdictFor` takes any day. Nothing renders it yet — the evening
send is the first thing that will.

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

**RecAdvisor's own "today" is the same question.** `WEEK[0]` is Today relative to whoever
is reading. An evening email about tomorrow has to agree with what the site shows, so the
zone that schedules the send is also the zone that decides which day the content is about.

## What carries over from what's built

The opt-in rules in [spec.md](spec.md) hold for all three switches: default off, and
`hydrateEmails` reads stored values with `=== true` rather than merging, so nothing but a
literal true subscribes anybody. The split didn't relax that — it made it matter more,
since there are now three ways to get it wrong and a migration path as a fourth.

And until something actually sends, the section on `/profile` says so.
