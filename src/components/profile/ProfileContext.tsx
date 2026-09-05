import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EMPTY_PROFILE, type Profile } from "@/data/profile";
import { loadProfile, saveProfile } from "@/lib/profile";
import { useSession } from "@/components/auth/SessionContext";

export type ProfileValue = {
  /** The saved profile — what the advisor reads. The form edits a draft of it. */
  profile: Profile;
  save: (profile: Profile) => void;
};

const ProfileContext = createContext<ProfileValue | null>(null);

/**
 * Holds the saved profile, not the form's working copy. The distinction matters: the
 * advisor should change when you press Save, not while you're still deciding.
 *
 * The profile belongs to whoever is signed in, and is loaded under their key. Signing
 * out doesn't just stop it being read — it drops it from memory, so the next person to
 * sign in on this browser starts from their own profile, or an empty one, and never
 * from whatever the last person left behind.
 *
 * Saved to this browser only. It moves server-side with the rest of the backend.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const email = session?.email ?? null;

  const [loaded, setLoaded] = useState<{ email: string | null; profile: Profile }>(() => ({
    email,
    profile: loadProfile(email),
  }));

  // Who is signed in changed, so whose profile this is changed. Re-read during render
  // rather than in an effect, the same way SiteHeader closes its drawer on navigation:
  // an effect would paint one frame of the previous person's profile first.
  if (loaded.email !== email) {
    setLoaded({ email, profile: loadProfile(email) });
  }

  const save = useCallback(
    (next: Profile) => {
      saveProfile(email, next);
      setLoaded({ email, profile: next });
    },
    [email]
  );

  const value = useMemo<ProfileValue>(
    () => ({ profile: loaded.profile, save }),
    [loaded.profile, save]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileValue {
  const value = useContext(ProfileContext);
  if (value === null) {
    throw new Error("useProfile must be used inside <ProfileProvider>.");
  }
  return value;
}

export { EMPTY_PROFILE };
