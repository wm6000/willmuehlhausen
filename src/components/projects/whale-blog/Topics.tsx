import { useMemo, useState } from "react";

import { Button, Row, Stack, Text } from "@/ui";

/**
 * This post's custom feature, and deliberately nothing like the other post's: a filter
 * over what the blog covers. Same primitives, entirely different thing — which is the
 * argument for a component per post rather than a shared block schema.
 */
type Entry = { title: string; topic: Topic; note: string };
type Topic = "behaviour" | "acoustics" | "conservation";

const TOPICS: readonly { value: Topic; label: string }[] = [
  { value: "behaviour", label: "Behaviour" },
  { value: "acoustics", label: "Acoustics" },
  { value: "conservation", label: "Conservation" },
];

const ENTRIES: readonly Entry[] = [
  { title: "What counts as a dialect", topic: "acoustics", note: "Placeholder entry." },
  { title: "Feeding aggregations", topic: "behaviour", note: "Placeholder entry." },
  { title: "Ship strike and speed limits", topic: "conservation", note: "Placeholder entry." },
  { title: "Song revision across seasons", topic: "acoustics", note: "Placeholder entry." },
];

export function Topics() {
  const [active, setActive] = useState<Topic | null>(null);
  const shown = useMemo(
    () => (active === null ? ENTRIES : ENTRIES.filter((entry) => entry.topic === active)),
    [active]
  );

  return (
    <Stack gap={4} className="demo">
      <Row gap={2} wrap>
        <Button variant={active === null ? "primary" : "secondary"} onClick={() => setActive(null)}>
          All
        </Button>
        {TOPICS.map((topic) => (
          <Button
            key={topic.value}
            variant={active === topic.value ? "primary" : "secondary"}
            onClick={() => setActive(topic.value)}
          >
            {topic.label}
          </Button>
        ))}
      </Row>

      <Stack gap={2} as="ul" className="demo__routes">
        {shown.map((entry) => (
          <Stack as="li" key={entry.title} gap={1}>
            <Text size="sm" weight="medium">
              {entry.title}
            </Text>
            <Text size="sm" tone="subtle">
              {entry.note}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
