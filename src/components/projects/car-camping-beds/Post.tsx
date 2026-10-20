import { Stack, Text } from "@/ui";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";
import { StatusNotice } from "@/components/projects/StatusNotice";
import { VersionList } from "@/components/projects/car-camping-beds/VersionList";

/**
 * Four car-camping beds, 2020 onwards, written as a build log like RecAdvisor: why, then
 * each version and what it fixed. The append point is versions.ts.
 *
 * Draft. The facts known so far are that there are four versions, the first was built in
 * 2020, and the latest is documented in Onshape. Everything else is a bracketed
 * placeholder and the StatusNotice says so — see the honesty rules in AGENTS.md.
 */

const NOTES = [
  { label: "Versions", value: "4" },
  { label: "First built", value: "2020" },
  { label: "Designed in", value: "Onshape — version 4 is the best documented" },
  { label: "Vehicle", value: "[Placeholder]" },
  { label: "Materials", value: "[Placeholder]" },
];

export function Post() {
  return (
    <Stack gap={7}>
      <StatusNotice label="Draft.">
        The structure and the dates are real; the prose in square brackets is placeholder,
        and the photos have not been added yet.
      </StatusNotice>

      <PostSection id="why" title="Why build a bed">
        <Text prose>
          I built my first car-camping bed in 2020, and I have built three more since. Each one
          was an answer to something the last one got wrong, so this is written the way it
          happened: four versions, in order, with the mistakes left in.
        </Text>
        <Text prose>
          [Placeholder. What the bed is for — the trips, the vehicle, why sleeping in the car
          rather than a tent — and what a good one has to do.]
        </Text>
      </PostSection>

      <PostSection id="versions" title="Four versions">
        <VersionList />
      </PostSection>

      <PostSection id="now" title="Where it is now">
        <Text prose>
          [Placeholder. What version 4 gets right, what is still on the list for a fifth, and
          how much of the earlier versions was modelled before it was built.]
        </Text>
        <PostNotes notes={NOTES} />
      </PostSection>
    </Stack>
  );
}
