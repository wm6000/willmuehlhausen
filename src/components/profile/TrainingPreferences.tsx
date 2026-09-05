import { Field, Stack, Textarea } from "@/ui";
import type { TrainingPreferences as TrainingPreferencesValue } from "@/data/profile";

export type TrainingPreferencesProps = {
  value: TrainingPreferencesValue;
  onChange: (value: TrainingPreferencesValue) => void;
};

export function TrainingPreferences({ value, onChange }: TrainingPreferencesProps) {
  return (
    <Stack gap={5} className="prefs">
      <Field
        id="training-goals"
        label="What you're training for"
        hint="Plain language. The advisor reads this the same way it reads an adjustment."
      >
        <Textarea
          id="training-goals"
          value={value.goals}
          onChange={(goals) => onChange({ ...value, goals })}
          placeholder="Building a base for a spring marathon, and I want to ski every powder day"
          describedBy="training-goals-hint"
        />
      </Field>

      <Field
        id="training-limitations"
        label="Anything to work around"
        hint="Injuries, and the things that reliably make them worse."
      >
        <Textarea
          id="training-limitations"
          value={value.limitations}
          onChange={(limitations) => onChange({ ...value, limitations })}
          placeholder="Low back is tight — avoid high-impact for now"
          describedBy="training-limitations-hint"
        />
      </Field>
    </Stack>
  );
}
