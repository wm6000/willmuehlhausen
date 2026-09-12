# Deploy

Static build, GitHub Pages, served from `willmuehlhausen.com`.
[.github/workflows/deploy.yml](../.github/workflows/deploy.yml) builds on every push to
`main` and publishes `dist/`.

## Why a custom domain rather than a project path

Pages would otherwise serve this at `wm6000.github.io/willmuehlhausen/`, and the site is
not written to live under a prefix. These paths are absolute strings resolved at runtime,
not imports Vite can rewrite with `base`:

- `BASE` in [src/lib/disaster/load.ts](../src/lib/disaster/load.ts) — `/models/disaster-response`
- the migration photo in the whale post — `/whales/gray-whale-migration.jpg`
- `EXTERNAL.resume` in [src/data/site.ts](../src/data/site.ts) — `/resume.pdf`
- the two `image` values inside [public/whales/shipping.json](../public/whales/shipping.json)

A prefix deploy breaks all of them, and it breaks them **in production only** — the build
succeeds and the failure is four 404s at runtime. Serving from the apex keeps `base` at
`/`, so none of it has to change. It also means buying the domain is the only work: the
alternative was editing five places and undoing that later anyway.

## The SPA fallback

Pages serves static files with no rewrite rule, so a cold load of `/recadvisor` — or any
project post — asks for a file that does not exist. Pages answers unmatched paths with
`404.html`, so the build writes a copy of `index.html` there (`spaFallback` in
[config/vite.config.ts](../config/vite.config.ts)) and the router resolves the route
client-side.

It is generated rather than committed so it cannot drift: a stale copy would load a
previous bundle on exactly the deep links people share.

The response still carries a 404 *status*. That is inherent to the technique on Pages and
does not affect rendering.

## Turning it on

In order. Enabling Pages before DNS resolves leaves the site unreachable, because `CNAME`
tells Pages to serve the custom domain and nothing else.

1. **Register `willmuehlhausen.com`.** As of 2026-09-12 it is unregistered — `.com`
   returns NXDOMAIN.
2. **Point DNS at Pages.** Four A records and four AAAA records at the apex, plus `www`:

   ```
   A     @    185.199.108.153     AAAA  @  2606:50c0:8000::153
   A     @    185.199.109.153     AAAA  @  2606:50c0:8001::153
   A     @    185.199.110.153     AAAA  @  2606:50c0:8002::153
   A     @    185.199.111.153     AAAA  @  2606:50c0:8003::153
   CNAME www  wm6000.github.io.
   ```

   Confirm these against GitHub's own docs at the time — they are stable but they are
   GitHub's to change.

   **The domain is on Cloudflare, which adds two traps.**

   *Proxy off.* Every one of these records must be **DNS only** — the grey cloud, not
   the orange one. Proxied, Cloudflare answers with its own IPs, GitHub cannot complete
   the ACME challenge for the certificate, and **Enforce HTTPS stays permanently greyed
   out**. Cloudflare's zone import defaults new records to proxied, so this has to be
   checked after importing rather than assumed.

   *If the proxy is ever turned on later,* SSL/TLS mode must be **Full** or **Full
   (strict)**. **Flexible** makes Cloudflare talk HTTP to Pages, which redirects to
   HTTPS, which Cloudflare serves again — an infinite redirect loop, and the failure
   looks like the site being down rather than like a TLS setting.
3. **Settings → Pages → Source: GitHub Actions.** Not the older branch-based option; the
   workflow publishes an artifact.
4. **Push, or run the workflow by hand.** `workflow_dispatch` is enabled.
5. **Tick "Enforce HTTPS"** once the certificate is issued. It cannot be ticked until DNS
   resolves, and issuing takes a few minutes after that.

## What the deploy gate covers

`npm run build` runs `npm run lint` first, so a deploy fails rather than publishes when
the structure rules, `tsc`, ESLint, or the parity gate fail. That last one replays 200
messages through the exported model and compares 7,200 predictions against scikit-learn —
the disaster-response post says on the page that it runs the real model, and this is what
keeps that claim true in production.

## Still mock

`DATA_SOURCE.kind` is `"mock"`, so the deployed site carries the sample-data chip and
banner. Deploying changes nothing about that — see the honesty rule in [spec.md](spec.md).
