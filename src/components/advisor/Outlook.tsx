import { Badge, Grid, Row, Stack, Text } from "@/ui";
import { ALL_ACTIVITIES, VERDICT_LABELS, verdictFor } from "@/lib/advisor";
import { WEEK } from "@/data/advisor";
import type { ActivityFlags } from "@/data/profile";

export type OutlookProps = {
  enabled?: ActivityFlags;
  /** Snow is only worth a column if skiing is something you do. */
  showConditions?: boolean;
};

/**
 * Seven days, each one snow plus calendar plus training load resolved into a single
 * call. The old site showed two separate seven-day lists and left you to reconcile
 * them; the reconciliation is the product.
 */
export function Outlook({ enabled = ALL_ACTIVITIES, showConditions = true }: OutlookProps) {
  return (
    <Stack gap={2} as="ul" className="outlook">
      {WEEK.map((day) => {
        const verdict = verdictFor(day, enabled);
        return (
          <Stack as="li" key={day.label} className="outlook__day">
            <Grid gap={3} className={showConditions ? "outlook__row" : "outlook__row outlook__row--narrow"}>
              <Row gap={3} align="center">
                <Badge tone={verdict}>{VERDICT_LABELS[verdict]}</Badge>
                <Text inline size="sm" weight="medium">
                  {day.label}
                </Text>
              </Row>
              {showConditions ? (
                <Text inline size="sm" tone="muted">
                  {day.conditions}
                </Text>
              ) : null}
              <Text inline size="sm" tone="subtle">
                {day.free ? day.training : "Calendar's full"}
              </Text>
            </Grid>
          </Stack>
        );
      })}
    </Stack>
  );
}
