import { useState } from "react";

import { Badge, Box, Button, Row, Stack, Text } from "@/ui";
import { loadSamples } from "@/lib/disaster/load";
import { categoryLabel } from "@/lib/disaster/predict";
import { useResource } from "@/components/projects/disaster-response-pipeline/useResource";

/**
 * Real messages from the dataset, with the model's call set against the labels a human
 * gave them.
 *
 * The free-text demo above can only ever show what the model *says*. This is the half
 * that shows whether it was right, which is the only way the recall problem in the
 * metrics below becomes visible as something other than a number: the misses are the
 * whole point, so the sample set is deliberately weighted towards them.
 */

type Verdict = "exact" | "missed" | "over";

function verdictOf(predicted: readonly string[], actual: readonly string[]): Verdict {
  const missing = actual.filter((c) => !predicted.includes(c));
  const extra = predicted.filter((c) => !actual.includes(c));
  if (missing.length === 0 && extra.length === 0) return "exact";
  return missing.length > 0 && extra.length === 0 ? "missed" : "over";
}

const VERDICT_TEXT: Record<Verdict, string> = {
  exact: "Matches the human labels exactly",
  missed: "Some labels the model didn't pick up",
  over: "Routed somewhere the labels don't include",
};

export function Samples() {
  const samples = useResource(loadSamples);
  const [index, setIndex] = useState(0);

  if (samples.status === "loading") {
    return (
      <Stack gap={4} className="demo">
        <Text size="sm" tone="muted">
          Loading messages…
        </Text>
      </Stack>
    );
  }

  if (samples.status === "error") {
    return (
      <Stack gap={3} className="demo">
        <Text size="sm" weight="medium">
          The sample messages didn&rsquo;t load.
        </Text>
        <Text size="sm" tone="muted">
          {samples.message}
        </Text>
      </Stack>
    );
  }

  const current = samples.value[index];
  if (current === undefined) return null;

  const verdict = verdictOf(current.predicted, current.actual);
  const missing = current.actual.filter((c) => !current.predicted.includes(c));
  const extra = current.predicted.filter((c) => !current.actual.includes(c));
  const agreed = current.predicted.filter((c) => current.actual.includes(c));

  return (
    <Stack gap={4} className="demo">
      <Row gap={3} wrap justify="between">
        <Text size="sm" weight="medium">
          {`Message ${index + 1} of ${samples.value.length}`}
        </Text>
        <Row gap={2}>
          <Button
            variant="ghost"
            onClick={() => setIndex((i) => (i === 0 ? samples.value.length - 1 : i - 1))}
          >
            Previous
          </Button>
          <Button variant="ghost" onClick={() => setIndex((i) => (i + 1) % samples.value.length)}>
            Next
          </Button>
        </Row>
      </Row>

      <Box pad={4} background="muted" rounded bordered>
        <Text prose>{current.text}</Text>
      </Box>

      <Stack gap={3}>
        <Text size="sm" weight="medium">
          {VERDICT_TEXT[verdict]}
        </Text>

        <Stack gap={2}>
          <Text size="xs" tone="subtle">
            Model and labels agree
          </Text>
          {agreed.length === 0 ? (
            <Text size="sm" tone="muted">
              None on this message.
            </Text>
          ) : (
            <Row gap={2} wrap>
              {agreed.map((category) => (
                <Badge key={category} tone="accent">
                  {categoryLabel(category)}
                </Badge>
              ))}
            </Row>
          )}
        </Stack>

        {missing.length === 0 ? null : (
          <Stack gap={2}>
            <Text size="xs" tone="subtle">
              Labelled by a person, not picked up by the model
            </Text>
            <Row gap={2} wrap>
              {missing.map((category) => (
                <Badge key={category} tone="rest">
                  {categoryLabel(category)}
                </Badge>
              ))}
            </Row>
          </Stack>
        )}

        {extra.length === 0 ? null : (
          <Stack gap={2}>
            <Text size="xs" tone="subtle">
              Routed by the model, not in the labels
            </Text>
            <Row gap={2} wrap>
              {extra.map((category) => (
                <Badge key={category} tone="busy">
                  {categoryLabel(category)}
                </Badge>
              ))}
            </Row>
          </Stack>
        )}

        {current.actual.length === 0 ? (
          <Text size="sm" tone="muted">
            This one carries no labels at all. 23% of the corpus is the same — 6,122 of
            26,215 messages: thanks, general news, or something too broad to route to one
            team.
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}
