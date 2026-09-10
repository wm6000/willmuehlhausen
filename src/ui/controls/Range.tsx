import { cx } from "@/ui/cx";

export type RangeProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
  ariaLabel: string;
  /** Read out instead of the raw number, so "March" beats "2". */
  valueText?: string | undefined;
  className?: string;
};

/**
 * A slider over a small range of discrete steps.
 *
 * Lives in controls/ rather than inputs/ because inputs/ is at the seven-file cap and a
 * slider is closer to a control than to a form field — it is dragged, not typed into,
 * and it carries no label/hint/error furniture.
 */
export function Range({
  id,
  value,
  min,
  max,
  onChange,
  step = 1,
  ariaLabel,
  valueText,
  className,
}: RangeProps) {
  return (
    <input
      id={id}
      type="range"
      className={cx("ui-range", className)}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      aria-valuetext={valueText}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
