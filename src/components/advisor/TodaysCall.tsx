import { useState } from "react";

import { Badge, Button, Heading, Row, Stack, Text, Textarea } from "@/ui";
import { VERDICT_LABELS, reasonFor, verdictFor } from "@/lib/advisor";
import type { AdvisorDay } from "@/data/advisor";
import { ALL_DOMAINS, type DomainTiers } from "@/lib/sports";

export type TodaysCallProps = {
  day: AdvisorDay;
  /** Which sports you actually do. A domain you do nothing in is never the answer. */
  domains?: DomainTiers;
};

/**
 * The one answer the site exists to give. Everything below it on the page is the
 * working that led here.
 *
 * The adjustment box is plain language on purpose — "I'm sore", "I only have an hour",
 * "my partner's out of town" are the things that actually change the call, and none of
 * them are a field you could put on a form.
 */
export function TodaysCall({ day, domains = ALL_DOMAINS }: TodaysCallProps) {
  const verdict = verdictFor(day, domains);
  const [note, setNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjusted, setAdjusted] = useState<string | null>(null);

  function submit() {
    const trimmed = note.trim();
    if (trimmed === "") {
      return;
    }
    setAdjusted(trimmed);
    setNote("");
    setAdjusting(false);
  }

  return (
    <Stack gap={4} className="call">
      <Row gap={3} wrap align="center">
        <Badge tone={verdict} className="call__verdict">
          {VERDICT_LABELS[verdict]}
        </Badge>
        <Text inline size="sm" tone="subtle">
          {day.label}
        </Text>
      </Row>

      <Heading level={2} size={3}>
        {verdict === "ski" ? "Go skiing." : `${VERDICT_LABELS[verdict]} today.`}
      </Heading>

      <Text tone="muted" prose>
        {reasonFor(day, domains)}
      </Text>

      {adjusted === null ? null : (
        <Stack gap={2} className="call__adjusted">
          <Text size="sm" weight="medium">
            Adjusted for: {adjusted}
          </Text>
          <Text size="sm" tone="muted">
            A real advisor re-runs the call here. This one just shows you what you told it —
            the reasoning behind the adjustment arrives with the backend.
          </Text>
        </Stack>
      )}

      {adjusting ? (
        <Stack gap={3}>
          <Textarea
            id="advisor-adjust"
            value={note}
            onChange={setNote}
            ariaLabel="What should RecAdvisor know?"
            placeholder="I'm sore from Saturday, or I only have two hours, or the road's closed"
            // Revealed by pressing "Adjust this", so focus should follow it here.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <Row gap={2} wrap>
            <Button variant="primary" onClick={submit}>
              Update the call
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setNote("");
                setAdjusting(false);
              }}
            >
              Cancel
            </Button>
          </Row>
        </Stack>
      ) : (
        <Row>
          <Button variant="secondary" onClick={() => setAdjusting(true)}>
            Adjust this
          </Button>
        </Row>
      )}
    </Stack>
  );
}
