/**
 * The profile shape.
 *
 * Sports come from the Strava catalogue in @/data/sports and are ranked rather than
 * switched: a sport is Primary if you build a week around it, Secondary if it fills the
 * gaps, and simply absent otherwise. The advisor reads those tiers — see @/lib/sports —
 * so a sport you haven't picked is genuinely gone from the reasoning rather than hidden.
 */

import { PASSES, SKI_TYPES } from "@/data/ski";
import type { SportId } from "@/data/sports";

export type Tier = "primary" | "secondary";

/**
 * Only the sports you do. "Off" is the absence of a key rather than a value, because
 * saying "I don't play cricket" is the same as never having mentioned cricket, and
 * storing 40-odd explicit noes would be noise.
 */
export type SportTiers = Partial<Record<SportId, Tier>>;

export const TIER_LABELS: Record<Tier, string> = {
  primary: "Primary",
  secondary: "Secondary",
};

export type SkiPreferences = {
  /** Empty means no preference, not "none" — the advisor treats it as all of them. */
  types: string[];
  passes: string[];
};

export type TargetEvent = {
  /** Stable across edits so React keys and removals don't depend on position. */
  id: string;
  name: string;
  /** ISO yyyy-mm-dd, straight from a native date input. Empty until filled in. */
  date: string;
};

/**
 * What the advisor should know that it can't infer from a feed of activities: what you're
 * working towards, what to avoid, and the dates that matter.
 */
export type PlanContext = {
  goals: string;
  limitations: string;
  events: TargetEvent[];
};

/**
 * Both default to off, and stay off unless the stored value is literally `true`. An email
 * subscription is the one setting where a corrupt or half-written value must not resolve
 * in favour of sending something — nobody has ever been glad to be opted in by a bug.
 */
export type EmailPreferences = {
  daily: boolean;
  weekly: boolean;
};

export type Connections = {
  strava: boolean;
  calendar: boolean;
  location: string;
};

export type Profile = {
  sports: SportTiers;
  context: PlanContext;
  emails: EmailPreferences;
  ski: SkiPreferences;
  connections: Connections;
};

/**
 * Empty, not opinionated. An empty `sports` means "you haven't said yet", which the
 * advisor treats as "assume everything" — see isUnset in @/lib/sports. That keeps a new
 * profile showing the whole product instead of a stub, without inventing sports for you.
 */
export const EMPTY_PROFILE: Profile = {
  sports: {},
  context: { goals: "", limitations: "", events: [] },
  emails: { daily: false, weekly: false },
  ski: { types: [], passes: [] },
  connections: { strava: false, calendar: false, location: "" },
};

export const SKI_TYPE_CHOICES = SKI_TYPES.map((type) => ({ value: type.value, label: type.label }));

/** "Any pass" is a control on the advisor, not a thing you can hold. */
export const PASS_CHOICES = PASSES.filter((pass) => pass !== "Any pass").map((pass) => ({
  value: pass,
  label: pass,
}));
