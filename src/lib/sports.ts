import { SPORTS, sportById, type Sport, type SportCategory, type SportId } from "@/data/sports";
import type { SportTiers, Tier } from "@/data/profile";

/**
 * What the advisor actually reasons about. It has snow and it has training load; it does
 * not have swell, wind or a squash court booking. Each domain carries the strongest tier
 * among the sports feeding it, or null when you do none of them.
 */
export type DomainTiers = { snow: Tier | null; endurance: Tier | null };

/** Signed out, or before anything has been picked, the advisor assumes you do everything. */
export const ALL_DOMAINS: DomainTiers = { snow: "primary", endurance: "primary" };

export type ChosenSport = { sport: Sport; tier: Tier };

/** In catalogue order, Primary before Secondary. */
export function chosenSports(tiers: SportTiers): ChosenSport[] {
  const chosen: ChosenSport[] = [];
  for (const sport of SPORTS) {
    const tier = tiers[sport.id];
    if (tier !== undefined) {
      chosen.push({ sport, tier });
    }
  }
  return [
    ...chosen.filter((entry) => entry.tier === "primary"),
    ...chosen.filter((entry) => entry.tier === "secondary"),
  ];
}

/**
 * Nothing picked at all. Deliberately not the same as "you do nothing": it means the
 * question hasn't been answered, so the advisor carries on assuming everything and the
 * profile asks you to fill it in.
 */
export function isUnset(tiers: SportTiers): boolean {
  return chosenSports(tiers).length === 0;
}

export function tierOf(tiers: SportTiers, id: SportId): Tier | null {
  return tiers[id] ?? null;
}

/** How many sports in a category are picked, for the collapsed group headers. */
export function countInCategory(tiers: SportTiers, category: SportCategory): number {
  return chosenSports(tiers).filter((entry) => entry.sport.category === category).length;
}

const RANK: Record<Tier, number> = { primary: 2, secondary: 1 };

/** The strongest tier wins: one Primary snow sport makes snow Primary. */
export function domainTiers(tiers: SportTiers): DomainTiers {
  const strongest: DomainTiers = { snow: null, endurance: null };

  for (const { sport, tier } of chosenSports(tiers)) {
    if (sport.domain === null) {
      continue;
    }
    const current = strongest[sport.domain];
    if (current === null || RANK[tier] > RANK[current]) {
      strongest[sport.domain] = tier;
    }
  }

  return strongest;
}

/**
 * Picked, but the advisor has nothing to say about it — golf, tennis, surfing. Surfaced
 * on the profile so a Primary-ranked sport can't silently do nothing.
 */
export function chosenWithoutDomain(tiers: SportTiers): Sport[] {
  return chosenSports(tiers)
    .filter((entry) => entry.sport.domain === null)
    .map((entry) => entry.sport);
}

/** Drops ids the catalogue no longer knows, so a sport Strava renamed can't linger. */
export function setTier(tiers: SportTiers, id: SportId, tier: Tier | null): SportTiers {
  const next: SportTiers = { ...tiers };
  if (tier === null) {
    delete next[id];
  } else {
    next[id] = tier;
  }
  return next;
}

export function labelFor(id: SportId): string {
  return sportById(id).label;
}
