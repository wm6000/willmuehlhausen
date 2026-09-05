import { NavigationLink, Row, Stack, Text } from "@/ui";
import { NAV } from "@/data/site";
import { AuthMenu } from "@/layout/AuthMenu";
import { ThemeToggle } from "@/layout/ThemeToggle";

export type NavDrawerProps = {
  id: string;
};

export function NavDrawer({ id }: NavDrawerProps) {
  return (
    <Stack id={id} className="drawer">
      <Stack as="nav" className="drawer__inner">
        {NAV.map((item) => (
          <NavigationLink key={item.to} to={item.to} end={item.end ?? false} className="drawer__link">
            {item.label}
          </NavigationLink>
        ))}
        <Row justify="between" className="drawer__footer">
          <Text size="sm" tone="muted">
            Theme
          </Text>
          <Row gap={2}>
            <ThemeToggle />
            <AuthMenu />
          </Row>
        </Row>
      </Stack>
    </Stack>
  );
}
