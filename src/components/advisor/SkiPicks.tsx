import { Badge, Card, Heading, Row, Stack, Text } from "@/ui";
import type { SkiLocation } from "@/data/ski";

export type SkiPicksProps = {
  locations: readonly SkiLocation[];
};

/** Ranked, because an unordered list of options is the problem, not the answer. */
export function SkiPicks({ locations }: SkiPicksProps) {
  return (
    <Stack gap={3} as="ul" className="picks">
      {locations.map((location, index) => (
        <Stack as="li" key={location.name}>
          <Card>
            <Stack gap={2}>
              <Row justify="between" gap={3} wrap>
                <Row gap={3} align="baseline">
                  <Text inline size="sm" tone="subtle" mono>
                    {index + 1}
                  </Text>
                  <Heading level={3} size={4}>
                    {location.name}
                  </Heading>
                </Row>
                <Row gap={2} wrap>
                  <Badge tone="outline">{location.type}</Badge>
                  <Badge tone="outline">{location.pass}</Badge>
                </Row>
              </Row>
              <Text size="sm" tone="muted">
                {location.blurb}
              </Text>
            </Stack>
          </Card>
        </Stack>
      ))}
    </Stack>
  );
}
