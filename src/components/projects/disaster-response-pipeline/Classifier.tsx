import { useMemo, useState } from "react";

import { Badge, Bars, Button, Field, Row, Stack, Text, Textarea } from "@/ui";
import { loadModel } from "@/lib/disaster/load";
import { categoryLabel, predict } from "@/lib/disaster/predict";
import { useResource } from "@/components/projects/disaster-response-pipeline/useResource";

/**
 * This post's custom feature: type a message, see where the trained classifier routes it.
 *
 * This is the model, not an impression of it — the same 1,800 decision stumps
 * scikit-learn fitted, exported to JSON and evaluated here. `npm run lint` replays 200
 * messages through this code and fails the build if a single one of the 7,200 bits
 * disagrees with what Python produced, which is what entitles the page to say so.
 */

const EXAMPLES = [
  "We are trapped under the rubble on the west road and we have no clean water",
  "Please we need food and water in Delmas 33, there are many children here",
  "The storm destroyed the bridge and the power lines are down across the highway",
  "Thank you for your prayers, the weather here is beautiful today",
] as const;

export function Classifier() {
  const [message, setMessage] = useState<string>(EXAMPLES[0]);
  const model = useResource(loadModel);

  const result = useMemo(() => {
    if (model.status !== "ready") return null;
    return predict(message, model.value);
  }, [message, model]);

  const routed = useMemo(() => {
    if (result === null) return [];
    return result.predictions.filter((p) => p.hit).sort((a, b) => b.score - a.score);
  }, [result]);

  if (model.status === "loading") {
    return (
      <Stack gap={4} className="demo">
        <Text size="sm" tone="muted">
          Loading the model…
        </Text>
      </Stack>
    );
  }

  if (model.status === "error") {
    return (
      <Stack gap={3} className="demo">
        <Text size="sm" weight="medium">
          The model didn&rsquo;t load.
        </Text>
        <Text size="sm" tone="muted">
          It&rsquo;s about 210KB of JSON fetched when this section opens, so a blocked or
          dropped request stops it. {model.message}
        </Text>
      </Stack>
    );
  }

  const strongest = routed.length === 0 ? 1 : Math.max(...routed.map((r) => r.score));

  return (
    <Stack gap={4} className="demo">
      <Field
        id="classifier-input"
        label="An incoming message"
        hint="The trained AdaBoost classifier, exported to JSON and running in your browser. Nothing you type is sent anywhere."
      >
        <Textarea
          id="classifier-input"
          value={message}
          onChange={setMessage}
          rows={3}
          describedBy="classifier-input-hint"
        />
      </Field>

      <Row gap={2} wrap>
        {EXAMPLES.map((example, index) => (
          <Button key={example} variant="ghost" onClick={() => setMessage(example)}>
            {`Example ${index + 1}`}
          </Button>
        ))}
      </Row>

      <Stack gap={3}>
        <Text size="sm" weight="medium">
          Routes to
        </Text>
        {routed.length === 0 ? (
          <Text size="sm" tone="muted">
            No category cleared its threshold. In practice that&rsquo;s an important case rather
            than a dead end — an unrouted message still needs a person to read it, and there are
            more of them than you might expect.
          </Text>
        ) : (
          <Bars
            items={routed.map((prediction) => ({
              label: categoryLabel(prediction.category),
              value: prediction.score,
              // A category can clear the threshold by a hair. Printing that as "0.00"
              // next to a claim that it routed reads as a bug rather than a thin margin.
              display: prediction.score < 0.005 ? "<0.01" : prediction.score.toFixed(2),
              tone: "accent" as const,
            }))}
            max={strongest}
          />
        )}
      </Stack>

      {result === null || result.terms.length === 0 ? null : (
        <Stack gap={2}>
          <Text size="xs" tone="subtle">
            What the model actually saw, after stopwords and lemmatization
          </Text>
          <Row gap={2} wrap>
            {result.terms.map((term) => (
              <Badge key={term} tone="outline">
                {term}
              </Badge>
            ))}
          </Row>
          {result.unknown.length === 0 ? null : (
            <Text size="xs" tone="subtle">
              Not in the 25,506-word vocabulary, so they could not affect the result:{" "}
              {result.unknown.join(", ")}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
}
