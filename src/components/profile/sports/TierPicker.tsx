import { Field, Row, Select, Text } from "@/ui";
import { TIER_LABELS, type Tier } from "@/data/profile";
import type { Sport } from "@/data/sports";

export type TierPickerProps = {
  sport: Sport;
  tier: Tier | null;
  onChange: (tier: Tier | null) => void;
};

/**
 * One sport, one tier. A native select rather than anything draggable: HTML5 drag events
 * don't fire on touch at all, and a dragging interaction needs a single-pointer
 * alternative to be accessible anyway — so the alternative may as well be the whole
 * control.
 */
const OPTIONS = [
  { value: "off", label: "Off" },
  { value: "secondary", label: TIER_LABELS.secondary },
  { value: "primary", label: TIER_LABELS.primary },
];

function toTier(value: string): Tier | null {
  return value === "primary" || value === "secondary" ? value : null;
}

export function TierPicker({ sport, tier, onChange }: TierPickerProps) {
  const id = `sport-${sport.id}`;

  return (
    <Field id={id} label={sport.label} className="sport">
      <Row gap={3} align="center" className="sport__control">
        {sport.domain === null ? (
          <Text inline size="xs" tone="subtle" className="sport__note">
            Not used yet
          </Text>
        ) : null}
        <Select id={id} value={tier ?? "off"} options={OPTIONS} onChange={(v) => onChange(toTier(v))} />
      </Row>
    </Field>
  );
}
