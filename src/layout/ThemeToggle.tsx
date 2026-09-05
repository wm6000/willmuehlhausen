import { useEffect, useState } from "react";

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
  const [theme, setTheme] = useState<Theme>("system");

  // The pre-paint script in index.html has already applied the stored theme; this
  // only syncs React's copy of it, so the button shows the right icon on first paint.
  useEffect(() => {
    setTheme(readTheme());
  }, []);

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
