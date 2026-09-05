import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type BadgeTone = "neutral" | "outline" | "accent" | "ski" | "train" | "rest" | "busy";

export type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return <span className={cx("ui-badge", tone !== "neutral" && `ui-badge--${tone}`, className)}>{children}</span>;
}
