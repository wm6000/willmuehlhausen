/**
 * Site-wide content and constants. The header, footer and home page read from here
 * rather than hardcoding copy, so a rename or a new link is a one-line change.
 *
 * `description` is duplicated as the `<meta name="description">` in index.html, which
 * is static and cannot import this file. Change one, change the other.
 */

export const SITE = {
  name: "Will Muehlhausen",
  /** The home page's h1. Separate from `tagline`, which is printed under the name in the footer. */
  headline: "Welcome to my website!",
  /** The identity line, under the name in the footer. */
  tagline: "Building solutions: mechanical, software and anything between.",
  location: "Greater Wenatchee Area",
  description:
    "Engineer, mechanical by training and software by habit. Write-ups of the things I've built — machine learning, data pipelines, factory systems and the occasional map. Greater Wenatchee Area.",
} as const;

export type NavItem = { to: string; label: string; end?: boolean };

/** The top-level nav. Two routes is the whole site now. */
export const NAV: readonly NavItem[] = [
  { to: "/", label: "Home", end: true },
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
  /**
   * RecAdvisor's dev deployment. Invite-only, so it is never rendered as a bare link —
   * the invite-only sentence has to sit next to it or a reader is sent to a refusal.
   *
   * There is deliberately no link to either source repository: both are private, so a
   * link would 404 for everyone who isn't me.
   */
  recadvisorDev: "https://dev.recadvisor.app",
} as const;

export const COLOPHON = "Built with React, TypeScript and Vite.";
