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
   * The home page's h1. It gets the most attention of any line on the site, so it says
   * what I do rather than greeting the reader — "Welcome to my website" spent it on
   * nothing. Separate from `tagline` because the two are read in different places, and a
   * headline aimed at a visitor is the wrong thing to print under a name.
   */
  headline: "I build things that make a decision.",
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
  githubDataPlatform: "https://github.com/wm6000/data-platform",
} as const;

export const COLOPHON = "Built with React, TypeScript and Vite.";
