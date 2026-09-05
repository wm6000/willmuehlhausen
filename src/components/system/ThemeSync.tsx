import { useEffect } from "react";

import { applyTheme } from "@/lib/theme";
import { useProfile } from "@/components/profile/ProfileContext";

/**
 * The only thing that applies a theme to the document. It watches the saved profile,
 * so it covers every case for free: pressing the toggle, signing in as someone whose
 * theme differs, and signing out — which loads the empty profile and so returns the
 * page to following the device rather than leaving the last person's theme behind.
 *
 * Renders nothing. The inline script in index.html handles a full page load, before
 * any of this exists.
 */
export function ThemeSync() {
  const { profile } = useProfile();

  useEffect(() => {
    applyTheme(profile.theme);
  }, [profile.theme]);

  return null;
}
