import { Heading, Row, Section, Stack, Text } from "@/ui";
import { chosenSports, isUnset } from "@/lib/sports";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfile } from "@/components/profile/ProfileContext";
import { useSession } from "@/components/auth/SessionContext";

export function ProfilePage() {
  const { session } = useSession();
  const { profile } = useProfile();

  const chosen = chosenSports(profile.sports);
  const primary = chosen.filter((entry) => entry.tier === "primary").length;

  return (
    <Section pad="lg" narrow>
      <Stack gap={6}>
        <Stack gap={3}>
          <Heading level={1} size={2}>
            Profile
          </Heading>
          <Text tone="muted" prose>
            {session === null
              ? "What the advisor knows about you."
              : `Signed in as ${session.email}. This is what the advisor knows about you — and, just as much, what it should stop bringing up.`}
          </Text>
        </Stack>

        <Row gap={3} wrap className="banner">
          <Text inline size="sm" weight="medium">
            Saved to this browser only.
          </Text>
          <Text inline size="sm" tone="muted">
            Nothing is sent anywhere, and no account is really connected. Cloud sync arrives with
            the backend.{" "}
            {isUnset(profile.sports)
              ? "No sports ranked yet, so the advisor is assuming you do everything."
              : `${chosen.length} ${chosen.length === 1 ? "sport" : "sports"} ranked, ${primary} primary.`}
          </Text>
        </Row>

        <ProfileForm />
      </Stack>
    </Section>
  );
}
