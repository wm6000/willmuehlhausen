/**
 * The projects index — the listing page reads this, and nothing else. A project's
 * actual writing lives in its own component under src/components/projects/<slug>/,
 * registered by slug in that folder's registry.ts.
 *
 * The split is deliberate: the index is uniform so the listing can sort, filter and
 * summarise it, while the post below it is free to be whatever that project needs.
 *
 * TODO: the blurbs below came across from the old site. The posts themselves are
 * scaffolding with placeholder prose — real writing wanted before launch.
 */

export type ProjectTag = "ml" | "pipelines" | "platform" | "writing" | "nlp";

export type Project = {
  slug: string;
  title: string;
  /** ISO date. Authored, not generated — a post's date is a fact about the work. */
  date: string;
  updated?: string;
  /** One or two sentences. This is what the listing shows. */
  blurb: string;
  tags: readonly ProjectTag[];
  /** Named so the listing can say what kind of thing this is at a glance. */
  kind: string;
};

export const TAG_LABELS: Record<ProjectTag, string> = {
  ml: "Machine learning",
  nlp: "NLP",
  pipelines: "Pipelines",
  platform: "Platform",
  writing: "Writing",
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "disaster-response-pipeline",
    title: "Disaster Response Pipeline",
    date: "2026-03-14",
    blurb:
      "An NLP pipeline that classifies incoming messages during a disaster and routes each one to the relief effort that can act on it. Getting the routing wrong costs time nobody has.",
    tags: ["nlp", "ml", "pipelines"],
    kind: "Machine learning",
  },
  {
    slug: "whale-blog",
    title: "Whale Blog",
    date: "2025-11-02",
    updated: "2026-01-19",
    blurb:
      "A content and research blog about whales — what's known, what's contested, and where the data comes from.",
    tags: ["writing"],
    kind: "Writing",
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
