import type { ReactNode } from "react";

import { cx } from "@/ui/cx";
import type { Gap } from "@/ui/box/Stack";

export type GridProps = {
  children: ReactNode;
  gap?: Gap;
  /** A layout class from styles/components.css or styles/layout.css owns the columns. */
  className?: string;
  as?: "div" | "ul";
};

export function Grid({ children, gap = 4, className, as = "div" }: GridProps) {
  const classes = cx("ui-grid", `ui-gap-${gap}`, className);

  if (as === "ul") {
    return <ul className={classes}>{children}</ul>;
  }

  return <div className={classes}>{children}</div>;
}
