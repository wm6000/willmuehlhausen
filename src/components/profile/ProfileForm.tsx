import { useState } from "react";

import { Button, Heading, Row, Stack, Text } from "@/ui";
import { ACTIVITIES, type ActivityId, type Profile } from "@/data/profile";
import { enabledCount } from "@/lib/profile";
import { ActivitySection } from "@/components/profile/ActivitySection";
import { ConnectionsSection } from "@/components/profile/ConnectionsSection";
import { SkiPreferences } from "@/components/profile/SkiPreferences";
import { TrainingPreferences } from "@/components/profile/TrainingPreferences";
import { useProfile } from "@/components/profile/ProfileContext";

/**
 * Edits a draft and commits it on Save, so the advisor changes when you decide it
 * should rather than while you're still deciding.
 */
export function ProfileForm() {
  const { profile, save } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
  const none = enabledCount(draft) === 0;

  function update(next: Profile) {
    setDraft(next);
    setSaved(false);
  }

  function toggleActivity(id: ActivityId, enabled: boolean) {
    update({ ...draft, activities: { ...draft.activities, [id]: enabled } });
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
          <Heading level={2} size={4} className="section-eyebrow" id="activities-heading">
            What you do
          </Heading>
          <Text size="sm" tone="muted" prose>
            Switch off anything you don't do and the advisor drops it — not hidden, but gone
            from the reasoning. Nothing will ever suggest skiing to someone who doesn't ski.
          </Text>
        </Stack>

        <Stack gap={5}>
          {ACTIVITIES.map((activity) => (
            <ActivitySection
              key={activity.id}
              activity={activity}
              enabled={draft.activities[activity.id]}
              onToggle={(enabled) => toggleActivity(activity.id, enabled)}
            >
              {activity.id === "ski" ? (
                <SkiPreferences value={draft.ski} onChange={(ski) => update({ ...draft, ski })} />
              ) : (
                <TrainingPreferences
                  value={draft.training}
                  onChange={(training) => update({ ...draft, training })}
                />
              )}
            </ActivitySection>
          ))}
        </Stack>

        {none ? (
          <Row gap={3} wrap className="banner">
            <Text inline size="sm" weight="medium">
              Everything is off.
            </Text>
            <Text inline size="sm" tone="muted">
              You can save this, but the advisor will have nothing to weigh up and will say so.
            </Text>
          </Row>
        ) : null}
      </Stack>

      <Row gap={3} wrap align="center">
        <Button variant="primary" size="lg" onClick={() => { save(draft); setSaved(true); }} disabled={!dirty}>
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
