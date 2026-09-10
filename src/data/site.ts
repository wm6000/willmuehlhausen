/**
 * Site-wide content and constants. The header and footer read from here rather
 * than hardcoding copy, so a rename or a new link is a one-line change.
 *
 * TODO before launch: replace the placeholder URLs below.
 */

export const SITE = {
  name: "Will Muehlhausen",
  tagline: "Software, data and AI engineering.",
  location: "Seattle, WA",
  description: "Software, data and AI engineering. Seattle, WA.",
} as const;

export type NavItem = { to: string; label: string; end?: boolean };

/** The top-level nav. /profile is deliberately absent — it lives in the auth menu. */
export const NAV: readonly NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/advisor", label: "Advisor" },
  { to: "/projects", label: "Projects" },
];

export const EXTERNAL = {
  github: "https://github.com/wm6000",
  githubRepo: "https://github.com/wm6000/willmuehlhausen",
  githubDisasterResponse: "https://github.com/wm6000/disaster-response-pipeline",
  linkedin: "https://www.linkedin.com/in/willmuehlhausen",
  email: "mailto:willmuehlhausen@gmail.com",
} as const;

/**
 * Flips every "sample data" affordance at once — the footer chip and the per-page
 * banner. Set to "live" when the advisor is backed by real data, and both vanish.
 * No page may claim real conditions while this says "mock".
 */
export const DATA_SOURCE: { kind: "mock" | "live" } = { kind: "mock" };

export const DISCLAIMER = "Not avalanche-safety or medical advice.";

export const COLOPHON = "Built with React, TypeScript and Vite.";
