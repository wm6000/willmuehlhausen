import { ButtonLink, Heading, Row, Section, Stack, Text } from "@/ui";

export type RoutePlaceholderProps = {
  title: string;
  milestone: string;
  body: string;
};

/**
 * Stands in for a route that has its shell but not its content yet. Says which
 * milestone fills it in, so an unfinished page never reads as a broken one.
 */
export function RoutePlaceholder({ title, milestone, body }: RoutePlaceholderProps) {
  return (
    <Section pad="lg">
      <Stack gap={5}>
        <Stack gap={3}>
          <Text eyebrow>{milestone}</Text>
          <Heading level={1} size={2}>
            {title}
          </Heading>
          <Text tone="muted" prose>
            {body}
          </Text>
        </Stack>
        <Stack className="placeholder">
          <Stack gap={4} align="center">
            <Text size="sm" tone="subtle">
              Not built yet.
            </Text>
            <Row gap={3} wrap justify="center">
              <ButtonLink to="/" variant="secondary">
                Back home
              </ButtonLink>
            </Row>
          </Stack>
        </Stack>
      </Stack>
    </Section>
  );
}
