import { Stack, Text } from "@/ui";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";
import { StatusNotice } from "@/components/projects/StatusNotice";
import { VersionList } from "@/components/projects/car-camping-beds/VersionList";

/**
 * Four car-camping beds for a Honda Pilot, 2020 onwards, written as a build log like
 * RecAdvisor: each version and what it fixed. The append point is versions.ts.
 *
 * The honesty rule that binds here is version 4: it has been built for a Subaru Outback, not
 * yet for the Pilot, so the StatusNotice and its entry both say so. Change that when it is.
 */

const NOTES = [
  { label: "Vehicle", value: "Honda Pilot" },
  { label: "Versions", value: "4 since 2020" },
  { label: "Frames", value: "Wood (v1); Steel Tek tube with push-in connectors (v2, v3)" },
  { label: "Mattress", value: "Six-inch futon (v3)" },
  { label: "Designed in", value: "Onshape, with 3D-printed parts (v4)" },
  { label: "Status", value: "Version 3 in the Pilot; version 4 built for a Subaru Outback, Pilot build next" },
];

export function Post() {
  return (
    <Stack gap={7}>
      <StatusNotice label="Version 4 isn't in my car yet.">
        It is built for a Subaru Outback, and the Honda Pilot build is next.
      </StatusNotice>

      <PostSection id="intro" title="Four beds in a Honda Pilot">
        <Text prose>
          I built my first car-camping bed in 2020, and I have kept improving on it since. Each
          version took what I learned from living with the last one and built on it — lighter,
          more comfortable, more storage, and more of the car left usable. This is the story of
          four versions, in order, and what each one taught me.
        </Text>
      </PostSection>

      <PostSection id="versions" title="Four versions">
        <VersionList />
      </PostSection>

      <PostSection id="now" title="Where it is now">
        <Text prose>
          Version 3 is still the bed in my car. Version 4 is built for a Subaru Outback and the
          Pilot build is next, and the open problem is the mattress: everything else folds away
          into the trunk, and the mattress has to fold or compress into the frame along with it.
        </Text>
        <PostNotes notes={NOTES} />
      </PostSection>
    </Stack>
  );
}
