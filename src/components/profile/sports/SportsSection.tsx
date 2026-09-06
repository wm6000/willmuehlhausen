import { Badge, Row, Stack, Text } from "@/ui";
import { TIER_LABELS, type SportTiers, type Tier } from "@/data/profile";
import { SPORT_CATEGORIES, type SportId } from "@/data/sports";
import { chosenSports, chosenWithoutDomain, isUnset } from "@/lib/sports";
import { SportGroup } from "@/components/profile/sports/SportGroup";

export type SportsSectionProps = {
  value: SportTiers;
  onChange: (value: SportTiers) => void;
};

/**
 * The sports you do, ranked. Primary is what you build a week around; Secondary fills the
 * gaps; anything you don't pick is simply not there.
 *
 * The summary sits above the catalogue because that is the answer — the 55 rows below it
 * are how you change it, and stay collapsed until you want them.
 */
export function SportsSection({ value, onChange }: SportsSectionProps) {
  const chosen = chosenSports(value);
  const unset = isUnset(value);
  const undomained = chosenWithoutDomain(value);

  function setTier(id: SportId, tier: Tier | null) {
    const next: SportTiers = { ...value };
    if (tier === null) {
      delete next[id];
    } else {
      next[id] = tier;
    }
    onChange(next);
  }

  return (
    <Stack gap={5}>
      {unset ? (
        <Row gap={3} wrap className="banner">
          <Text inline size="sm" weight="medium">
            Nothing picked yet.
          </Text>
          <Text inline size="sm" tone="muted">
            Until you rank a sport the advisor assumes you do everything, the same as it does
            for a stranger. Pick the ones you actually do and it starts working for you.
          </Text>
        </Row>
      ) : (
        <Stack gap={3} className="chosen">
          <Text size="sm" weight="medium">
            Your sports
          </Text>
          <Row gap={2} wrap>
            {chosen.map(({ sport, tier }) => (
              <Badge key={sport.id} tone={tier === "primary" ? "accent" : "outline"}>
                {sport.label}
              </Badge>
            ))}
          </Row>
          <Text size="xs" tone="subtle">
            Filled badges are {TIER_LABELS.primary.toLowerCase()}; outlined are{" "}
            {TIER_LABELS.secondary.toLowerCase()}. Primary wins when a day suits both.
          </Text>
          {undomained.length > 0 ? (
            <Text size="xs" tone="subtle">
              The advisor can't plan around {undomained.map((sport) => sport.label).join(", ")} yet
              — it has snow and training load, and no swell, wind or court booking. They're
              recorded, and they'll start counting when there's data behind them.
            </Text>
          ) : null}
        </Stack>
      )}

      <Stack gap={2}>
        {SPORT_CATEGORIES.map((category) => (
          <SportGroup
            key={category.id}
            category={category.id}
            label={category.label}
            tiers={value}
            onChange={setTier}
          />
        ))}
      </Stack>
    </Stack>
  );
}
