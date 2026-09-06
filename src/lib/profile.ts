import { EMPTY_PROFILE, type PlanContext, type Profile, type SportTiers, type TargetEvent } from "@/data/profile";
import { isSportId } from "@/data/sports";

const STORAGE_KEY_PREFIX = "profile:";

/**
 * A profile belongs to a person, so it is stored under their key. A single shared key
 * would hand the next person to sign in on this browser the last person's answers.
 * Signed out there is no key, and therefore no profile: null means empty, not "whatever
 * was left behind".
 */
function storageKey(email: string | null): string | null {
  return email === null ? null : `${STORAGE_KEY_PREFIX}${email}`;
}

function isTier(value: unknown): value is "primary" | "secondary" {
  return value === "primary" || value === "secondary";
}

/**
 * Stored sports are untyped input twice over — hand-edited storage, and one day a Strava
 * response. An id the catalogue no longer knows, or a tier that isn't one, is dropped
 * rather than trusted into the model.
 */
function hydrateSports(parsed: unknown): SportTiers {
  if (typeof parsed !== "object" || parsed === null) {
    return {};
  }
  const sports: SportTiers = {};
  for (const [id, tier] of Object.entries(parsed as Record<string, unknown>)) {
    if (isSportId(id) && isTier(tier)) {
      sports[id] = tier;
    }
  }
  return sports;
}

function hydrateEvents(parsed: unknown): TargetEvent[] {
  if (!Array.isArray(parsed)) {
    return [];
  }
  const events: TargetEvent[] = [];
  for (const entry of parsed as unknown[]) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }
    const { id, name, date } = entry as Record<string, unknown>;
    if (typeof id === "string" && typeof name === "string" && typeof date === "string") {
      events.push({ id, name, date });
    }
  }
  return events;
}

function hydrateContext(parsed: unknown): PlanContext {
  const source = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  return {
    goals: typeof source["goals"] === "string" ? source["goals"] : "",
    limitations: typeof source["limitations"] === "string" ? source["limitations"] : "",
    events: hydrateEvents(source["events"]),
  };
}

/**
 * Merged against EMPTY_PROFILE rather than spread flat: a profile saved before a section
 * existed is missing that key entirely, and a shallow merge would hand the form
 * `undefined` where it expects an object. The two typed sections validate rather than
 * merge, because their contents come from outside.
 */
function hydrate(parsed: Partial<Profile>): Profile {
  return {
    sports: hydrateSports(parsed.sports),
    context: hydrateContext(parsed.context),
    ski: { ...EMPTY_PROFILE.ski, ...parsed.ski },
    connections: { ...EMPTY_PROFILE.connections, ...parsed.connections },
  };
}

export function loadProfile(email: string | null): Profile {
  const key = storageKey(email);
  if (key === null) {
    return EMPTY_PROFILE;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return EMPTY_PROFILE;
    }
    return hydrate(JSON.parse(raw) as Partial<Profile>);
  } catch {
    // Blocked storage, or a hand-edited value. An empty profile is a fine answer.
    return EMPTY_PROFILE;
  }
}

/** A no-op when signed out. There is nobody for the profile to belong to. */
export function saveProfile(email: string | null, profile: Profile): void {
  const key = storageKey(email);
  if (key === null) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(profile));
  } catch {
    // Not being able to persist shouldn't stop the edit applying for this visit.
  }
}

/** Adds or removes a value. Used by every multi-select preference. */
export function toggleIn(values: readonly string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}
