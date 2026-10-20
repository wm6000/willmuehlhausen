/**
 * The four beds, oldest first.
 *
 * Same shape as the RecAdvisor timeline, for the same reason: the post is a build log, so
 * a new version is one object at the END of this array and never an edit to prose in the
 * middle of Post.tsx. Rendered in array order, not sorted.
 *
 * `when` is a plain string rather than an ISO date because most of these are known to the
 * year at best, and formatDate would render "2020-01-01" as January 1, 2020 — a precision
 * nobody has. Write what is actually known.
 *
 * Everything in square brackets is a placeholder, and says so on the page. Replace it
 * with what really happened; don't smooth it into plausible prose.
 */

export type Shot = {
  /** Under public/car-camping-beds/, referenced by absolute path so it's fetched, not bundled. */
  src: string;
  alt: string;
  caption?: string | undefined;
};

export type Version = {
  name: string;
  when: string;
  title: string;
  paragraphs: readonly string[];
  shots: readonly Shot[];
};

export const VERSIONS: readonly Version[] = [
  {
    name: "Version 1",
    when: "2020",
    title: "[Placeholder title — the first bed]",
    paragraphs: [
      "[Placeholder. What vehicle it went in, what it was built from, and why build one at all rather than sleep on the folded seats or buy something.]",
      "[Placeholder. What it got wrong — the thing that made a second version worth building.]",
    ],
    shots: [],
  },
  {
    name: "Version 2",
    when: "[Year]",
    title: "[Placeholder title — the second bed]",
    paragraphs: [
      "[Placeholder. What changed from version 1, and which problem that change was answering.]",
      "[Placeholder. What it still got wrong.]",
    ],
    shots: [],
  },
  {
    name: "Version 3",
    when: "[Year]",
    title: "[Placeholder title — the third bed]",
    paragraphs: [
      "[Placeholder. What changed from version 2, and which problem that change was answering.]",
      "[Placeholder. What it still got wrong.]",
    ],
    shots: [],
  },
  {
    name: "Version 4",
    when: "[Year]",
    title: "[Placeholder title — the current bed, designed in Onshape]",
    paragraphs: [
      "[Placeholder. The best-documented version, modelled in Onshape. What modelling it changed — about the design, the build, or how many mistakes made it into wood.]",
      "[Placeholder. Dimensions, materials, how it fits and comes out of the vehicle, what it stores underneath — whatever the Onshape model documents.]",
    ],
    shots: [],
  },
];
