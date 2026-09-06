import { useMemo, useState } from "react";

import { ButtonLink, Heading, Row, Section, Stack, Text } from "@/ui";
import { SKI_LOCATIONS_BY_CITY, type City, type SkiType } from "@/data/ski";
import { WEEK } from "@/data/advisor";
import { ALL_DOMAINS, domainTiers, isUnset } from "@/lib/sports";
import { AdvisorControls } from "@/components/advisor/AdvisorControls";
import { AdvisorMap } from "@/components/advisor/AdvisorMap";
import { Outlook } from "@/components/advisor/Outlook";
import { RecentActivity } from "@/components/advisor/RecentActivity";
import { SkiPicks } from "@/components/advisor/SkiPicks";
import { TodaysCall } from "@/components/advisor/TodaysCall";
import { SampleDataBanner } from "@/components/system/SampleDataBanner";
import { useProfile } from "@/components/profile/ProfileContext";
import { useSession } from "@/components/auth/SessionContext";

const TODAY = WEEK[0];

/** A stable empty array, so "no types chosen" doesn't defeat the memo below. */
const NO_TYPES: readonly string[] = [];

export function AdvisorPage() {
  const { session } = useSession();
  const { profile } = useProfile();
  const signedIn = session !== null;

  // Signed out there is no profile to read. Signed in but with nothing ranked yet means
  // the question hasn't been answered rather than answered "none", so both fall back to
  // assuming everything. Once a sport is ranked, only what's ranked counts.
  const domains =
    signedIn && !isUnset(profile.sports) ? domainTiers(profile.sports) : ALL_DOMAINS;
  const skiOn = domains.snow !== null;

  const [city, setCity] = useState<City>("Seattle");
  const [pass, setPass] = useState<string>("Any pass");
  const [skiType, setSkiType] = useState<SkiType>("resort");

  // Signed in with types chosen, the profile wins over the control. Both branches are
  // stable references — the profile's own array, or the shared empty one — so the memo
  // below can depend on them directly.
  const profileTypes = signedIn ? profile.ski.types : NO_TYPES;

  // The preferred types float to the top rather than filtering the rest away: the second
  // best option being a different discipline is useful information, not noise.
  const locations = useMemo(() => {
    const preferred: readonly string[] = profileTypes.length > 0 ? profileTypes : [skiType];
    const forCity = SKI_LOCATIONS_BY_CITY[city];
    return [...forCity].sort((a, b) => {
      const aWanted = preferred.includes(a.type);
      const bWanted = preferred.includes(b.type);
      if (aWanted && !bWanted) return -1;
      if (!aWanted && bWanted) return 1;
      return 0;
    });
  }, [city, profileTypes, skiType]);

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
                ? "Snow, your calendar and your training load, resolved into one call on what to do next."
                : "Snow, a calendar and a training load, resolved into one call on what to do next. This is the example version — sign in and it reads your data instead."}
            </Text>
          </Stack>

          <SampleDataBanner />

          {nothingOn ? (
            <Row gap={3} wrap className="banner">
              <Text inline size="sm" weight="medium">
                Everything is switched off.
              </Text>
              <Text inline size="sm" tone="muted">
                Rank a sport in your profile and the advisor has something to weigh up.
              </Text>
            </Row>
          ) : null}

          {/* Shown signed in too, until the profile's location and passes drive them —
              hiding them early would leave a signed-in visitor stuck on one city. */}
          {skiOn ? (
            <Stack gap={4} className="advisor-preview">
              <Text size="sm" tone="muted">
                {signedIn
                  ? "These come from your profile once it's connected. Until then, set them here."
                  : "Stand in for a profile: these are the three things the advisor would otherwise already know about you."}
              </Text>
              <AdvisorControls
                city={city}
                pass={pass}
                skiType={skiType}
                onCity={setCity}
                onPass={setPass}
                onSkiType={setSkiType}
              />
            </Stack>
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

      {skiOn ? (
        <Section pad="sm" labelledBy="picks-heading">
          <Stack gap={4}>
            <Row justify="between" gap={3} wrap align="baseline">
              <Heading level={2} size={4} id="picks-heading" className="section-eyebrow">
                Where to go near {city}
              </Heading>
              <Text inline size="sm" tone="subtle">
                {signedIn && profile.ski.passes.length > 0
                  ? `On your ${profile.ski.passes.join(" and ")} pass`
                  : pass === "Any pass"
                    ? "Any pass"
                    : `On an ${pass} pass`}
              </Text>
            </Row>
            <SkiPicks locations={locations} />
            <AdvisorMap key={city} locations={locations} />
          </Stack>
        </Section>
      ) : null}

      <Section pad="sm" labelledBy="outlook-heading">
        <Stack gap={4}>
          <Heading level={2} size={4} id="outlook-heading" className="section-eyebrow">
            Next seven days
          </Heading>
          <Outlook domains={domains} showConditions={skiOn} />
        </Stack>
      </Section>

      {domains.endurance !== null ? (
        <Section pad="sm" labelledBy="recent-heading">
          <Stack gap={4}>
            <Heading level={2} size={4} id="recent-heading" className="section-eyebrow">
              What this was built from
            </Heading>
            <RecentActivity />
          </Stack>
        </Section>
      ) : null}

      {signedIn ? null : (
        <Section pad="lg">
          <Stack gap={4} align="start" className="advisor-cta">
            <Heading level={2} size={3}>
              Sign in and it stops guessing.
            </Heading>
            <Text tone="muted" prose>
              Connect Strava and a calendar and the advisor drops the sports you don't do, reads
              the load you're actually carrying, and knows which days are already spoken for.
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
