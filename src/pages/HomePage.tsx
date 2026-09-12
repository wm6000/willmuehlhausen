import { ButtonLink, Card, Grid, Heading, Icon, Row, Section, Stack, Text } from "@/ui";
import { SITE } from "@/data/site";

const CARDS = [
  {
    to: "/recadvisor",
    title: "RecAdvisor",
    body: "View the RecAdvisor page.",
  },
  {
    to: "/projects",
    title: "Projects",
    body: "A showcase of personal projects I have worked on.",
  },
  {
    to: "/profile",
    title: "Create Profile",
    body: "Create your profile now to get started.",
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
                Come try out RecAdvisor!
                It will generate a daily plan based on your activity history, 
                goals, schedule, and weather to build personalized activity plans. 
                Also check out my projects to see what I have been working on. 
              </Text>
            </Stack>
            <Row gap={3} wrap>
              <ButtonLink to="/recadvisor" variant="primary" size="lg">
                Open RecAdvisor
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to="/projects" variant="secondary" size="lg">
                See my projects
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
