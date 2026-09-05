import { Grid, Stack, Text } from "@/ui";

export type Note = { label: string; value: string };

export type PostNotesProps = {
  notes: readonly Note[];
};

/**
 * The facts block. Trip reports end with one — distance, gain, time — and a project
 * wants the same thing: stack, scale, what it runs on, stated plainly rather than
 * buried in the prose.
 */
export function PostNotes({ notes }: PostNotesProps) {
  return (
    <Grid gap={4} className="post-notes">
      {notes.map((note) => (
        <Stack gap={1} key={note.label}>
          <Text size="xs" tone="subtle" className="post-notes__label">
            {note.label}
          </Text>
          <Text size="sm" weight="medium">
            {note.value}
          </Text>
        </Stack>
      ))}
    </Grid>
  );
}
