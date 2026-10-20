import { Badge, Row, Stack, Text } from "@/ui";
import { REFLECTIONS } from "@/components/projects/recadvisor/reflections";
import { formatDate } from "@/lib/dates";

/**
 * The feedback section, and its empty state.
 *
 * The empty case is driven by the array being empty rather than by a sentence someone
 * has to remember to delete. That is the only reason this is a component instead of
 * prose in the post: a hand-written "nothing yet" line survives the arrival of real
 * feedback, and a post claiming no feedback directly above three pieces of it is worse
 * than having no section at all.
 */
export function ReflectionList() {
  if (REFLECTIONS.length === 0) {
    return (
      <Text prose>
        Nothing here yet. The invitations have gone out and nobody has used it in anger, so
        this is where what they tell me will go — including the parts I would rather not
        hear, which are the ones worth writing down.
      </Text>
    );
  }

  return (
    <Stack as="ul" gap={5} className="post-reflections">
      {REFLECTIONS.map((reflection) => (
        <Stack as="li" gap={3} key={`${reflection.date}-${reflection.source}`}>
          <Row gap={3} wrap align="baseline">
            <Text inline size="xs" tone="subtle">
              {formatDate(reflection.date)}
            </Text>
            <Badge tone="outline">{reflection.source}</Badge>
          </Row>

          {reflection.paragraphs.map((paragraph, index) => (
            <Text prose key={index}>
              {paragraph}
            </Text>
          ))}

          {reflection.changed === undefined ? null : (
            <Text size="sm" tone="muted">
              {reflection.changed}
            </Text>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
