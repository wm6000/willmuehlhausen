import { ButtonLink, Card, Grid, Heading, Icon, Row, Section, Stack, Text } from "@/ui";
import { EXTERNAL, SITE } from "@/data/site";

/**
 * Three doors and a short introduction. The alternative — leading with the newest project
 * cards — puts the work first, which reads well for somebody who already wants to read a
 * write-up and badly for somebody deciding whether to.
 *
 * RecAdvisor points at its own write-up rather than at dev.recadvisor.app. The app is
 * invite-only, so an outbound link from here would send almost everybody to a refusal; the
 * post carries the link along with the sentence explaining who can use it.
 */
const CARDS = [
  {
    to: "/projects",
    title: "Projects",
    body: "Write-ups of what I've built, with the architecture and what each one taught me.",
  },
  {
    to: "/projects/recadvisor",
    title: "RecAdvisor",
    body: "A training advisor that reads your activity history and your calendar, and makes one call on the day. In private testing.",
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
                I&rsquo;m an engineer — mechanical by training, software by habit. This is where
                I write up the things I&rsquo;ve built: machine learning models, data
                pipelines, factory systems, and the occasional map. Have a look around.
              </Text>
            </Stack>
            <Row gap={3} wrap>
              <ButtonLink to="/projects" variant="primary" size="lg">
                See my projects
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to="/projects/recadvisor" variant="secondary" size="lg">
                Read about RecAdvisor
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
              <Card key={card.to} to={card.to} external={card.external ?? false}>
                <Stack gap={3}>
                  <Row justify="between" gap={3}>
                    <Heading level={3} size={4}>
                      {card.title}
                    </Heading>
                    <Icon name={card.external === true ? "external" : "arrowRight"} size={16} />
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
