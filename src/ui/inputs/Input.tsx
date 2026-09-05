import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type InputType = "text" | "email" | "password";

export type InputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputType;
  name?: string;
  placeholder?: string;
  /** The autofill hint. Getting this right is most of what makes a login painless. */
  autoComplete?: string;
  autoFocus?: boolean;
  invalid?: boolean;
  /** Ids of the hint and error text, so a screen reader hears them with the field. */
  describedBy?: string | undefined;
  /** Sits inside the field's right edge — a reveal toggle, a unit, a spinner. */
  trailing?: ReactNode;
  className?: string;
};

export function Input({
  id,
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  autoComplete,
  autoFocus = false,
  invalid = false,
  describedBy,
  trailing,
  className,
}: InputProps) {
  return (
    <div className={cx("ui-input", invalid && "ui-input--invalid", trailing !== undefined && "ui-input--trailing", className)}>
      <input
        id={id}
        name={name ?? id}
        type={type}
        className="ui-input__control"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
      {trailing === undefined ? null : <div className="ui-input__trailing">{trailing}</div>}
    </div>
  );
}
