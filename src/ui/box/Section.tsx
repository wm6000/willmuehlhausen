import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type SectionProps = {
  children: ReactNode;
  pad?: "sm" | "md" | "lg";
  narrow?: boolean;
  muted?: boolean;
  topRule?: boolean;
  labelledBy?: string;
  className?: string;
};

/** A full-bleed band with a centred, max-width inner column. Owns page rhythm. */
export function Section({
  children,
  pad = "md",
  narrow = false,
  muted = false,
  topRule = false,
  labelledBy,
  className,
}: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cx(
        "ui-section",
        `ui-section--pad-${pad}`,
        narrow && "ui-section--narrow",
        muted && "ui-section--muted",
        topRule && "ui-section--top-rule",
        className
      )}
    >
      <div className="ui-section__inner">{children}</div>
    </section>
  );
}
