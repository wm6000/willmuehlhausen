import { Stack, Text } from "@/ui";
import { DraftNotice } from "@/components/projects/DraftNotice";
import { PostSection } from "@/components/projects/PostSection";
import { Topics } from "@/components/projects/whale-blog/Topics";

export function Post() {
  return (
    <Stack gap={7}>
      <DraftNotice />

      <PostSection id="about" title="About">
        <Text prose>
          A blog about whales — what's known, what's contested, and where the data behind either
          claim actually comes from. Placeholder prose; the real writing goes here.
        </Text>
      </PostSection>

      <PostSection id="topics" title="What it covers">
        <Text prose>
          Note that this post has no notes block, no demo and no stats — and that's the point of
          a component per post. It gets a topic filter because that's what it needs.
        </Text>
        <Topics />
      </PostSection>
    </Stack>
  );
}
