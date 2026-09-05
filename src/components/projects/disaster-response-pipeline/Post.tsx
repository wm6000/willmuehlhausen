import { Stack, Text } from "@/ui";
import { Classifier } from "@/components/projects/disaster-response-pipeline/Classifier";
import { DraftNotice } from "@/components/projects/DraftNotice";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";

const NOTES = [
  { label: "Task", value: "Multi-label text classification" },
  { label: "Shape", value: "Message in, relief efforts out" },
  { label: "Stack", value: "To fill in" },
  { label: "Source", value: "To fill in" },
];

export function Post() {
  return (
    <Stack gap={7}>
      <DraftNotice />

      <PostSection id="problem" title="The problem">
        <Text prose>
          In the first days after a disaster, the messages arrive faster than anyone can read
          them — social posts, texts, radio transcripts. Most are not actionable. The ones that
          are need to reach a specific team, quickly, and a message about a collapsed bridge is
          no use to the people distributing water.
        </Text>
        <Text prose>
          Routing is the whole job. A classifier that is right on average but quietly drops
          search-and-rescue messages is worse than no classifier at all, because it looks like
          it's working.
        </Text>
      </PostSection>

      <PostSection id="demo" title="Try it">
        <Text prose>
          Type a message and watch which efforts it routes to. A message can route to several at
          once — that's the part a single-label model gets wrong.
        </Text>
        <Classifier />
      </PostSection>

      <PostSection id="notes" title="Notes">
        <PostNotes notes={NOTES} />
      </PostSection>
    </Stack>
  );
}
