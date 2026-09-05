import { useParams } from "react-router";

import { Section, Stack } from "@/ui";
import { projectBySlug } from "@/data/projects";
import { POSTS } from "@/components/projects/registry";
import { PostHeader } from "@/components/projects/PostHeader";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ProjectPage() {
  const { slug } = useParams();
  const project = slug === undefined ? undefined : projectBySlug(slug);
  const Post = slug === undefined ? undefined : POSTS[slug];

  // An index entry with no registered post is a half-added project, which should read
  // as missing rather than as an empty page.
  if (project === undefined || Post === undefined) {
    return <NotFoundPage />;
  }

  return (
    <Stack>
      <Section pad="lg" narrow>
        <PostHeader project={project} />
      </Section>
      <Section pad="sm" narrow>
        <Post />
      </Section>
    </Stack>
  );
}
