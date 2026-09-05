import type { ReactNode } from "react";

import { Heading, Row, Stack, Switch, Text } from "@/ui";
import type { Activity } from "@/data/profile";

export type ActivitySectionProps = {
  activity: Activity;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: ReactNode;
};

/**
 * A switch and, beneath it, the preferences that only mean anything while it's on.
 * They're removed rather than disabled: a greyed-out form still reads as something you
 * ought to fill in, and the point of switching a sport off is that you're done with it.
 */
export function ActivitySection({ activity, enabled, onToggle, children }: ActivitySectionProps) {
  const switchId = `activity-${activity.id}`;
  const descriptionId = `${switchId}-description`;

  return (
    <Stack gap={4} className={enabled ? "activity" : "activity activity--off"}>
      <Row justify="between" gap={4} align="start">
        <Stack gap={2}>
          <Heading level={3} size={4} id={`${switchId}-heading`}>
            {activity.label}
          </Heading>
          <Text size="sm" tone="muted" id={descriptionId} prose>
            {activity.description}
          </Text>
        </Stack>
        <Switch
          id={switchId}
          checked={enabled}
          onChange={onToggle}
          ariaLabel={`${activity.label} — on or off`}
          describedBy={descriptionId}
        />
      </Row>

      {enabled ? children : null}
    </Stack>
  );
}
