import { cx } from "@/ui/cx";

export type DotProps = {
  className?: string;
};

/** A small decorative status dot. Meaning comes from the label beside it. */
export function Dot({ className }: DotProps) {
  return <span aria-hidden="true" className={cx("ui-dot", className)} />;
}
