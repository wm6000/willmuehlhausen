import { useEffect, useState } from "react";

import { cx } from "@/ui/cx";

export type ClipProps = {
  /** A short, muted, web-encoded MP4. */
  src: string;
  /** Shown before playback and, under reduced motion, instead of it. */
  poster: string;
  /** Describes what the clip shows. Exposed as the video's accessible name. */
  alt: string;
  caption?: string | undefined;
  className?: string;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * A short silent loop with a caption — the job a GIF does, at a tenth of the weight. A
 * ten-second phone clip is ~800KB as H.264 and several MB as a GIF.
 *
 * It autoplays only when motion is allowed; otherwise it sits on its poster with controls,
 * so playing it is the reader's choice. Autoplay starts false and is switched on after
 * mount, which keeps a server render and the first client paint motion-free either way.
 * Shares the figure's classes so a clip and a photo sit side by side as equals.
 */
export function Clip({ src, poster, alt, caption, className }: ClipProps) {
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const update = () => setAutoPlay(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <figure className={cx("ui-figure", className)}>
      <video
        key={autoPlay ? "play" : "still"}
        src={src}
        poster={poster}
        aria-label={alt}
        muted
        loop
        playsInline
        controls
        autoPlay={autoPlay}
        preload={autoPlay ? "auto" : "none"}
        className="ui-figure__image"
      />
      {caption === undefined ? null : (
        <figcaption className="ui-figure__caption">{caption}</figcaption>
      )}
    </figure>
  );
}
