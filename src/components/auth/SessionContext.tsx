import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { nameFromEmail, normalizeEmail } from "@/lib/credentials";

export type Session = {
  email: string;
  name: string;
  /** ISO timestamp. Enough to show "signed in since" without a server. */
  signedInAt: string;
};

export type SessionValue = {
  session: Session | null;
  signIn: (email: string, remember: boolean) => void;
  signOut: () => void;
};

const STORAGE_KEY = "session";

/**
 * "Remember me" is the choice between the two stores, which is exactly the
 * distinction the browser already draws: localStorage outlives the tab,
 * sessionStorage dies with it.
 */
function storeFor(remember: boolean): Storage | null {
  try {
    return remember ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readSession(): Session | null {
  for (const remember of [true, false]) {
    const raw = storeFor(remember)?.getItem(STORAGE_KEY) ?? null;
    if (raw === null) {
      continue;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null && "email" in parsed && "name" in parsed) {
        return parsed as Session;
      }
    } catch {
      // A half-written or hand-edited value is not a session. Fall through to signed out.
    }
  }
  return null;
}

function clearStored(): void {
  storeFor(true)?.removeItem(STORAGE_KEY);
  storeFor(false)?.removeItem(STORAGE_KEY);
}

const SessionContext = createContext<SessionValue | null>(null);

/**
 * A mock session: it records who says they are signed in, and nothing else. No
 * password is checked, nothing is sent anywhere, and there is no token — the login
 * page says so in as many words. Real auth replaces the body of `signIn` and
 * nothing else, because everything downstream only ever reads `session`.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);

  const signIn = useCallback((email: string, remember: boolean) => {
    const normalized = normalizeEmail(email);
    const next: Session = {
      email: normalized,
      name: nameFromEmail(normalized),
      signedInAt: new Date().toISOString(),
    };

    // Write to one store only, so an unremembered sign-in can't be resurrected
    // from a remembered one left behind by an earlier visit.
    clearStored();
    try {
      storeFor(remember)?.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Site data blocked. The session still holds for this page's lifetime.
    }
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearStored();
    setSession(null);
  }, []);

  const value = useMemo<SessionValue>(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error("useSession must be used inside <SessionProvider>.");
  }
  return value;
}
