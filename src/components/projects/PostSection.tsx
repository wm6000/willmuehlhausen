import type { ReactNode } from "react";

import { Heading, Stack } from "@/ui";

export type PostSectionProps = {
  title: string;
  id: string;
  children: ReactNode;
};

/** A titled run of a post. Shared so every post's headings sit on the same rhythm. */
export function PostSection({ title, id, children }: PostSectionProps) {
  return (
    <Stack gap={4} className="post-section">
      <Heading level={2} size={3} id={id}>
        {title}
      </Heading>
      {children}
    </Stack>
  );
}
