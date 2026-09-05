import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type FieldProps = {
  /** Must match the id of the control inside, which is what `htmlFor` points at. */
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  /** Null when the field is fine. A string here also styles the control as invalid. */
  error?: string | null;
  className?: string;
};

/**
 * Label, control, and the hint and error that belong to it. The ids of the hint and
 * error are derived from the field id — pass `fieldDescribedBy(...)` to the control
 * so a screen reader reads them out as part of the field rather than as loose text.
 */
export function fieldDescribedBy(id: string, hint?: string, error?: string | null): string | undefined {
  const ids = [hint === undefined ? null : `${id}-hint`, error ? `${id}-error` : null].filter(
    (value): value is string => value !== null
  );
  return ids.length === 0 ? undefined : ids.join(" ");
}

export function Field({ id, label, children, hint, error, className }: FieldProps) {
  return (
    <div className={cx("ui-field", className)}>
      <label htmlFor={id} className="ui-field__label">
        {label}
      </label>
      {children}
      {hint === undefined ? null : (
        <p id={`${id}-hint`} className="ui-field__hint">
          {hint}
        </p>
      )}
      {error ? (
        <p id={`${id}-error`} className="ui-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
