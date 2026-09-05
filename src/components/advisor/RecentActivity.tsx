import { Row, Stack, Text } from "@/ui";
import { RECENT } from "@/data/advisor";

/** What the call was made from. Shown so the advisor's reasoning can be checked. */
export function RecentActivity() {
  return (
    <Stack gap={2} as="ul" className="recent">
      {RECENT.map((entry) => (
        <Stack as="li" key={entry.label}>
          <Row gap={3} wrap>
            <Text inline size="sm" tone="subtle" className="recent__when">
              {entry.label}
            </Text>
            <Text inline size="sm" tone="muted">
              {entry.activity}
            </Text>
          </Row>
        </Stack>
      ))}
    </Stack>
  );
}
