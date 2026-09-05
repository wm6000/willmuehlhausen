import { useState } from "react";

import { Button, Icon, VisuallyHidden } from "@/ui";
import type { IconName } from "@/ui";
import { applyTheme, nextTheme, readTheme, THEME_LABELS } from "@/lib/theme";
import type { Theme } from "@/lib/theme";

const ICONS: Record<Theme, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

export function ThemeToggle() {
  // Read during the initial render rather than in an effect. The pre-paint script in
  // index.html has already applied the stored theme to the document, so the colours
  // are right either way — but starting from "system" and correcting afterwards paints
  // one frame of the monitor icon on top of an already-light or already-dark page.
  const [theme, setTheme] = useState<Theme>(readTheme);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        const updated = nextTheme(theme);
        setTheme(updated);
        applyTheme(updated);
      }}
    >
      <Icon name={ICONS[theme]} size={18} />
      <VisuallyHidden>{`Theme: ${THEME_LABELS[theme]}. Switch to ${THEME_LABELS[nextTheme(theme)]}.`}</VisuallyHidden>
    </Button>
  );
}
