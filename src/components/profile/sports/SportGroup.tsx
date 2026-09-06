import { useState } from "react";

import { Button, Icon, Row, Stack, Text } from "@/ui";
import type { SportTiers, Tier } from "@/data/profile";
import { sportsInCategory, type SportCategory, type SportId } from "@/data/sports";
import { countInCategory, tierOf } from "@/lib/sports";
import { TierPicker } from "@/components/profile/sports/TierPicker";

export type SportGroupProps = {
  category: SportCategory;
  label: string;
  tiers: SportTiers;
  onChange: (id: SportId, tier: Tier | null) => void;
};

/**
 * One collapsible category. Collapsed by default — 52 sports open at once is a wall, and
 * the count in the header is what you actually need at a glance.
 *
 * The disclosure is a button with aria-expanded and aria-controls over a conditionally
 * rendered panel, the same pattern SiteHeader uses for the mobile drawer. No new
 * primitive, and no popup machinery.
 */
export function SportGroup({ category, label, tiers, onChange }: SportGroupProps) {
  const [open, setOpen] = useState(false);
  const panelId = `sports-${category}`;
  const count = countInCategory(tiers, category);
  const sports = sportsInCategory(category);

  return (
    <Stack className="group">
      <Button
        variant="ghost"
        ariaExpanded={open}
        ariaControls={panelId}
        className="group__toggle"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "chevronDown" : "chevronRight"} size={16} />
        <Text inline size="sm" weight="medium">
          {label}
        </Text>
        <Text inline size="xs" tone={count > 0 ? "accent" : "subtle"}>
          {count === 0 ? `${sports.length} sports` : `${count} of ${sports.length}`}
        </Text>
      </Button>

      {open ? (
        <Stack gap={2} id={panelId} className="group__panel">
          {sports.map((sport) => (
            <Row key={sport.id} className="group__row">
              <TierPicker
                sport={sport}
                tier={tierOf(tiers, sport.id)}
                onChange={(tier) => onChange(sport.id, tier)}
              />
            </Row>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
