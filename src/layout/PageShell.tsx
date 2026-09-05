import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

import { SkipLink, Stack } from "@/ui";
import { SiteFooter } from "@/layout/SiteFooter";
import { SiteHeader } from "@/layout/SiteHeader";

const MAIN_ID = "main";

export function PageShell() {
  const { pathname } = useLocation();

  // Client-side navigation keeps the scroll position; on a new page that reads as
  // a broken link. Reset it, except for in-page anchors.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Stack className="shell">
      <SkipLink to={`#${MAIN_ID}`}>Skip to content</SkipLink>
      <SiteHeader />
      <Stack as="main" id={MAIN_ID} grow className="shell__main">
        <Outlet />
      </Stack>
      <SiteFooter />
    </Stack>
  );
}
