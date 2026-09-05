import { EMPTY_PROFILE, type ActivityId, type Profile } from "@/data/profile";
import { isTheme } from "@/lib/theme";

/**
 * A profile belongs to one person, so it is stored under that person's key and read
 * back with it. A single shared "profile" key would hand the next person to sign in on
 * this browser the last person's switches — which is exactly what a profile must not do.
 *
 * Signed out there is no key, and therefore no profile to read: `null` means empty, not
 * "whatever was left behind".
 */
function storageKey(email: string | null): string | null {
  return email === null ? null : `profile:${email}`;
}

/**
 * Merged one level deep against EMPTY_PROFILE rather than spread flat: a profile saved
 * before a section existed is missing that key entirely, and a shallow merge would hand
 * the form `undefined` where it expects an object.
 */
function hydrate(parsed: Partial<Profile>): Profile {
  return {
    activities: { ...EMPTY_PROFILE.activities, ...parsed.activities },
    ski: { ...EMPTY_PROFILE.ski, ...parsed.ski },
    training: { ...EMPTY_PROFILE.training, ...parsed.training },
    connections: { ...EMPTY_PROFILE.connections, ...parsed.connections },
    // A scalar, so it is validated rather than merged: a hand-edited or outdated
    // value falls back to following the device instead of setting a bogus attribute.
    theme: isTheme(parsed.theme) ? parsed.theme : EMPTY_PROFILE.theme,
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

/**
 * Everything the profile form edits — which is everything except the theme. The theme
 * lives on the same record but applies the moment it is pressed, so the form must
 * neither count it as an unsaved change nor write a stale copy of it back on Save.
 */
export function editableFields(profile: Profile): Omit<Profile, "theme"> {
  const { theme: _theme, ...rest } = profile;
  return rest;
}

export function enabledCount(profile: Profile): number {
  return Object.values(profile.activities).filter(Boolean).length;
}

export function isEnabled(profile: Profile, id: ActivityId): boolean {
  return profile.activities[id];
}
