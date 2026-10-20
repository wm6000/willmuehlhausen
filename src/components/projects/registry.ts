import type { ComponentType } from "react";

import { Post as CarCampingBedsPost } from "@/components/projects/car-camping-beds/Post";
import { Post as DisasterResponsePost } from "@/components/projects/disaster-response-pipeline/Post";
import { Post as RecAdvisorPost } from "@/components/projects/recadvisor/Post";
import { Post as WhaleBlogPost } from "@/components/projects/whale-blog/Post";

/**
 * Slug to post body. This is the seam that lets every project be its own thing: the
 * index in @/data/projects stays uniform so the listing can sort and filter it, while
 * the component below is free to render whatever that project needs — a live demo, a
 * gallery, a set of stats, or plain prose.
 *
 * Adding a project is two edits: an entry in PROJECTS, and a line here.
 */
export const POSTS: Record<string, ComponentType> = {
  recadvisor: RecAdvisorPost,
  "disaster-response-pipeline": DisasterResponsePost,
  "whale-blog": WhaleBlogPost,
  "car-camping-beds": CarCampingBedsPost,
};
