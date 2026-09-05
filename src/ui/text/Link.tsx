import type { ReactNode } from "react";
import { NavLink, Link as RouterLink } from "react-router";

import { cx } from "@/ui/cx";

export type LinkVariant = "default" | "quiet" | "plain";

type CommonProps = {
  children: ReactNode;
  variant?: LinkVariant;
  className?: string;
};

export type LinkProps = CommonProps & {
  to: string;
  /** Renders an <a> for anything off-site; router navigation otherwise. */
  external?: boolean;
  ariaLabel?: string;
};

function variantClass(variant: LinkVariant, className?: string) {
  return cx("ui-link", variant !== "default" && `ui-link--${variant}`, className);
}

export function Link({ children, to, variant = "default", external = false, ariaLabel, className }: LinkProps) {
  const classes = variantClass(variant, className);

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

export type NavigationLinkProps = CommonProps & {
  to: string;
  /** Class applied always; `aria-current="page"` is set by the router on match. */
  end?: boolean;
};

/** A router-aware link that marks itself as the current page. Styling comes from `className`. */
export function NavigationLink({ children, to, end = false, className }: NavigationLinkProps) {
  return (
    <NavLink to={to} end={end} className={className ?? ""}>
      {children}
    </NavLink>
  );
}
