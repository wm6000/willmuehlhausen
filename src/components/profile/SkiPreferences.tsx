import { Checkbox, Row, Stack, Text } from "@/ui";
import { PASS_CHOICES, SKI_TYPE_CHOICES, type SkiPreferences as SkiPreferencesValue } from "@/data/profile";
import { toggleIn } from "@/lib/profile";

export type SkiPreferencesProps = {
  value: SkiPreferencesValue;
  onChange: (value: SkiPreferencesValue) => void;
};

export function SkiPreferences({ value, onChange }: SkiPreferencesProps) {
  return (
    <Stack gap={5} className="prefs">
      <Stack gap={3}>
        <Text size="sm" weight="medium">
          What kind of skiing
        </Text>
        <Row gap={4} wrap>
          {SKI_TYPE_CHOICES.map((choice) => (
            <Checkbox
              key={choice.value}
              id={`ski-type-${choice.value}`}
              checked={value.types.includes(choice.value)}
              onChange={() => onChange({ ...value, types: toggleIn(value.types, choice.value) })}
            >
              {choice.label}
            </Checkbox>
          ))}
        </Row>
        <Text size="xs" tone="subtle">
          {value.types.length === 0
            ? "Nothing picked, so the advisor considers all of them."
            : "Picked types come first in the recommendations."}
        </Text>
      </Stack>

      <Stack gap={3}>
        <Text size="sm" weight="medium">
          Passes you hold
        </Text>
        <Row gap={4} wrap>
          {PASS_CHOICES.map((choice) => (
            <Checkbox
              key={choice.value}
              id={`ski-pass-${choice.value}`}
              checked={value.passes.includes(choice.value)}
              onChange={() => onChange({ ...value, passes: toggleIn(value.passes, choice.value) })}
            >
              {choice.label}
            </Checkbox>
          ))}
        </Row>
      </Stack>
    </Stack>
  );
}
