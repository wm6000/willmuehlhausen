import { Row, Text } from "@/ui";
import { DATA_SOURCE, DISCLAIMER } from "@/data/site";

/**
 * Sits on any page that shows advisor numbers, bound to the same flag as the footer
 * chip so the two can never disagree. No page may claim real conditions while
 * DATA_SOURCE.kind says "mock".
 */
export function SampleDataBanner() {
  if (DATA_SOURCE.kind === "live") {
    return null;
  }

  return (
    <Row gap={3} wrap className="banner">
      <Text inline size="sm" weight="medium">
        Sample data.
      </Text>
      <Text inline size="sm" tone="muted">
        Nothing here reflects real conditions, and no forecast or calendar is being read.
        {" "}
        {DISCLAIMER}
      </Text>
    </Row>
  );
}
