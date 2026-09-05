import { Grid, Link, Row, Stack, Text } from "@/ui";
import { COLOPHON, DISCLAIMER, EXTERNAL, NAV, SITE } from "@/data/site";
import { DataSourceChip } from "@/components/system/DataSourceChip";

const SITE_LINKS = [...NAV, { to: "/profile", label: "Profile" }];

const ELSEWHERE = [
  { to: EXTERNAL.github, label: "GitHub" },
  { to: EXTERNAL.linkedin, label: "LinkedIn" },
  { to: EXTERNAL.email, label: "Email" },
  { to: EXTERNAL.githubRepo, label: "Source for this site" },
];

export function SiteFooter() {
  return (
    <Stack as="footer" className="footer">
      <Stack className="footer__inner">
        <Grid gap={6} className="footer__columns">
          <Stack gap={2}>
            <Text weight="semibold">{SITE.name}</Text>
            <Text size="sm" tone="muted">
              {SITE.tagline}
            </Text>
            <Text size="sm" tone="muted">
              {SITE.location}
            </Text>
          </Stack>

          <Stack gap={3}>
            <Text eyebrow>Site</Text>
            <Stack gap={2} as="ul">
              {SITE_LINKS.map((item) => (
                <Stack as="li" key={item.to}>
                  <Link to={item.to} variant="quiet">
                    {item.label}
                  </Link>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack gap={3}>
            <Text eyebrow>Elsewhere</Text>
            <Stack gap={2} as="ul">
              {ELSEWHERE.map((item) => (
                <Stack as="li" key={item.to}>
                  <Link to={item.to} variant="quiet" external>
                    {item.label}
                  </Link>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Row wrap className="footer__bottom">
          <Text inline size="xs" tone="subtle">
            {`© ${new Date().getFullYear()} ${SITE.name}`}
          </Text>
          <Text inline size="xs" tone="subtle" className="footer__sep">
            &middot;
          </Text>
          <DataSourceChip />
          <Text inline size="xs" tone="subtle" className="footer__sep">
            &middot;
          </Text>
          <Text inline size="xs" tone="subtle">
            {DISCLAIMER}
          </Text>
          <Text inline size="xs" tone="subtle" className="footer__sep">
            &middot;
          </Text>
          <Text inline size="xs" tone="subtle">
            {COLOPHON}
          </Text>
        </Row>
      </Stack>
    </Stack>
  );
}
