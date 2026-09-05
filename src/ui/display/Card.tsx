import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

import { cx } from "@/ui/cx";

export type CardProps = {
  children: ReactNode;
  /** Turns the whole card into a link, and lifts it on hover. */
  to?: string;
  external?: boolean;
  className?: string;
};

export function Card({ children, to, external = false, className }: CardProps) {
  if (to === undefined) {
    return <div className={cx("ui-card", className)}>{children}</div>;
  }

  const classes = cx("ui-card", "ui-card--interactive", "ui-link--plain", className);

  if (external) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} className={classes}>
      {children}
    </RouterLink>
  );
}
