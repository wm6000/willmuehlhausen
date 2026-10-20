/**
 * What the people I invited said, and what it changed.
 *
 * Appending one is the only edit this file should ever need: add an object, newest
 * first. Bump `updated` on the recadvisor entry in @/data/projects at the same time —
 * that is what the post header prints. It does not affect ordering, which sorts on
 * `date`.
 *
 * `paragraphs` are plain strings rather than markup. Rule 3 keeps raw DOM tags inside
 * src/ui, and a .ts file holding JSX would be a way around that rather than a reason it
 * doesn't apply, so the shape makes it impossible instead of discouraged.
 *
 * An empty array is a real state, not a missing one: Reflections renders the fact that
 * nothing has come back yet. Don't pad it to look finished.
 */

export type Reflection = {
  /** ISO, rendered through formatDate so it matches the dates in the post header. */
  date: string;
  /**
   * Who it came from, characterised rather than named — "my brother", "a friend who
   * doesn't run". Four invited addresses is not a user study, and saying what kind of
   * person said a thing is most of what makes the feedback readable.
   */
  source: string;
  paragraphs: readonly string[];
  /**
   * What the feedback actually changed, in a sentence. Optional because some feedback
   * changes nothing, and saying so is more honest than inventing a response to it.
   *
   * `| undefined` is explicit: exactOptionalPropertyTypes is on, so `changed?: string`
   * would reject an entry that passes `undefined`.
   */
  changed?: string | undefined;
};

export const REFLECTIONS: readonly Reflection[] = [];
