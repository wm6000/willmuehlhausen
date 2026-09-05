import { useMemo, useState } from "react";

import { Button, Heading, Row, Section, Stack, Text } from "@/ui";
import { PROJECTS, TAG_LABELS, type ProjectTag } from "@/data/projects";
import { byNewest } from "@/lib/dates";
import { PostCard } from "@/components/projects/PostCard";

/** Only tags that something actually carries, so the filter can never come up empty. */
const USED_TAGS = [...new Set(PROJECTS.flatMap((project) => project.tags))];

export function ProjectsPage() {
  const [tag, setTag] = useState<ProjectTag | null>(null);

  const shown = useMemo(() => {
    const filtered = tag === null ? PROJECTS : PROJECTS.filter((project) => project.tags.includes(tag));
    return [...filtered].sort(byNewest);
  }, [tag]);

  return (
    <Stack>
      <Section pad="lg" narrow>
        <Stack gap={5}>
          <Stack gap={3}>
            <Heading level={1} size={2}>
              Projects
            </Heading>
            <Text tone="muted" prose>
              Written up like a blog rather than listed like a CV — data pipelines, machine
              learning and platform work, each with whatever that particular project needs to
              explain itself.
            </Text>
          </Stack>

          <Row gap={2} wrap as="nav" ariaLabel="Filter projects by tag">
            <Button variant={tag === null ? "primary" : "secondary"} onClick={() => setTag(null)}>
              Everything
            </Button>
            {USED_TAGS.map((value) => (
              <Button
                key={value}
                variant={tag === value ? "primary" : "secondary"}
                onClick={() => setTag(value)}
              >
                {TAG_LABELS[value]}
              </Button>
            ))}
          </Row>
        </Stack>
      </Section>

      <Section pad="sm" narrow>
        <Stack gap={5} as="ul" className="post-list">
          {shown.map((project) => (
            <Stack as="li" key={project.slug}>
              <PostCard project={project} />
            </Stack>
          ))}
        </Stack>
      </Section>
    </Stack>
  );
}
