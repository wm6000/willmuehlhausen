import { NavigationLink, Row, Stack } from "@/ui";
import { NAV } from "@/data/site";
import { AuthMenu } from "@/layout/AuthMenu";

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
        <Row className="drawer__footer">
          <AuthMenu block />
        </Row>
      </Stack>
    </Stack>
  );
}
