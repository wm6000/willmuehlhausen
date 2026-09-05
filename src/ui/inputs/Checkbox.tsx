import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  name?: string;
  className?: string;
};

/** The label wraps the box, so the text is part of the hit target. */
export function Checkbox({ id, checked, onChange, children, name, className }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cx("ui-checkbox", className)}>
      <input
        id={id}
        name={name ?? id}
        type="checkbox"
        className="ui-checkbox__control"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="ui-checkbox__label">{children}</span>
    </label>
  );
}
