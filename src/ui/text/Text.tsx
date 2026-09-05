import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type TextSize = "xs" | "sm" | "base" | "md" | "lg";
export type TextTone = "default" | "muted" | "subtle" | "accent";
export type TextWeight = "normal" | "medium" | "semibold";

export type TextProps = {
  children: ReactNode;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  mono?: boolean;
  eyebrow?: boolean;
  prose?: boolean;
  balance?: boolean;
  inline?: boolean;
  id?: string;
  className?: string;
};

export function Text({
  children,
  size = "base",
  tone = "default",
  weight = "normal",
  mono = false,
  eyebrow = false,
  prose = false,
  balance = false,
  inline = false,
  id,
  className,
}: TextProps) {
  const classes = cx(
    "ui-text",
    `ui-text--${size}`,
    tone !== "default" && `ui-text--${tone}`,
    weight !== "normal" && `ui-text--${weight}`,
    mono && "ui-text--mono",
    eyebrow && "ui-text--eyebrow",
    prose && "ui-text--prose",
    balance && "ui-text--balance",
    className
  );

  if (inline) {
    return (
      <span id={id} className={classes}>
        {children}
      </span>
    );
  }

  return (
    <p id={id} className={classes}>
      {children}
    </p>
  );
}
