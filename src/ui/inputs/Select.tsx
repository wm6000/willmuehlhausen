import { cx } from "@/ui/cx";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  name?: string;
  describedBy?: string | undefined;
  className?: string;
};

/**
 * A native select. Deliberately not a custom listbox: the platform one is keyboard
 * accessible, screen-reader correct and, on a phone, a much better control than
 * anything we would build.
 */
export function Select({ id, value, onChange, options, name, describedBy, className }: SelectProps) {
  return (
    <div className={cx("ui-select", className)}>
      <select
        id={id}
        name={name ?? id}
        className="ui-select__control"
        value={value}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
