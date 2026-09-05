import { Row, Text } from "@/ui";

/**
 * Marks a post whose structure exists but whose writing doesn't. Same principle as
 * RoutePlaceholder: a half-written page must announce itself rather than let a reader
 * mistake placeholder prose for a claim about the work.
 */
export function DraftNotice() {
  return (
    <Row gap={3} wrap className="banner">
      <Text inline size="sm" weight="medium">
        Draft.
      </Text>
      <Text inline size="sm" tone="muted">
        The structure and the interactive pieces are real; the prose is placeholder and the
        details below are not yet filled in.
      </Text>
    </Row>
  );
}
