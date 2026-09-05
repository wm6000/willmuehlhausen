import { Dot, Row, Text } from "@/ui";
import { DATA_SOURCE } from "@/data/site";

/**
 * Renders only while the advisor runs on mock data. Bound to the same flag as the
 * per-page banner, so the two can never disagree about what the site is showing.
 */
export function DataSourceChip() {
  if (DATA_SOURCE.kind === "live") {
    return null;
  }

  return (
    <Row gap={2} className="data-chip">
      <Dot className="data-chip__dot" />
      <Text inline size="xs" weight="medium" tone="muted">
        Sample data
      </Text>
    </Row>
  );
}
