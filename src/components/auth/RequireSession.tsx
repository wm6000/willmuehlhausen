import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";

import { useSession } from "@/components/auth/SessionContext";

/**
 * Gates a route behind a session, remembering where the visitor was headed so the
 * login can put them back there. `replace` keeps the bounce out of history — Back
 * from the login should leave the site's last real page, not loop through the gate.
 */
export function RequireSession({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const { pathname } = useLocation();

  if (session === null) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(pathname)}`} replace />;
  }

  return <>{children}</>;
}
