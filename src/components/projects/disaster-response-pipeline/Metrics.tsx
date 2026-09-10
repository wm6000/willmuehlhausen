import { useState } from "react";

import { Badge, Bars, Box, Button, Row, Stack, Text } from "@/ui";
import { loadMetrics, type CategoryMetric } from "@/lib/disaster/load";
import { categoryLabel } from "@/lib/disaster/predict";
import { useResource } from "@/components/projects/disaster-response-pipeline/useResource";

/**
 * Per-category precision and recall, for the AdaBoost model and for the same task
 * handed to an LLM.
 *
 * Every number here is read from metrics.json, which is parsed from the two committed
 * classification reports — nothing on this page is typed by hand or estimated. The two
 * runs used different random splits, which the panel says out loud rather than letting
 * a reader assume a controlled comparison; see models/reports/README.md in the pipeline
 * repo for why that can't be fixed without re-running both.
 */

type Metric = "recall" | "precision" | "f1";

const METRIC_LABEL: Record<Metric, string> = {
  recall: "Recall",
  precision: "Precision",
  f1: "F1",
};

/** How many categories to show before asking. Ranked by how common they are. */
const VISIBLE = 12;

/** Shown regardless of frequency, because the prose on this page discusses them. */
const PINNED = ["search_and_rescue"];

const METRIC_BLURB: Record<Metric, string> = {
  recall: "Of the messages that genuinely belong to a category, how many the model found.",
  precision: "Of the messages routed to a category, how many belonged there.",
  f1: "The harmonic mean of the two.",
};

export function Metrics() {
  const metrics = useResource(loadMetrics);
  const [metric, setMetric] = useState<Metric>("recall");
  const [expanded, setExpanded] = useState(false);

  if (metrics.status === "loading") {
    return (
      <Stack gap={4} className="demo">
        <Text size="sm" tone="muted">
          Loading results…
        </Text>
      </Stack>
    );
  }

  if (metrics.status === "error") {
    return (
      <Stack gap={3} className="demo">
        <Text size="sm" weight="medium">
          The results didn&rsquo;t load.
        </Text>
        <Text size="sm" tone="muted">
          {metrics.message}
        </Text>
      </Stack>
    );
  }

  const { categories, averages, note } = metrics.value;
  const ranked = [...categories]
    .filter((row) => row.positives > 0)
    .sort((a, b) => b.adaboost.support - a.adaboost.support);

  // 35 categories x 2 bars is a wall nobody reads, so the default is the most common
  // ones. But ranking by frequency alone would hide search and rescue — support 133,
  // nowhere near the top — and the prose two paragraphs up argues about exactly that
  // row. A page that makes a claim and then hides the evidence is worse than a long
  // list, so the categories the writing names are pinned in.
  const shown = expanded
    ? ranked
    : ranked.filter((row, index) => index < VISIBLE || PINNED.includes(row.category));

  const pick = (m: CategoryMetric): number => m[metric];

  return (
    <Stack gap={5} className="demo">
      <Stack gap={3}>
        <Row gap={2} wrap>
          {(["recall", "precision", "f1"] as const).map((option) => (
            <Button
              key={option}
              variant={option === metric ? "primary" : "ghost"}
              onClick={() => setMetric(option)}
            >
              {METRIC_LABEL[option]}
            </Button>
          ))}
        </Row>
        <Text size="sm" tone="muted">
          {METRIC_BLURB[metric]}
        </Text>
      </Stack>

      <Row gap={4} wrap>
        <Row gap={2}>
          <Badge tone="accent">AdaBoost</Badge>
          <Text inline size="xs" tone="subtle">
            {`micro avg ${averages.adaboost["micro"]?.[metric].toFixed(2) ?? "—"}`}
          </Text>
        </Row>
        <Row gap={2}>
          <Badge tone="rest">LLM</Badge>
          <Text inline size="xs" tone="subtle">
            {`micro avg ${averages.llm["micro"]?.[metric].toFixed(2) ?? "—"}`}
          </Text>
        </Row>
      </Row>

      <Stack gap={4}>
        {shown.map((row) => (
          <Stack gap={1} key={row.category}>
            <Row gap={3} wrap justify="between">
              <Text size="sm" weight="medium">
                {categoryLabel(row.category)}
              </Text>
              <Text inline size="xs" tone="subtle">
                {`${row.positives.toLocaleString()} in the corpus`}
              </Text>
            </Row>
            <Bars
              items={[
                { label: "AdaBoost", value: pick(row.adaboost), tone: "accent" },
                { label: "LLM", value: pick(row.llm), tone: "alt" },
              ]}
              max={1}
            />
          </Stack>
        ))}
      </Stack>

      {ranked.length <= VISIBLE ? null : (
        <Button variant="ghost" onClick={() => setExpanded((value) => !value)}>
          {expanded
            ? "Show the most common categories only"
            : `Show all ${ranked.length} categories`}
        </Button>
      )}

      <Box pad={4} background="muted" rounded bordered>
        <Stack gap={2}>
          <Text size="sm" weight="medium">
            Why these two columns are not a controlled comparison
          </Text>
          <Text size="sm" tone="muted">
            {note}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
