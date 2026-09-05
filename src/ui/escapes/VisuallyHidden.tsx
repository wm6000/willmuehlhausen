import type { ReactNode } from "react";

export type VisuallyHiddenProps = {
  children: ReactNode;
};

/** Readable by screen readers, invisible on screen. */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="ui-visually-hidden">{children}</span>;
}
