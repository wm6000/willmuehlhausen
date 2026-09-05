import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between";

export type StackProps = {
  children: ReactNode;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  grow?: boolean;
  as?: "div" | "nav" | "ul" | "li" | "header" | "footer" | "main";
  id?: string;
  className?: string;
};

export function Stack({ children, gap = 0, align, justify, grow = false, as = "div", id, className }: StackProps) {
  const classes = cx(
    "ui-stack",
    `ui-gap-${gap}`,
    align && `ui-align-${align}`,
    justify && `ui-justify-${justify}`,
    grow && "ui-grow",
    className
  );

  switch (as) {
    case "nav":
      return (
        <nav id={id} className={classes}>
          {children}
        </nav>
      );
    case "ul":
      return (
        <ul id={id} className={classes}>
          {children}
        </ul>
      );
    case "li":
      return (
        <li id={id} className={classes}>
          {children}
        </li>
      );
    case "header":
      return (
        <header id={id} className={classes}>
          {children}
        </header>
      );
    case "footer":
      return (
        <footer id={id} className={classes}>
          {children}
        </footer>
      );
    case "main":
      return (
        <main id={id} className={classes}>
          {children}
        </main>
      );
    default:
      return (
        <div id={id} className={classes}>
          {children}
        </div>
      );
  }
}
