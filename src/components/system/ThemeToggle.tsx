import { useState } from "react";

import { Button, Icon, Row, Stack, Text } from "@/ui";
import type { IconName } from "@/ui";
import { THEME_LABELS, applyTheme, nextTheme, readTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import { useSession } from "@/components/auth/SessionContext";

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
 * The choice is stored against the signed-in person, so it follows them to another
 * browser and never leaks to whoever signs in here next. ThemeSync is what applies
 * it when the session changes; this component only handles the press.
 */
export function ThemeToggle() {
  const { session } = useSession();
  const email = session?.email ?? null;

  // Read during the initial render, not in an effect. The colours are already correct
  // before first paint thanks to the inline script in index.html, and an effect here
  // would paint one frame of the wrong icon before correcting itself.
  const [theme, setTheme] = useState<Theme>(() => readTheme(email));
  const upcoming = nextTheme(theme);

  return (
    <Row gap={4} align="center">
      <Button
        variant="secondary"
        size="icon"
        ariaLabel={`Theme: ${THEME_LABELS[theme]}. Switch to ${THEME_LABELS[upcoming]}.`}
        onClick={() => {
          setTheme(upcoming);
          applyTheme(email, upcoming);
        }}
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
