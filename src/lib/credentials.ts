/**
 * The rules this site's own login enforces, modelled on strava.com's: an email
 * address, and a password of at least 8 characters. Pure and framework-free, so
 * the same rules can back a real server-side check without being rewritten.
 */

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Deliberately loose — something@something.tld. Anything stricter starts rejecting
 * addresses that are genuinely deliverable, and only sending a mail proves one works.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(normalizeEmail(value));
}

/** Null when it passes. The string is read by a person, so it says what to do next. */
export function emailError(value: string): string | null {
  if (normalizeEmail(value) === "") {
    return "Enter your email address.";
  }
  if (!isValidEmail(value)) {
    return "That doesn't look like an email address.";
  }
  return null;
}

export function passwordError(value: string): string | null {
  if (value === "") {
    return "Enter your password.";
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Passwords are at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return null;
}

/** "will.muehlhausen@example.com" -> "Will Muehlhausen". The best guess from what we have. */
export function nameFromEmail(email: string): string {
  const local = normalizeEmail(email).split("@")[0] ?? "";
  const words = local
    .split(/[._\-+]+/)
    .filter((part) => part !== "")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return words.length === 0 ? "You" : words.join(" ");
}

/** Two letters for the avatar, from the name we guessed. */
export function initials(name: string): string {
  const words = name.split(" ").filter((word) => word !== "");
  const first = words[0]?.charAt(0) ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

/**
 * Only ever return a path on this site. A returnTo carrying an absolute URL, or a
 * protocol-relative "//evil.example", is an open redirect — the classic way a login
 * page gets turned into someone else's phishing hop.
 */
export function safeReturnTo(value: string | null, fallback: string): string {
  if (value === null || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
