# Sign-in

The site's own login, with strava.com's as the model. Connecting Strava as a *data
source* is a different thing and lives on the profile page — this doc is only about
getting into the site.

## The flow

Email first, then password:

```
/login                          /login (step 2)
┌──────────────────┐            ┌──────────────────────┐
│ Email            │            │ will@example.com  [Change]
│ [______________] │  Continue  │ Password             │
│                  │ ─────────► │ [____________] [👁]   │
│    [ Continue ]  │            │ ☑ Remember me        │
└──────────────────┘            │    [ Log in ]        │
                                └──────────────────────┘
                                          │
                                          ▼
                                   returnTo, or /profile
```

Strava splits the steps because the email decides what the second step is — a password,
or a handoff to a provider the account is linked to. Ours is always a password today,
and won't be once accounts can be linked, which is why the split is worth keeping now.

## Requirements

| Rule | Value | Where |
|---|---|---|
| Email | must look like `x@y.tld` | `emailError` in [src/lib/credentials.ts](../src/lib/credentials.ts) |
| Password | at least 8 characters | `passwordError`, same file — Strava's minimum |
| Remember me | on by default | `LoginForm`, and it picks the storage below |
| Errors | on submit, then on every keystroke for a field that has already failed | `LoginForm` |
| Redirect after sign-in | `?returnTo=`, else `/profile` | `safeReturnTo` |

Validation lives in `src/lib/credentials.ts` and nothing else — it is pure, so the same
rules can back a real server-side check without being rewritten for it.

**`returnTo` only ever accepts a path on this site.** A value starting `http://` or `//`
is dropped for the fallback. A login page that redirects anywhere it's told is an open
redirect, and the standard way one gets borrowed as a phishing hop.

## Session

`SessionProvider` ([src/components/auth/SessionContext.tsx](../src/components/auth/SessionContext.tsx))
holds `{ email, name, signedInAt }` and nothing else. **Remember me is the choice between
the two browser stores**, which is the distinction the browser already draws:
`localStorage` outlives the tab, `sessionStorage` dies with it. Signing in writes to one
and clears the other, so an unremembered sign-in can't be resurrected from a remembered
one left behind by an earlier visit.

It is a **mock session**: no password is checked, nothing is sent anywhere, there is no
token. The login page says exactly that, in the same spirit as the `DATA_SOURCE` rule in
[the spec](spec.md) — the site does not imply a real check it isn't making. Real auth
replaces the body of `signIn` and nothing else, because everything downstream only ever
reads `session`.

- `RequireSession` gates a route and remembers where the visitor was headed. `/profile`
  is behind it.
- `/login` redirects away when there's already a session — it has nothing to offer.
- `AuthMenu` is the avatar, a link to the profile, and sign out.

## Deliberately not copied from Strava

- **The third-party row** (Google / Apple / Facebook). We aren't a consumer of those, and
  "Connect with Strava" belongs on the profile page as a data connection, not here as an
  identity provider.
- **Sign up and password reset.** Both need the backend; the form says so rather than
  offering links that go nowhere.
- **A dropdown account menu.** Detecting a click outside a popup needs a ref to a real
  element, and those live in `src/ui/` only (rule 3). Avatar, Profile and Sign out are
  laid out flat instead. If it ever needs to be a popup, the ref target belongs in
  `src/ui/escapes/`.

## Known gap

A two-step form hides the email field on step 2, and password managers key on seeing a
username and password field together. Strava keeps a hidden username field on the second
step for exactly this. Ours doesn't yet, so a manager may not offer to fill or save. The
fix is a `readOnly`, visually-hidden `autoComplete="username"` input alongside the
password — worth doing before this page is used in anger.
