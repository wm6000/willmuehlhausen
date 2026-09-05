export type Theme = "light" | "dark" | "system";

const THEMES: readonly Theme[] = ["light", "dark", "system"];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/**
 * Applies a theme to the document, and nothing else. The choice itself is a field on
 * the profile — it belongs to the person, and goes to the database with the rest of
 * their record — so storing it is @/lib/profile's job, not this file's.
 *
 * "system" removes the attribute, handing the choice back to prefers-color-scheme.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
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
