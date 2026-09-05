import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg" | "icon";

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  className?: string;
};

/** For actions. Anything that navigates is a ButtonLink, not a Button. */
export function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
  ariaExpanded,
  ariaControls,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
