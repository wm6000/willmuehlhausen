import { cx } from "@/ui/cx";

export type TextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  describedBy?: string | undefined;
  autoFocus?: boolean;
  className?: string;
};

export function Textarea({
  id,
  value,
  onChange,
  rows = 3,
  name,
  placeholder,
  ariaLabel,
  describedBy,
  autoFocus = false,
  className,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name ?? id}
      className={cx("ui-textarea", className)}
      rows={rows}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
