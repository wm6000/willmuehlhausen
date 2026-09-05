import { Heading, Row, Section, Stack, Text } from "@/ui";
import { ACTIVITIES } from "@/data/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfile } from "@/components/profile/ProfileContext";
import { useSession } from "@/components/auth/SessionContext";

export function ProfilePage() {
  const { session } = useSession();
  const { profile } = useProfile();

  const on = ACTIVITIES.filter((activity) => profile.activities[activity.id]);

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
            {on.length === 0
              ? "Every activity is currently off."
              : `Currently on: ${on.map((activity) => activity.label.toLowerCase()).join(" and ")}.`}
          </Text>
        </Row>

        {/* Keyed by who is signed in, so a different person gets a fresh form rather
            than the previous one's unsaved draft. */}
        <ProfileForm key={session?.email ?? "signed-out"} />
      </Stack>
    </Section>
  );
}
