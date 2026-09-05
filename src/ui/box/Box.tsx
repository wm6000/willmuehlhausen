import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type BoxPad = 2 | 3 | 4 | 5 | 6;
export type BoxBackground = "none" | "surface" | "muted";

export type BoxProps = {
  children: ReactNode;
  pad?: BoxPad;
  background?: BoxBackground;
  bordered?: boolean;
  rounded?: boolean | "lg";
  full?: boolean;
  className?: string;
};

export function Box({
  children,
  pad,
  background = "none",
  bordered = false,
  rounded = false,
  full = false,
  className,
}: BoxProps) {
  return (
    <div
      className={cx(
        "ui-box",
        pad && `ui-box--pad-${pad}`,
        background !== "none" && `ui-box--${background}`,
        bordered && "ui-box--bordered",
        rounded === true && "ui-box--rounded",
        rounded === "lg" && "ui-box--rounded-lg",
        full && "ui-box--full",
        className
      )}
    >
      {children}
    </div>
  );
}
