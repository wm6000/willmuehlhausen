import { Figure, Heading, Stack, Text } from "@/ui";
import { TIMELINE } from "@/components/projects/recadvisor/timeline";
import { formatDate } from "@/lib/dates";

/**
 * The build log, oldest first.
 *
 * Rendered in array order rather than sorted, so the file's order is the page's order and
 * appending a chapter at the end of the array puts it at the end of the post. Sorting
 * would be the obvious thing and would quietly make the data file's shape a lie.
 *
 * Headings are level 3: the enclosing PostSection owns the level 2, and headings have to
 * descend without skipping for the document outline to mean anything.
 */
function when(chapter: { date: string; until?: string | undefined }): string {
  const from = formatDate(chapter.date);
  return chapter.until === undefined ? from : `${from} — ${formatDate(chapter.until)}`;
}

export function ChapterList() {
  return (
    <Stack as="ul" gap={7} className="timeline">
      {TIMELINE.map((chapter) => (
        <Stack as="li" gap={3} key={chapter.date}>
          <Stack gap={2}>
            <Text size="xs" tone="subtle" className="timeline__when">
              {when(chapter)}
            </Text>
            <Heading level={3} size={4}>
              {chapter.title}
            </Heading>
          </Stack>

          {chapter.paragraphs.map((paragraph, index) => (
            <Text prose key={index}>
              {paragraph}
            </Text>
          ))}

          {chapter.shot === undefined ? null : (
            <Figure
              src={chapter.shot.src}
              alt={chapter.shot.alt}
              {...(chapter.shot.caption === undefined ? {} : { caption: chapter.shot.caption })}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}
