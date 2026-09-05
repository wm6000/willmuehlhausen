/** Post dates are authored as ISO strings so they sort as text and read unambiguously. */

const FORMAT = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : FORMAT.format(date);
}

/** Newest first, the order a blog is read in. */
export function byNewest(a: { date: string }, b: { date: string }): number {
  return b.date.localeCompare(a.date);
}
