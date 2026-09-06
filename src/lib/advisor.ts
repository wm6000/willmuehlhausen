import type { AdvisorDay, Load, PastActivity } from "@/data/advisor";
import { ALL_DOMAINS, type DomainTiers } from "@/lib/sports";

export type Verdict = "ski" | "train" | "rest" | "busy";

export type Recap = { sessions: number; miles: number; load: Load };

const EFFORT_RANK: Record<Load, number> = { low: 0, moderate: 1, high: 2 };

/**
 * Summarises the week from the days themselves rather than being told it. A hardcoded
 * "4 sessions, 31 miles" would eventually contradict the list printed underneath it, and
 * the load the advisor keeps citing as a reason ought to be something you can check.
 *
 * A rest day is not a session. The week's load is its hardest day, not its average — one
 * brutal session is what you're carrying, however gentle the rest of the week was.
 */
export function recapOf(activities: readonly PastActivity[]): Recap {
  let sessions = 0;
  let miles = 0;
  let load: Load = "low";

  for (const entry of activities) {
    if (entry.miles === 0 && entry.activity === "Rest") {
      continue;
    }
    sessions += 1;
    miles += entry.miles;
    if (EFFORT_RANK[entry.effort] > EFFORT_RANK[load]) {
      load = entry.effort;
    }
  }

  // Distances are one decimal place; summing floats gets there the long way round.
  return { sessions, miles: Math.round(miles * 10) / 10, load };
}

export { ALL_DOMAINS };

/**
 * The whole point of the site in one function: given snow, a calendar, a training load
 * and which sports you actually do, what is the call. Pure and ordered — the first rule
 * that matches wins — so the reasoning can be read top to bottom and argued with.
 *
 * `domains` is not a filter over the output. A domain you do nothing in is never the
 * answer, which means picking no snow sports genuinely changes the advice rather than
 * hiding half of it.
 */
export function verdictFor(day: AdvisorDay, domains: DomainTiers = ALL_DOMAINS): Verdict {
  // No room in the day beats everything else. Good snow you cannot get to is not a
  // reason to do anything.
  if (!day.free) {
    return "busy";
  }

  const snow = domains.snow;
  const endurance = domains.endurance;

  // The one place the tiers change the answer. Normally a hard day already on the plan
  // outranks powder — but not for someone who builds their week around snow and trains
  // around the edges of it.
  if (snow === "primary" && endurance === "secondary" && day.goodSnow) {
    return "ski";
  }
  // A hard day on the plan is what makes powder expensive. Ski instead and the week's
  // key workout is the thing that quietly disappears.
  if (endurance !== null && day.load === "high") {
    return "train";
  }
  if (snow !== null && day.goodSnow) {
    return "ski";
  }
  if (endurance !== null) {
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

/**
 * The sentence under today's verdict. Says which of the inputs decided it — and mentions
 * the snow only to someone who does a snow sport. Telling a runner about fresh powder
 * would be exactly the "hidden rather than gone" failure the tiers exist to prevent.
 */
export function reasonFor(day: AdvisorDay, domains: DomainTiers = ALL_DOMAINS): string {
  const verdict = verdictFor(day, domains);
  const snow = domains.snow !== null;
  const session = day.training.toLowerCase();

  switch (verdict) {
    case "busy":
      return snow
        ? `Your calendar is full. ${day.conditions.toLowerCase()} either way — worth moving something if you can.`
        : "Your calendar is full today. Worth moving something if you can.";
    case "train":
      if (snow && day.goodSnow) {
        return `${day.conditions}, but the plan has ${session} and that's the week's hard day. Ski tomorrow.`;
      }
      return snow
        ? `${day.conditions}. Nothing to chase on the hill, so take the plan: ${session}.`
        : `Take the plan: ${session}.`;
    case "ski":
      if (domains.snow === "primary" && domains.endurance === "secondary") {
        return `${day.conditions}. Snow is what you're here for, so the session waits.`;
      }
      return domains.endurance !== null
        ? `${day.conditions}, you're free, and the plan is light (${session}). Go.`
        : `${day.conditions} and you're free. Go.`;
    case "rest":
      if (!snow && domains.endurance === null) {
        return "Nothing in your profile is something the advisor can plan around yet. Rank a sport and it has something to say.";
      }
      return snow
        ? `${day.conditions}, and you're carrying load from earlier in the week. Take the day.`
        : "You're carrying load from earlier in the week. Take the day.";
  }
}
