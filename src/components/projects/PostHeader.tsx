import { Badge, Heading, Link, Row, Stack, Text } from "@/ui";
import { TAG_LABELS, type Project } from "@/data/projects";
import { formatDate } from "@/lib/dates";

export type PostHeaderProps = {
  project: Project;
};

/** The masthead every post shares, so only the body below it has to be bespoke. */
export function PostHeader({ project }: PostHeaderProps) {
  return (
    <Stack gap={4} className="post-header">
      <Link to="/projects" variant="quiet">
        ← All projects
      </Link>

      <Stack gap={3}>
        <Text eyebrow>{project.kind}</Text>
        <Heading level={1} size={2}>
          {project.title}
        </Heading>
        <Text size="md" tone="muted" prose balance>
          {project.blurb}
        </Text>
      </Stack>

      <Row gap={3} wrap align="center">
        <Text inline size="sm" tone="subtle">
          {formatDate(project.date)}
          {project.updated === undefined ? "" : ` · updated ${formatDate(project.updated)}`}
        </Text>
        {project.tags.map((tag) => (
          <Badge key={tag} tone="outline">
            {TAG_LABELS[tag]}
          </Badge>
        ))}
      </Row>
    </Stack>
  );
}
