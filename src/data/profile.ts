/**
 * The profile shape, and the activities it can switch on and off.
 *
 * An activity being off is not a display preference — it's the advisor being told that
 * a whole sport is irrelevant to you, and it drops that sport everywhere: no ski picks,
 * no map, and never a "Ski" verdict. That's what makes the switch worth having rather
 * than a filter.
 */

import { PASSES, SKI_TYPES } from "@/data/ski";
import type { Theme } from "@/lib/theme";

export type ActivityId = "ski" | "training";

export type Activity = {
  id: ActivityId;
  label: string;
  /** What turning it off actually does, said plainly next to the switch. */
  description: string;
};

export const ACTIVITIES: readonly Activity[] = [
  {
    id: "ski",
    label: "Skiing",
    description:
      "Snow conditions, where to go, and whether today is worth taking. Off, and the advisor stops mentioning the mountains entirely.",
  },
  {
    id: "training",
    label: "Training",
    description:
      "Running and workload — what the plan wants, and what you're carrying from earlier in the week. Off, and no session is ever suggested.",
  },
];

export type ActivityFlags = Record<ActivityId, boolean>;

export type SkiPreferences = {
  /** Empty means no preference, not "none" — the advisor treats it as all of them. */
  types: string[];
  passes: string[];
};

export type TrainingPreferences = {
  goals: string;
  limitations: string;
};

export type Connections = {
  strava: boolean;
  calendar: boolean;
  location: string;
};

export type Profile = {
  activities: ActivityFlags;
  ski: SkiPreferences;
  training: TrainingPreferences;
  connections: Connections;
  /**
   * A field on the record, not a browser setting: it belongs to the person and goes
   * to the database with everything else here. It is the one field the profile form
   * doesn't edit — see `editableFields` — because a theme has to apply the instant
   * it's pressed rather than waiting for Save.
   */
  theme: Theme;
};

/** Everything on by default: a new profile should show the whole product, not a stub. */
export const EMPTY_PROFILE: Profile = {
  activities: { ski: true, training: true },
  theme: "system",
  ski: { types: [], passes: [] },
  training: { goals: "", limitations: "" },
  connections: { strava: false, calendar: false, location: "" },
};

export const SKI_TYPE_CHOICES = SKI_TYPES.map((type) => ({ value: type.value, label: type.label }));

/** "Any pass" is a control on the advisor, not a thing you can hold. */
export const PASS_CHOICES = PASSES.filter((pass) => pass !== "Any pass").map((pass) => ({
  value: pass,
  label: pass,
}));
