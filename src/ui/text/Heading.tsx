import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type HeadingProps = {
  children: ReactNode;
  /** Semantic level. Visual size follows unless `size` overrides it. */
  level: 1 | 2 | 3 | 4;
  size?: 1 | 2 | 3 | 4;
  id?: string;
  className?: string;
};

export function Heading({ children, level, size, id, className }: HeadingProps) {
  const classes = cx("ui-heading", `ui-heading--${size ?? level}`, className);

  switch (level) {
    case 1:
      return (
        <h1 id={id} className={classes}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 id={id} className={classes}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 id={id} className={classes}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 id={id} className={classes}>
          {children}
        </h4>
      );
  }
}
