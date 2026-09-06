import { useState } from "react";

import { Button, Heading, Row, Stack, Text } from "@/ui";
import type { Profile } from "@/data/profile";
import { ConnectionsSection } from "@/components/profile/ConnectionsSection";
import { ContextSection } from "@/components/profile/ContextSection";
import { SkiPreferences } from "@/components/profile/SkiPreferences";
import { SportsSection } from "@/components/profile/sports/SportsSection";
import { useProfile } from "@/components/profile/ProfileContext";

/**
 * Edits a draft and commits it on Save, so the advisor changes when you decide it
 * should rather than while you're still deciding.
 *
 * Order is deliberate: what you do, then what the advisor can't infer, then the settings
 * for one sport in particular. Ski preferences sit last because they only matter to the
 * people who got that far.
 */
export function ProfileForm() {
  const { profile, save } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  function update(next: Profile) {
    setDraft(next);
    setSaved(false);
  }

  return (
    <Stack gap={7}>
      <Stack gap={4}>
        <Heading level={2} size={4} className="section-eyebrow" id="connections-heading">
          Connections
        </Heading>
        <ConnectionsSection
          value={draft.connections}
          onChange={(connections) => update({ ...draft, connections })}
        />
      </Stack>

      <Stack gap={4}>
        <Stack gap={2}>
          <Heading level={2} size={4} className="section-eyebrow" id="sports-heading">
            What you do
          </Heading>
          <Text size="sm" tone="muted" prose>
            Rank the sports you actually do. Primary is what you build a week around; Secondary
            fills the gaps. Anything you leave off is gone from the advisor's reasoning, not
            hidden from its output — nothing will ever suggest skiing to someone who doesn't ski.
          </Text>
        </Stack>
        <SportsSection value={draft.sports} onChange={(sports) => update({ ...draft, sports })} />
      </Stack>

      <Stack gap={4}>
        <Stack gap={2}>
          <Heading level={2} size={4} className="section-eyebrow" id="context-heading">
            Context
          </Heading>
          <Text size="sm" tone="muted" prose>
            The things a feed of activities can't tell it. Strava knows what you did; none of it
            says what you're aiming at or what to avoid, and a plan is built from both.
          </Text>
        </Stack>
        <ContextSection value={draft.context} onChange={(context) => update({ ...draft, context })} />
      </Stack>

      <Stack gap={4}>
        <Stack gap={2}>
          <Heading level={2} size={4} className="section-eyebrow" id="ski-heading">
            Ski settings
          </Heading>
          <Text size="sm" tone="muted" prose>
            Only used if you've ranked a snow sport above.
          </Text>
        </Stack>
        <SkiPreferences value={draft.ski} onChange={(ski) => update({ ...draft, ski })} />
      </Stack>

      <Row gap={3} wrap align="center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            save(draft);
            setSaved(true);
          }}
          disabled={!dirty}
        >
          Save
        </Button>
        {saved && !dirty ? (
          <Text inline size="sm" tone="muted">
            Saved. The advisor is using this now.
          </Text>
        ) : null}
        {dirty ? (
          <Text inline size="sm" tone="subtle">
            Unsaved changes.
          </Text>
        ) : null}
      </Row>
    </Stack>
  );
}
