import { Clip, Figure, Grid, Heading, Stack, Text } from "@/ui";
import { VERSIONS } from "@/components/projects/car-camping-beds/versions";

/**
 * The four versions, oldest first, in array order — see versions.ts.
 *
 * Reuses the recadvisor timeline's classes rather than copying ChapterList's styles: the
 * two read as the same kind of thing on purpose. It is not ChapterList itself because that
 * renders ISO dates through formatDate, and these are known to the year at best.
 *
 * Headings are level 3 under the enclosing PostSection's level 2.
 */
export function VersionList() {
  return (
    <Stack as="ul" gap={7} className="timeline">
      {VERSIONS.map((version) => (
        <Stack as="li" gap={3} key={version.name}>
          <Stack gap={2}>
            <Text size="xs" tone="subtle" className="timeline__when">
              {version.name} · {version.when}
            </Text>
            <Heading level={3} size={4}>
              {version.title}
            </Heading>
          </Stack>

          {version.paragraphs.map((paragraph, index) => (
            <Text prose key={index}>
              {paragraph}
            </Text>
          ))}

          {version.shots.length === 0 ? null : (
            <Grid gap={4} className="shot-grid">
              {version.shots.map((shot) =>
                shot.poster === undefined ? (
                  <Figure
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    {...(shot.caption === undefined ? {} : { caption: shot.caption })}
                  />
                ) : (
                  <Clip
                    key={shot.src}
                    src={shot.src}
                    poster={shot.poster}
                    alt={shot.alt}
                    caption={shot.caption}
                  />
                ),
              )}
            </Grid>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
