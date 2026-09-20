# Docs

Written-down decisions and intent for willmuehlhausen.com — the things that aren't
recoverable from reading the code.

| Doc | What's in it |
|---|---|
| [spec.md](spec.md) | What the site is, what each route owes the visitor, and the rules that don't bend |
| [projects.md](projects.md) | How the projects blog works — the index/post split, adding a project, and what a post's custom feature may do |
| [deploy.md](deploy.md) | Hosting, DNS, the SPA fallback, and what the deploy gate covers |

RecAdvisor moved to its own repo and its own domain — `auth.md` and `emails.md` went with
it. They are in this repo's history up to the split if you need what they said.

Working in the code itself — structure rules, TypeScript gotchas, how to verify without a
test framework — is in [AGENTS.md](../AGENTS.md) at the repo root.

## Conventions

- One topic per file, lowercase-kebab filenames. Add a row above when you add one.
- The code is the source of truth for *how*; these docs are the source of truth for
  *what* and *why*. When they disagree, the code won, and the doc is the bug.
- `README.md` at the repo root stays the short version: install, scripts, structure
  rules. Anything longer-lived than a paragraph belongs here.
