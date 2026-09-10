import { cx } from "@/ui/cx";

export type BarTone = "accent" | "alt" | "muted" | "danger";

export type Bar = {
  label: string;
  value: number;
  tone?: BarTone;
  /** Overrides the printed figure. Without it the value is shown as-is to 2dp. */
  display?: string;
};

export type BarsProps = {
  items: readonly Bar[];
  /** The value a full-width bar represents. Rates are 0..1, counts are not. */
  max?: number;
  /** Renders the label column; off for a bare comparison inside an existing row. */
  showLabels?: boolean;
  className?: string;
};

/**
 * A row of labelled proportional bars.
 *
 * Deliberately not a chart library: these are one-dimensional rates that need to be
 * scannable and comparable down a column, and an axis would add furniture without
 * adding information. Bars are given an explicit accessible value because a
 * width-in-percent means nothing to a screen reader.
 */
export function Bars({ items, max = 1, showLabels = true, className }: BarsProps) {
  return (
    <div className={cx("ui-bars", className)}>
      {items.map((item) => {
        const ratio = max === 0 ? 0 : Math.max(0, Math.min(1, item.value / max));
        return (
          <div className="ui-bars__row" key={item.label}>
            {showLabels ? <span className="ui-bars__label">{item.label}</span> : null}
            <span
              className="ui-bars__track"
              role="meter"
              aria-valuenow={Math.round(item.value * 100) / 100}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={item.label}
            >
              <span
                className={cx("ui-bars__fill", `ui-bars__fill--${item.tone ?? "accent"}`)}
                style={{ width: `${ratio * 100}%` }}
              />
            </span>
            <span className="ui-bars__value">{item.display ?? item.value.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
}
