import { Row, Stack, Switch, Text } from "@/ui";
import type { EmailPreferences } from "@/data/profile";
import { useSession } from "@/components/auth/SessionContext";

export type EmailSectionProps = {
  value: EmailPreferences;
  onChange: (value: EmailPreferences) => void;
};

const OPTIONS = [
  {
    key: "daily" as const,
    label: "Daily",
    description: "The morning's call, before you've decided anything.",
  },
  {
    key: "weekly" as const,
    label: "Weekly",
    description: "Sunday: the week behind you, and what the next one looks like.",
  },
];

/**
 * Two switches, both off by default. Opting in is a thing a person does, never a default
 * they have to find and undo.
 *
 * Nothing is sent — there is no backend to send it — and the section says so rather than
 * collecting a subscription that quietly goes nowhere.
 */
export function EmailSection({ value, onChange }: EmailSectionProps) {
  const { session } = useSession();

  return (
    <Stack gap={4}>
      {OPTIONS.map((option) => {
        const id = `email-${option.key}`;
        return (
          <Row key={option.key} justify="between" gap={4} className="connection">
            <Stack gap={1}>
              <Text size="sm" weight="medium">
                {option.label}
              </Text>
              <Text size="sm" tone="muted" id={`${id}-description`}>
                {option.description}
              </Text>
            </Stack>
            <Switch
              id={id}
              checked={value[option.key]}
              onChange={(checked) => onChange({ ...value, [option.key]: checked })}
              ariaLabel={`${option.label} email — on or off`}
              describedBy={`${id}-description`}
            />
          </Row>
        );
      })}

      <Text size="xs" tone="subtle" prose>
        {session === null
          ? "No email is sent — there's no backend to send it."
          : `No email is sent yet — there's no backend to send it. When there is, these would go to ${session.email}.`}
      </Text>
    </Stack>
  );
}
