import { ButtonLink, Card, Grid, Heading, Icon, Row, Section, Stack, Text } from "@/ui";
import { EXTERNAL, SITE } from "@/data/site";

/**
 * RecAdvisor is a card here like any other project, and an external one: it runs on its
 * own domain now. Keeping it in the list rather than in the nav is the honest shape —
 * it is a thing I built, and this site is the place that says so.
 */
const CARDS = [
  {
    to: "/projects",
    external: false,
    title: "Projects",
    body: "Write-ups of what I've built, with the architecture and what each one taught me.",
  },
  {
    to: EXTERNAL.recadvisor,
    external: true,
    title: "RecAdvisor",
    body: "A training advisor that reads your activity history, your calendar and the forecast, and makes one call on the day.",
  },
  {
    to: EXTERNAL.resume,
    external: true,
    title: "Résumé",
    body: "The short version, as a PDF.",
  },
];

export function HomePage() {
  return (
    <Stack>
      <Stack className="hero">
        <Stack className="hero__inner">
          <Stack gap={5} className="hero__body">
            <Stack gap={4}>
              <Heading level={1}>{SITE.headline}</Heading>
              <Text size="md" tone="muted" balance>
                I'm an engineer — mechanical by training, software by habit. This is where I
                write up the things I've built: machine learning models, data pipelines,
                factory systems, and the occasional map. Have a look around.
              </Text>
            </Stack>
            <Row gap={3} wrap>
              <ButtonLink to="/projects" variant="primary" size="lg">
                See my projects
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to={EXTERNAL.recadvisor} variant="secondary" size="lg" external>
                Try RecAdvisor
              </ButtonLink>
            </Row>
          </Stack>
        </Stack>
      </Stack>

      <Section pad="md" labelledBy="explore-heading">
        <Stack gap={5}>
          <Heading level={2} size={3} id="explore-heading">
            Start here
          </Heading>
          <Grid gap={4} className="card-grid">
            {CARDS.map((card) => (
              <Card key={card.to} to={card.to} external={card.external}>
                <Stack gap={3}>
                  <Row justify="between" gap={3}>
                    <Heading level={3} size={4}>
                      {card.title}
                    </Heading>
                    <Icon name={card.external ? "external" : "arrowRight"} size={16} />
                  </Row>
                  <Text size="sm" tone="muted">
                    {card.body}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </Stack>
  );
}
