import { useState } from "react";
import { useLocation } from "react-router";

import { Button, Icon, Link, NavigationLink, Row, Stack, VisuallyHidden } from "@/ui";
import { NAV, SITE } from "@/data/site";
import { AuthMenu } from "@/layout/AuthMenu";
import { NavDrawer } from "@/layout/NavDrawer";

const DRAWER_ID = "site-drawer";

export function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [openFor, setOpenFor] = useState(pathname);

  // Navigating closes the drawer, without an effect that fires after paint.
  if (pathname !== openFor) {
    setOpenFor(pathname);
    setOpen(false);
  }

  return (
    <Stack as="header" className="header">
      <Row className="header__inner">
        <Link to="/" variant="plain" className="header__wordmark">
          {SITE.name}
        </Link>

        <Row gap={1} className="header__desktop">
          <Row as="nav" gap={1} className="header__nav">
            {NAV.map((item) => (
              <NavigationLink key={item.to} to={item.to} end={item.end ?? false} className="header__link">
                {item.label}
              </NavigationLink>
            ))}
          </Row>
          <Row gap={2} className="header__actions">
            <AuthMenu />
          </Row>
        </Row>

        <Row className="header__burger">
          <Button
            variant="ghost"
            size="icon"
            ariaExpanded={open}
            ariaControls={DRAWER_ID}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
            <VisuallyHidden>{open ? "Close menu" : "Open menu"}</VisuallyHidden>
          </Button>
        </Row>
      </Row>

      {open ? <NavDrawer id={DRAWER_ID} /> : null}
    </Stack>
  );
}
