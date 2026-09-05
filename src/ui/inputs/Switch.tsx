import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type SwitchProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label. Omit when something else on the row already names the switch. */
  children?: ReactNode;
  /** Required when there is no visible label of its own. */
  ariaLabel?: string;
  describedBy?: string | undefined;
  name?: string;
  className?: string;
};

/**
 * A native checkbox with role="switch", styled into a track and thumb. Not a button:
 * a checkbox is already on/off to every assistive technology, already in the tab order,
 * and already toggles on Space — role="switch" only changes how it's announced.
 */
export function Switch({
  id,
  checked,
  onChange,
  children,
  ariaLabel,
  describedBy,
  name,
  className,
}: SwitchProps) {
  return (
    <label htmlFor={id} className={cx("ui-switch", className)}>
      <input
        id={id}
        name={name ?? id}
        type="checkbox"
        role="switch"
        className="ui-switch__control"
        checked={checked}
        aria-label={children === undefined ? ariaLabel : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />
      {children === undefined ? null : <span className="ui-switch__text">{children}</span>}
    </label>
  );
}
