import { useMemo, useState } from "react";

import { Badge, Field, Row, Stack, Text, Textarea } from "@/ui";

/**
 * This post's custom feature: type a message, see which relief efforts it would route
 * to and which words decided that.
 *
 * It is a keyword stand-in, not the model — the real pipeline is a trained multi-label
 * classifier and can't run in a browser tab. Keeping the stand-in transparent is the
 * point: it shows the *shape* of the decision (a message routes to several efforts at
 * once, or to none) without pretending to be the thing.
 */
type Route = { name: string; terms: readonly string[] };

const ROUTES: readonly Route[] = [
  { name: "Water", terms: ["water", "thirsty", "drink", "well", "bottle"] },
  { name: "Food", terms: ["food", "hungry", "eat", "rice", "meal"] },
  { name: "Shelter", terms: ["shelter", "house", "home", "roof", "tent", "sleep"] },
  { name: "Medical", terms: ["medical", "doctor", "hospital", "injured", "hurt", "medicine", "sick"] },
  { name: "Search & rescue", terms: ["trapped", "missing", "rescue", "buried", "stuck"] },
  { name: "Infrastructure", terms: ["road", "bridge", "power", "electricity", "blocked"] },
];

const EXAMPLE = "We are trapped under the rubble on the west road and we have no clean water";

function match(message: string): { route: Route; hits: string[] }[] {
  const words = message.toLowerCase().split(/[^a-z]+/).filter((word) => word !== "");
  return ROUTES.map((route) => ({
    route,
    hits: route.terms.filter((term) => words.includes(term)),
  })).filter((result) => result.hits.length > 0);
}

export function Classifier() {
  const [message, setMessage] = useState(EXAMPLE);
  const matched = useMemo(() => match(message), [message]);

  return (
    <Stack gap={4} className="demo">
      <Field
        id="classifier-input"
        label="An incoming message"
        hint="A keyword stand-in for the trained model, so the page works with no backend."
      >
        <Textarea
          id="classifier-input"
          value={message}
          onChange={setMessage}
          rows={3}
          describedBy="classifier-input-hint"
        />
      </Field>

      <Stack gap={3}>
        <Text size="sm" weight="medium">
          Routes to
        </Text>
        {matched.length === 0 ? (
          <Text size="sm" tone="muted">
            No route matched. In the real pipeline this is the interesting case — an unrouted
            message is one a person has to read, and there are more of them than anyone expects.
          </Text>
        ) : (
          <Stack gap={2} as="ul" className="demo__routes">
            {matched.map(({ route, hits }) => (
              <Stack as="li" key={route.name}>
                <Row gap={3} wrap align="center">
                  <Badge tone="accent">{route.name}</Badge>
                  <Text inline size="sm" tone="subtle">
                    matched {hits.join(", ")}
                  </Text>
                </Row>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
