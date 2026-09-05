import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

import { cx } from "@/ui/cx";
import type { ButtonSize, ButtonVariant } from "@/ui/controls/Button";

export type ButtonLinkProps = {
  children: ReactNode;
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
};

/** A link that looks like a button. Keeps navigation on an anchor, where it belongs. */
export function ButtonLink({
  children,
  to,
  variant = "secondary",
  size = "md",
  external = false,
  ariaLabel,
  className,
}: ButtonLinkProps) {
  const classes = cx("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className);

  if (external) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer noopener" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} className={classes} aria-label={ariaLabel}>
      {children}
    </RouterLink>
  );
}
