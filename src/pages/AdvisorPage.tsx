import { ButtonLink, Heading, Row, Section, Stack, Text } from "@/ui";
import { WEEK } from "@/data/advisor";
import { ALL_DOMAINS, domainTiers, isUnset } from "@/lib/sports";
import { Outlook } from "@/components/advisor/Outlook";
import { Recap } from "@/components/advisor/Recap";
import { TodaysCall } from "@/components/advisor/TodaysCall";
import { SampleDataBanner } from "@/components/system/SampleDataBanner";
import { useProfile } from "@/components/profile/ProfileContext";
import { useSession } from "@/components/auth/SessionContext";

const TODAY = WEEK[0];

/**
 * Three things, in the order you'd ask them: what should I do today, what have I just
 * done, and what does the week look like.
 *
 * There used to be a "where to go" section here — a city and pass picker, a ranked list of
 * ski areas and a map. It was ski-specific furniture from when skiing and training were
 * the only two things the site modelled, and it comes back once it can serve whatever
 * sports a person actually ranked.
 */
export function AdvisorPage() {
  const { session } = useSession();
  const { profile } = useProfile();
  const signedIn = session !== null;

  // Signed out there is no profile to read. Signed in but with nothing ranked yet means
  // the question hasn't been answered rather than answered "none", so both fall back to
  // assuming everything. Once a sport is ranked, only what's ranked counts.
  const domains = signedIn && !isUnset(profile.sports) ? domainTiers(profile.sports) : ALL_DOMAINS;

  if (TODAY === undefined) {
    throw new Error("WEEK is empty — the advisor has no day to make a call about.");
  }

  const nothingOn = domains.snow === null && domains.endurance === null;

  return (
    <Stack>
      <Section pad="lg">
        <Stack gap={5}>
          <Stack gap={3}>
            <Heading level={1} size={2}>
              Advisor
            </Heading>
            <Text tone="muted" prose>
              {signedIn
                ? "Your sports, your calendar and the load you're carrying, resolved into one call on what to do next."
                : "Snow, a calendar and a training load, resolved into one call on what to do next. This is the example version — sign in and it reads your data instead."}
            </Text>
          </Stack>

          <SampleDataBanner />

          {nothingOn ? (
            <Row gap={3} wrap className="banner">
              <Text inline size="sm" weight="medium">
                Nothing to weigh up.
              </Text>
              <Text inline size="sm" tone="muted">
                Rank a sport in your profile and the advisor has something to work with.
              </Text>
            </Row>
          ) : null}
        </Stack>
      </Section>

      <Section pad="sm" labelledBy="call-heading">
        <Stack gap={4}>
          <Heading level={2} size={4} id="call-heading" className="section-eyebrow">
            Today
          </Heading>
          <TodaysCall day={TODAY} domains={domains} />
        </Stack>
      </Section>

      {/* Every sample activity is an endurance session, so a profile with only snow sports
          ranked gets no recap rather than someone else's running week. */}
      {domains.endurance !== null ? (
        <Section pad="sm" labelledBy="recap-heading">
          <Stack gap={4}>
            <Heading level={2} size={4} id="recap-heading" className="section-eyebrow">
              Recap
            </Heading>
            <Recap />
          </Stack>
        </Section>
      ) : null}

      <Section pad="sm" labelledBy="outlook-heading">
        <Stack gap={4}>
          <Heading level={2} size={4} id="outlook-heading" className="section-eyebrow">
            Next seven days
          </Heading>
          <Outlook domains={domains} showConditions={domains.snow !== null} />
        </Stack>
      </Section>

      {signedIn ? null : (
        <Section pad="lg">
          <Stack gap={4} align="start" className="advisor-cta">
            <Heading level={2} size={3}>
              Sign in and it stops guessing.
            </Heading>
            <Text tone="muted" prose>
              Rank the sports you actually do and connect Strava and a calendar, and the advisor
              drops what you don't do, reads the load you're carrying, and knows which days are
              already spoken for.
            </Text>
            <ButtonLink to="/login" variant="primary" size="lg">
              Sign in
            </ButtonLink>
          </Stack>
        </Section>
      )}
    </Stack>
  );
}
