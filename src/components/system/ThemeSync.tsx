import { useEffect } from "react";

import { applyTheme, readTheme } from "@/lib/theme";
import { useSession } from "@/components/auth/SessionContext";

/**
 * Applies the signed-in person's theme, and re-applies it whenever who is signed in
 * changes. Renders nothing.
 *
 * The inline script in index.html covers a full page load. This covers the two cases
 * it can't: signing in, where the theme should switch to that person's without a
 * reload, and signing out, where their choice must be dropped rather than left on
 * the page for whoever is next.
 */
export function ThemeSync() {
  const { session } = useSession();
  const email = session?.email ?? null;

  useEffect(() => {
    applyTheme(email, readTheme(email));
  }, [email]);

  return null;
}
