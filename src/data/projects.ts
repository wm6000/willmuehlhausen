/**
 * The projects index — the listing page reads this, and nothing else. A project's
 * actual writing lives in its own component under src/components/projects/<slug>/,
 * registered by slug in that folder's registry.ts.
 *
 * The split is deliberate: the index is uniform so the listing can sort, filter and
 * summarise it, while the post below it is free to be whatever that project needs.
 *
 */

export type ProjectTag =
  | "ml"
  | "llm"
  | "pipelines"
  | "platform"
  | "writing"
  | "nlp"
  | "geospatial"
  | "mechanical";

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
  /**
   * Separate from `ml` on purpose. `ml` is a model I trained and can evaluate; `llm` is a
   * model somebody else trained that I prompt and guard. Filing both under one label
   * would blur exactly the distinction the honesty rules exist to keep.
   */
  llm: "LLM",
  geospatial: "Geospatial",
  nlp: "NLP",
  pipelines: "Pipelines",
  platform: "Platform",
  writing: "Writing",
  mechanical: "Mechanical",
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "recadvisor",
    title: "RecAdvisor Blog 1",
    date: "2026-09-16",
    updated: "2026-10-22",
    blurb:
      "I've built myself a training and recreation advisor. This is how that has gone, up to its first dev release.",
    tags: ["platform", "llm", "pipelines"],
    kind: "Product",
  },
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
  {
    slug: "car-camping-beds",
    title: "Car Camping Beds",
    // Known to the year only. formatDate renders an unparseable string as-is, so this
    // prints "2020" rather than claiming a day.
    date: "2020",
    blurb:
      "Four sleeping platforms for car camping, built since 2020, each one an answer to what the last got wrong. The latest is modelled in Onshape.",
    tags: ["mechanical"],
    kind: "Build",
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
