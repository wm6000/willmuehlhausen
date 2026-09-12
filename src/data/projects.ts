/**
 * The projects index — the listing page reads this, and nothing else. A project's
 * actual writing lives in its own component under src/components/projects/<slug>/,
 * registered by slug in that folder's registry.ts.
 *
 * The split is deliberate: the index is uniform so the listing can sort, filter and
 * summarise it, while the post below it is free to be whatever that project needs.
 *
 */

export type ProjectTag = "ml" | "pipelines" | "platform" | "writing" | "nlp" | "geospatial";

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
  geospatial: "Geospatial",
  nlp: "NLP",
  pipelines: "Pipelines",
  platform: "Platform",
  writing: "Writing",
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "disaster-response-pipeline",
    title: "Disaster Response Pipeline",
    date: "2023-05-14",
    updated: "2026-09-09",
    blurb:
      "An NLP pipeline that takes messages sent during real disasters — tweets and direct messages — and sorts each one so it reaches the response organisation or team that can help. Along with an honest look at which categories it handles well and which it doesn't.",
    tags: ["nlp", "ml", "pipelines"],
    kind: "Machine learning",
  },
  {
    slug: "whale-blog",
    title: "Whales, Shipping, and Collisions",
    date: "2023-04-30",
    blurb:
      "Where whale sightings along the West Coast overlap with global shipping traffic, and what rerouting a few shipping lanes around Los Angeles, San Francisco and San Diego would be worth.",
    tags: ["writing", "geospatial"],
    kind: "Analysis",
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
