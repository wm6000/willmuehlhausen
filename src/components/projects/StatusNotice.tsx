import type { ReactNode } from "react";

import { Row, Text } from "@/ui";

export type StatusNoticeProps = {
  /** The one-word claim: "Draft.", "Not deployed." */
  label: string;
  children: ReactNode;
};

/**
 * A post saying what it is before it says anything else.
 *
 * This was `DraftNotice`, which hardcoded one sentence: the prose is placeholder. That
 * covered one kind of incompleteness and quietly misdescribed the others — a post whose
 * writing is finished but whose subject is not deployed would have claimed the opposite
 * of its actual problem. The label and the sentence belong to the post, because only the
 * post knows which way it falls short.
 */
export function StatusNotice({ label, children }: StatusNoticeProps) {
  return (
    <Row gap={3} wrap className="banner">
      <Text inline size="sm" weight="medium">
        {label}
      </Text>
      <Text inline size="sm" tone="muted">
        {children}
      </Text>
    </Row>
  );
}
