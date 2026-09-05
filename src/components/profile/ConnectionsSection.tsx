import { Button, Field, Input, Row, Stack, Text } from "@/ui";
import type { Connections } from "@/data/profile";

export type ConnectionsSectionProps = {
  value: Connections;
  onChange: (value: Connections) => void;
};

/**
 * Connecting is an action, not a preference, so these stay buttons while the activities
 * below get switches. Both are mock: no OAuth happens, and the button only flips a flag.
 */
export function ConnectionsSection({ value, onChange }: ConnectionsSectionProps) {
  return (
    <Stack gap={4}>
      <Row justify="between" gap={4} className="connection">
        <Stack gap={1}>
          <Text size="sm" weight="medium">
            Strava
          </Text>
          <Text size="sm" tone="muted">
            {value.strava ? "Connected" : "Not connected — the advisor is guessing at your load."}
          </Text>
        </Stack>
        <Button variant="secondary" onClick={() => onChange({ ...value, strava: !value.strava })}>
          {value.strava ? "Disconnect" : "Connect"}
        </Button>
      </Row>

      <Row justify="between" gap={4} className="connection">
        <Stack gap={1}>
          <Text size="sm" weight="medium">
            Calendar
          </Text>
          <Text size="sm" tone="muted">
            {value.calendar ? "Connected" : "Not connected — every day looks free."}
          </Text>
        </Stack>
        <Button variant="secondary" onClick={() => onChange({ ...value, calendar: !value.calendar })}>
          {value.calendar ? "Disconnect" : "Connect"}
        </Button>
      </Row>

      <Field id="profile-location" label="Where you start from" hint="City or region. Decides which mountains are in range.">
        <Input
          id="profile-location"
          value={value.location}
          onChange={(location) => onChange({ ...value, location })}
          placeholder="Seattle, WA"
          autoComplete="address-level2"
          describedBy="profile-location-hint"
        />
      </Field>
    </Stack>
  );
}
