/**
 * Site-wide content and constants. The header, footer and home page read from here
 * rather than hardcoding copy, so a rename or a new link is a one-line change.
 *
 * `description` is duplicated as the `<meta name="description">` in index.html, which
 * is static and cannot import this file. Change one, change the other.
 */

export const SITE = {
  name: "Will Muehlhausen",
  /**
   * The home page's h1. It sells the visit rather than introducing the author: the
   * advisor is what keeps a stranger on the site, so the first line is what they get
   * from it. Separate from `tagline` because the two are read in different places and
   * a headline aimed at a visitor is the wrong thing to print under a name.
   */
  headline: "Welcome to my website!",
  /** The identity line, under the name in the footer. */
  tagline: "Building solutions: mechanical, software and anything between.",
  location: "Greater Wenatchee Area",
  description:
    "RecAdvisor turns your activity history, calendar and the mountain forecast into one call on the week — and the projects behind it. Engineer, mechanical by training and software by habit. Greater Wenatchee Area.",
} as const;

export type NavItem = { to: string; label: string; end?: boolean };

/** The top-level nav. /profile is deliberately absent — it lives in the auth menu. */
export const NAV: readonly NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/recadvisor", label: "RecAdvisor" },
  { to: "/projects", label: "Projects" },
];

export const EXTERNAL = {
  github: "https://github.com/wm6000",
  githubRepo: "https://github.com/wm6000/willmuehlhausen",
  githubDisasterResponse: "https://github.com/wm6000/disaster-response-pipeline",
  // The handle is william-muehlhausen, not willmuehlhausen — the shorter one 404s.
  linkedin: "https://www.linkedin.com/in/william-muehlhausen",
  email: "mailto:willmuehlhausen@gmail.com",
  /** Served straight out of public/, so it keeps this path whatever the PDF is called. */
  resume: "/resume.pdf",
} as const;

/**
 * Flips every "sample data" affordance at once — the footer chip and the per-page
 * banner. Set to "live" when the advisor is backed by real data, and both vanish.
 * No page may claim real conditions while this says "mock".
 */
export const DATA_SOURCE: { kind: "mock" | "live" } = { kind: "mock" };

export const DISCLAIMER = "Not avalanche-safety or medical advice.";

export const COLOPHON = "Built with React, TypeScript and Vite.";
