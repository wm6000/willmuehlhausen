import { Button, Icon, Row, Stack, Text } from "@/ui";
import type { IconName } from "@/ui";
import { THEME_LABELS, nextTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import { useProfile } from "@/components/profile/ProfileContext";

const ICONS: Record<Theme, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

const DESCRIPTIONS: Record<Theme, string> = {
  light: "Always light, whatever your device is set to.",
  dark: "Always dark, whatever your device is set to.",
  system: "Following your device, so it changes when your device does.",
};

/**
 * Cycles light → dark → system. System removes the theme attribute and hands the
 * decision back to prefers-color-scheme, which is why it can look identical to
 * whichever of the other two your device is already using — the label is there to
 * say which mode you're actually in when the colours can't.
 *
 * Reads and writes the profile directly rather than holding its own state, so the
 * one on screen is always the saved one. ThemeSync is what puts it on the document.
 */
export function ThemeToggle() {
  const { profile, setTheme } = useProfile();
  const theme = profile.theme;
  const upcoming = nextTheme(theme);

  return (
    <Row gap={4} align="center">
      <Button
        variant="secondary"
        size="icon"
        ariaLabel={`Theme: ${THEME_LABELS[theme]}. Switch to ${THEME_LABELS[upcoming]}.`}
        onClick={() => setTheme(upcoming)}
      >
        <Icon name={ICONS[theme]} size={18} />
      </Button>
      <Stack gap={1}>
        <Text size="sm" weight="medium">
          {THEME_LABELS[theme]}
        </Text>
        <Text size="sm" tone="muted">
          {DESCRIPTIONS[theme]}
        </Text>
      </Stack>
    </Row>
  );
}
