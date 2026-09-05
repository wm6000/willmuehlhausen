import { ButtonLink, Card, Grid, Heading, Icon, Row, Section, Stack, Text } from "@/ui";
import { SITE } from "@/data/site";

const CARDS = [
  {
    to: "/advisor",
    title: "Advisor",
    body: "One page that reads your training history, your calendar and the snow forecast, then tells you what to do this week — and adapts to the sports you actually do.",
  },
  {
    to: "/projects",
    title: "Projects",
    body: "Data pipelines, machine learning and the writeups that go with them. Architecture, decisions, and what each one taught me.",
  },
  {
    to: "/profile",
    title: "Profile",
    body: "Connect Strava and a calendar, set your goals and preferences, and the advisor stops guessing and starts using your data.",
  },
];

export function HomePage() {
  return (
    <Stack>
      <Stack className="hero">
        <Stack className="hero__inner">
          <Stack gap={5} className="hero__body">
            <Stack gap={4}>
              <Text eyebrow>{SITE.location}</Text>
              <Heading level={1}>Software, data and AI engineering.</Heading>
              <Text size="md" tone="muted" balance>
                I build data platforms and the products that sit on top of them. This site is one of
                them: an advisor that combines training history, calendar and mountain conditions
                into a single call on what to do next.
              </Text>
            </Stack>
            <Row gap={3} wrap>
              <ButtonLink to="/advisor" variant="primary" size="lg">
                Open the advisor
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to="/projects" variant="secondary" size="lg">
                See the projects
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
              <Card key={card.to} to={card.to}>
                <Stack gap={3}>
                  <Row justify="between" gap={3}>
                    <Heading level={3} size={4}>
                      {card.title}
                    </Heading>
                    <Icon name="arrowRight" size={16} />
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
