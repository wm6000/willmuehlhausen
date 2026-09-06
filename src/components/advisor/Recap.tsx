import { Badge, Card, Heading, Row, Stack, Text } from "@/ui";
import { RECENT } from "@/data/advisor";
import { recapOf } from "@/lib/advisor";

const [LATEST, ...EARLIER] = RECENT;

/**
 * What the call was made from. The advisor keeps citing the load you're carrying, so the
 * week that produced it is on the page rather than left as an assertion — the summary
 * line is computed from the days below it, not stated beside them.
 */
export function Recap() {
  const week = recapOf(RECENT);
  // Composed rather than interleaved with JSX: adjacent expressions and text render with
  // comment separators between them, which splits the sentence up in the DOM.
  const summary =
    `Last seven days — ${week.sessions} ${week.sessions === 1 ? "session" : "sessions"}, ` +
    `${week.miles} mi, carrying ${week.load} load.`;

  if (LATEST === undefined) {
    return (
      <Text size="sm" tone="subtle">
        Nothing recorded in the last week.
      </Text>
    );
  }

  return (
    <Stack gap={4}>
      <Card className="recap__latest">
        <Stack gap={2}>
          <Row justify="between" gap={3} wrap align="baseline">
            <Text inline size="xs" tone="subtle">
              {LATEST.label}
            </Text>
            <Badge tone={LATEST.effort === "high" ? "rest" : "outline"}>{LATEST.effort}</Badge>
          </Row>
          <Heading level={3} size={4}>
            {LATEST.activity}
          </Heading>
          <Text size="sm" tone="muted">
            {LATEST.miles > 0 ? `${LATEST.miles} mi · ${LATEST.duration}` : LATEST.duration}
          </Text>
        </Stack>
      </Card>

      <Text size="sm" tone="muted">
        {summary}
      </Text>

      <Stack gap={2} as="ul" className="recap">
        {EARLIER.map((entry) => (
          <Stack as="li" key={entry.label}>
            <Row gap={3} wrap>
              <Text inline size="sm" tone="subtle" className="recap__when">
                {entry.label}
              </Text>
              <Text inline size="sm" tone="muted">
                {entry.activity}
                {entry.miles > 0 ? ` — ${entry.miles} mi` : ""}
              </Text>
            </Row>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
