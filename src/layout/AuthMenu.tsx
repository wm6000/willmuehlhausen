import { Button, ButtonLink, Link, Row, Text, VisuallyHidden } from "@/ui";
import { initials } from "@/lib/credentials";
import { useSession } from "@/components/auth/SessionContext";

export type AuthMenuProps = {
  /** Full-width presentation inside the mobile drawer. */
  block?: boolean;
};

/**
 * Signed out it's a link to /login; signed in it's the avatar, a way to the profile
 * and a way out. Deliberately flat rather than a dropdown: a popup would need a ref
 * to detect a click outside it, and refs into raw elements live in src/ui only.
 */
export function AuthMenu({ block = false }: AuthMenuProps) {
  const { session, signOut } = useSession();

  if (session === null) {
    return (
      <ButtonLink to="/login" variant="secondary" size="md" className={block ? "ui-box--full" : ""}>
        Sign in
      </ButtonLink>
    );
  }

  return (
    <Row gap={2} align="center" className={block ? "auth ui-box--full" : "auth"}>
      <Link to="/profile" variant="plain" className="auth__avatar" ariaLabel={`Profile for ${session.name}`}>
        <Text inline size="xs" weight="semibold">
          {initials(session.name)}
        </Text>
      </Link>
      {block ? (
        <Text inline size="sm" tone="muted" className="ui-grow">
          {session.name}
        </Text>
      ) : null}
      <Button variant="ghost" onClick={signOut}>
        Sign out
        <VisuallyHidden> as {session.name}</VisuallyHidden>
      </Button>
    </Row>
  );
}
