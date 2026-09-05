import { Badge, Card, Heading, Row, Stack, Text } from "@/ui";
import { TAG_LABELS, type Project } from "@/data/projects";
import { formatDate } from "@/lib/dates";

export type PostCardProps = {
  project: Project;
};

/**
 * One entry in the listing: kind and date, title, blurb, tags. Stacked rather than
 * gridded, so the blurb has room to do its job — on a blog the excerpt is what people
 * actually decide from.
 */
export function PostCard({ project }: PostCardProps) {
  return (
    <Card to={`/projects/${project.slug}`} className="post-card">
      <Stack gap={3}>
        <Row gap={3} wrap align="baseline">
          <Text inline size="xs" weight="semibold" tone="accent" className="post-card__kind">
            {project.kind}
          </Text>
          <Text inline size="xs" tone="subtle">
            {formatDate(project.date)}
            {project.updated === undefined ? "" : ` · updated ${formatDate(project.updated)}`}
          </Text>
        </Row>

        <Heading level={2} size={3}>
          {project.title}
        </Heading>

        <Text tone="muted" prose>
          {project.blurb}
        </Text>

        <Row gap={2} wrap>
          {project.tags.map((tag) => (
            <Badge key={tag} tone="outline">
              {TAG_LABELS[tag]}
            </Badge>
          ))}
        </Row>
      </Stack>
    </Card>
  );
}
