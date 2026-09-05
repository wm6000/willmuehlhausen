import type { ReactNode } from "react";

import { cx } from "@/ui/cx";
import type { Align, Gap, Justify } from "@/ui/box/Stack";

export type RowProps = {
  children: ReactNode;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  grow?: boolean;
  as?: "div" | "nav" | "ul" | "li";
  /** Names the region. A <nav> without one is indistinguishable from the site nav. */
  ariaLabel?: string;
  className?: string;
};

export function Row({
  children,
  gap = 0,
  align = "center",
  justify,
  wrap = false,
  grow = false,
  as = "div",
  ariaLabel,
  className,
}: RowProps) {
  const classes = cx(
    "ui-row",
    `ui-gap-${gap}`,
    `ui-align-${align}`,
    justify && `ui-justify-${justify}`,
    wrap && "ui-row--wrap",
    grow && "ui-grow",
    className
  );

  switch (as) {
    case "nav":
      return (
        <nav aria-label={ariaLabel} className={classes}>
          {children}
        </nav>
      );
    case "ul":
      return (
        <ul aria-label={ariaLabel} className={classes}>
          {children}
        </ul>
      );
    case "li":
      return (
        <li aria-label={ariaLabel} className={classes}>
          {children}
        </li>
      );
    default:
      return (
        <div aria-label={ariaLabel} className={classes}>
          {children}
        </div>
      );
  }
}
