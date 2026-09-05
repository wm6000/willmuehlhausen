import type { AdvisorDay } from "@/data/advisor";
import type { ActivityFlags } from "@/data/profile";

export type Verdict = "ski" | "train" | "rest" | "busy";

/** Signed out, or before a profile exists, the advisor assumes you do everything. */
export const ALL_ACTIVITIES: ActivityFlags = { ski: true, training: true };

/**
 * The whole point of the site in one function: given snow, a calendar, a training load
 * and which sports you actually do, what is the call. Pure and ordered — the first rule
 * that matches wins — so the reasoning can be read top to bottom and argued with.
 *
 * `enabled` is not a filter over the output. A sport switched off is never the answer,
 * which means switching skiing off genuinely changes the advice rather than hiding it.
 */
export function verdictFor(day: AdvisorDay, enabled: ActivityFlags = ALL_ACTIVITIES): Verdict {
  // No room in the day beats everything else. Good snow you cannot get to is not a
  // reason to do anything.
  if (!day.free) {
    return "busy";
  }
  // A hard day already on the plan is what makes powder expensive. Ski instead and the
  // week's key workout is the thing that quietly disappears.
  if (enabled.training && day.load === "high") {
    return "train";
  }
  if (enabled.ski && day.goodSnow) {
    return "ski";
  }
  if (enabled.training) {
    return day.load === "low" ? "train" : "rest";
  }
  // Nothing left that you do. Rest is the only honest answer.
  return "rest";
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  ski: "Ski",
  train: "Train",
  rest: "Rest",
  busy: "Busy",
};

/** The sentence under today's verdict. Says which of the inputs decided it. */
export function reasonFor(day: AdvisorDay, enabled: ActivityFlags = ALL_ACTIVITIES): string {
  const verdict = verdictFor(day, enabled);
  switch (verdict) {
    case "busy":
      return `Your calendar is full. ${day.conditions.toLowerCase()} either way — worth moving something if you can.`;
    case "train":
      return day.goodSnow && enabled.ski
        ? `${day.conditions}, but the plan has ${day.training.toLowerCase()} and that's the week's hard day. Ski tomorrow.`
        : `${day.conditions}. Nothing to chase on the hill, so take the plan: ${day.training.toLowerCase()}.`;
    case "ski":
      return enabled.training
        ? `${day.conditions}, you're free, and the plan is light (${day.training.toLowerCase()}). Go.`
        : `${day.conditions} and you're free. Go.`;
    case "rest":
      return enabled.ski || enabled.training
        ? `${day.conditions}, and you're carrying load from earlier in the week. Take the day.`
        : "Every activity is switched off in your profile, so there's nothing to weigh up. Turn one back on and the advisor has something to say.";
  }
}
