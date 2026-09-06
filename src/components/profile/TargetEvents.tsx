import { Button, Icon, Input, Row, Stack, Text, VisuallyHidden } from "@/ui";
import type { TargetEvent } from "@/data/profile";

export type TargetEventsProps = {
  value: TargetEvent[];
  onChange: (value: TargetEvent[]) => void;
};

/**
 * The dates a plan has to be built backwards from. A row is added empty and edited in
 * place rather than through a dialog — there is nothing to validate that a person can't
 * see, and a half-filled row is a perfectly good draft.
 *
 * Ids are generated rather than positional so removing the first row doesn't make React
 * reuse its inputs for the second.
 */
export function TargetEvents({ value, onChange }: TargetEventsProps) {
  function add() {
    onChange([...value, { id: crypto.randomUUID(), name: "", date: "" }]);
  }

  function edit(id: string, patch: Partial<Omit<TargetEvent, "id">>) {
    onChange(value.map((event) => (event.id === id ? { ...event, ...patch } : event)));
  }

  function remove(id: string) {
    onChange(value.filter((event) => event.id !== id));
  }

  return (
    <Stack gap={3}>
      <Text size="sm" weight="medium">
        Target events
      </Text>

      {value.length === 0 ? (
        <Text size="sm" tone="subtle">
          Nothing on the calendar yet. Add a race, a trip or a course and the plan works
          backwards from it.
        </Text>
      ) : (
        <Stack gap={2} as="ul" className="events">
          {value.map((event) => (
            <Stack as="li" key={event.id}>
              <Row gap={2} wrap className="events__row">
                <Input
                  id={`event-name-${event.id}`}
                  value={event.name}
                  onChange={(name) => edit(event.id, { name })}
                  placeholder="Cascade Crest 100"
                  className="events__name"
                />
                <Input
                  id={`event-date-${event.id}`}
                  type="date"
                  value={event.date}
                  onChange={(date) => edit(event.id, { date })}
                  className="events__date"
                />
                <Button variant="ghost" size="icon" onClick={() => remove(event.id)}>
                  <Icon name="close" size={16} />
                  <VisuallyHidden>
                    {event.name === "" ? "Remove this event" : `Remove ${event.name}`}
                  </VisuallyHidden>
                </Button>
              </Row>
            </Stack>
          ))}
        </Stack>
      )}

      <Row>
        <Button variant="secondary" onClick={add}>
          <Icon name="plus" size={16} />
          Add a target event
        </Button>
      </Row>
    </Stack>
  );
}
