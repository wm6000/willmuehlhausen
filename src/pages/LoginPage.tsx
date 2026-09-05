import { Navigate, useSearchParams } from "react-router";

import { Heading, Section, Stack, Text } from "@/ui";
import { LoginForm } from "@/components/auth/LoginForm";
import { useSession } from "@/components/auth/SessionContext";
import { safeReturnTo } from "@/lib/credentials";

export function LoginPage() {
  const { session } = useSession();
  const [params] = useSearchParams();

  // Already signed in: the login page has nothing to offer, so honour the returnTo
  // rather than showing a form that would only sign the same person in again.
  if (session !== null) {
    return <Navigate to={safeReturnTo(params.get("returnTo"), "/profile")} replace />;
  }

  return (
    <Section pad="lg" narrow>
      <Stack gap={6}>
        <Stack gap={3}>
          <Heading level={1} size={2}>
            Sign in
          </Heading>
          <Text tone="muted" prose>
            Signing in is what lets the advisor read your training history, your calendar and your
            preferences instead of running on example data.
          </Text>
        </Stack>
        <LoginForm />
      </Stack>
    </Section>
  );
}
