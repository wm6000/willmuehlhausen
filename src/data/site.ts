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
   * The home page's h1. The site is a portfolio again — RecAdvisor moved to its own
   * domain — so the first line sells the work rather than the product. Separate from
   * `tagline` because the two are read in different places and a headline aimed at a
   * visitor is the wrong thing to print under a name.
   */
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
   * RecAdvisor lives on its own domain and its own deploy. It is linked from here as a
   * project rather than routed to: nothing about it renders in this app any more, so a
   * router link would be a promise this bundle cannot keep.
   */
  recadvisor: "https://recadvisor.app",
} as const;

export const COLOPHON = "Built with React, TypeScript and Vite.";
