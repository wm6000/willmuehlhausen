import { ButtonLink, Heading, Row, Section, Stack, Text } from "@/ui";

export function NotFoundPage() {
  return (
    <Section pad="lg" narrow>
      <Stack gap={5} align="start">
        <Stack gap={3}>
          <Text eyebrow>404</Text>
          <Heading level={1} size={2}>
            That page does not exist.
          </Heading>
          <Text tone="muted">
            The link may be out of date, or the page may not be built yet. The three below are all
            real.
          </Text>
        </Stack>
        <Row gap={3} wrap>
          <ButtonLink to="/" variant="primary">
            Home
          </ButtonLink>
          <ButtonLink to="/recadvisor" variant="secondary">
            RecAdvisor
          </ButtonLink>
          <ButtonLink to="/projects" variant="secondary">
            Projects
          </ButtonLink>
        </Row>
      </Stack>
    </Section>
  );
}
