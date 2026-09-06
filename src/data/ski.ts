/**
 * Ski preferences, ported from the old site.
 *
 * This file used to carry a list of ski areas by city for the advisor's map. The map and
 * its picks came out when the advisor narrowed to today / recap / lookahead; the location
 * data went with them rather than sitting here unread, and comes back from git history
 * when the map does. What's left is what the profile's ski settings are built from.
 */

export type SkiType = "resort" | "backcountry" | "nordic";

export const SKI_TYPES: readonly { value: SkiType; label: string }[] = [
  { value: "resort", label: "Resort" },
  { value: "backcountry", label: "Backcountry" },
  { value: "nordic", label: "Nordic" },
];

export const PASSES = ["Any pass", "Ikon", "Epic", "Indy", "Mountain Collective", "Independent"] as const;
