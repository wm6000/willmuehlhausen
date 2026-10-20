import { ButtonLink, Heading, Icon, Row, Section, Stack, Text } from "@/ui";
import { EXTERNAL, SITE } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import { byNewest } from "@/lib/dates";
import { PostCard } from "@/components/projects/PostCard";

/**
 * The home page leads with the work itself rather than with doors to it. A visitor here
 * is deciding in about ninety seconds whether the work is worth reading, and three cards
 * saying "Projects", "RecAdvisor" and "Résumé" made them spend a click to find out.
 *
 * It reuses PostCard rather than styling its own summaries, so a project looks the same
 * here as it does on the listing and there is only one place to change that.
 */

/** The newest few. The listing is one click away and does filtering properly. */
const FEATURED = [...PROJECTS].sort(byNewest).slice(0, 3);

export function HomePage() {
  return (
    <Stack>
      <Stack className="hero">
        <Stack className="hero__inner">
          <Stack gap={5} className="hero__body">
            <Stack gap={4}>
              <Heading level={1}>{SITE.headline}</Heading>
              <Text size="md" tone="muted" balance>
                I&rsquo;m an engineer — mechanical by training, software by habit. Most of what
                I build ends in a decision someone has to act on: which category a disaster
                message belongs to, whether a shipping lane is worth moving, what to train
                today. These are the write-ups.
              </Text>
            </Stack>
            <Row gap={3} wrap>
              <ButtonLink to="/projects" variant="primary" size="lg">
                Read the projects
                <Icon name="arrowRight" size={16} />
              </ButtonLink>
              <ButtonLink to={EXTERNAL.resume} variant="secondary" size="lg" external>
                Résumé (PDF)
              </ButtonLink>
            </Row>
          </Stack>
        </Stack>
      </Stack>

      <Section pad="md" labelledBy="recent-heading">
        <Stack gap={5}>
          <Row justify="between" gap={3} wrap align="baseline">
            <Heading level={2} size={3} id="recent-heading">
              Recent work
            </Heading>
            <ButtonLink to="/projects" variant="ghost">
              All projects
              <Icon name="arrowRight" size={14} />
            </ButtonLink>
          </Row>

          <Stack gap={4} className="post-list" as="ul">
            {FEATURED.map((project) => (
              <Stack as="li" key={project.slug}>
                <PostCard project={project} />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Section>
    </Stack>
  );
}
