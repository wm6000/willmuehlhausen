import { Field, Stack, Textarea } from "@/ui";
import type { PlanContext } from "@/data/profile";
import { TargetEvents } from "@/components/profile/TargetEvents";

export type ContextSectionProps = {
  value: PlanContext;
  onChange: (value: PlanContext) => void;
};

/**
 * What a feed of activities can't tell the advisor. Strava knows what you did; none of it
 * says what you're working towards, what hurts, or what date the whole block is aimed at.
 * That's what a plan is built from, so it's asked for in plain language rather than
 * squeezed into fields.
 */
export function ContextSection({ value, onChange }: ContextSectionProps) {
  return (
    <Stack gap={5}>
      <Field
        id="context-goals"
        label="What you're working towards"
        hint="Plain language. The advisor reads this the same way it reads an adjustment."
      >
        <Textarea
          id="context-goals"
          value={value.goals}
          onChange={(goals) => onChange({ ...value, goals })}
          placeholder="Building a base for a spring marathon, and I want to ski every powder day"
          describedBy="context-goals-hint"
        />
      </Field>

      <Field
        id="context-limitations"
        label="Anything to work around"
        hint="Injuries, and the things that reliably make them worse."
      >
        <Textarea
          id="context-limitations"
          value={value.limitations}
          onChange={(limitations) => onChange({ ...value, limitations })}
          placeholder="Low back is tight — avoid high-impact for now"
          describedBy="context-limitations-hint"
        />
      </Field>

      <TargetEvents value={value.events} onChange={(events) => onChange({ ...value, events })} />
    </Stack>
  );
}
