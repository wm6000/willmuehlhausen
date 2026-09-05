export type Theme = "light" | "dark" | "system";

const THEMES: readonly Theme[] = ["light", "dark", "system"];

/**
 * The theme belongs to a person, not to a browser, so it is stored under their key
 * the same way their profile is. Signed out there is no key and no stored choice —
 * the site follows the device, and nobody inherits the last person's theme.
 *
 * The inline script in index.html resolves this same key before first paint. If the
 * shape here changes, that script has to change with it.
 */
function storageKey(email: string | null): string | null {
  return email === null ? null : `theme:${email}`;
}

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function readTheme(email: string | null): Theme {
  const key = storageKey(email);
  if (key === null) {
    return "system";
  }
  try {
    const stored = window.localStorage.getItem(key);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Private browsing, or site data blocked. System default is a fine answer.
    return "system";
  }
}

/** "system" removes the attribute, handing the choice back to prefers-color-scheme. */
export function applyTheme(email: string | null, theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }

  const key = storageKey(email);
  if (key === null) {
    // Nobody to remember it for. Applied for this page, not stored.
    return;
  }
  try {
    window.localStorage.setItem(key, theme);
  } catch {
    // Not being able to remember the choice shouldn't stop it applying now.
  }
}

export function nextTheme(theme: Theme): Theme {
  const index = THEMES.indexOf(theme);
  return THEMES[(index + 1) % THEMES.length] ?? "system";
}

export const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};
