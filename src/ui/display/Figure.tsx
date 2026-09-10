import { cx } from "@/ui/cx";

export type FigureProps = {
  src: string;
  /** Describes the image itself. A caption is not a substitute — it's read as well. */
  alt: string;
  caption?: string;
  className?: string;
};

/**
 * An image with its credit or explanation attached.
 *
 * `figure`/`figcaption` rather than an image followed by a paragraph, so the caption is
 * programmatically tied to what it describes. Lazy by default: post images sit well
 * below the fold and shouldn't compete with the text for the first paint.
 */
export function Figure({ src, alt, caption, className }: FigureProps) {
  return (
    <figure className={cx("ui-figure", className)}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="ui-figure__image" />
      {caption === undefined ? null : (
        <figcaption className="ui-figure__caption">{caption}</figcaption>
      )}
    </figure>
  );
}
