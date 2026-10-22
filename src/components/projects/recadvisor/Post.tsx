import { Figure, Link, Stack, Text } from "@/ui";
import { EXTERNAL } from "@/data/site";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";
import { StatusNotice } from "@/components/projects/StatusNotice";
import { ChapterList } from "@/components/projects/recadvisor/ChapterList";

/**
 * Blog 1: the first post about RecAdvisor, covering everything up to the dev release. A
 * build log rather than an argument — why I wanted it, then every step that got it here,
 * dated from the commit history of the repository each one describes.
 *
 * The append point is a data file — timeline.ts, one object per chapter — so adding to this
 * post never means editing prose in the middle of it. Work after the dev release belongs
 * in a later post rather than at the end of this one.
 *
 * The honesty rule in docs/spec.md binds hardest on the status: it is invite-only on dev,
 * with no production environment, and both source repositories are private, so nothing
 * links to them.
 */

const NOTES = [
  { label: "Backend", value: "Python 3.11, FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 16" },
  { label: "Frontend", value: "React 19, TypeScript, Vite, React Router" },
  { label: "Runs on", value: "Cloud Run and Neon, one image in four roles; Firebase Hosting" },
  { label: "Auth", value: "A code sent by email, or Google. No passwords anywhere" },
  { label: "Backend scale", value: "73 files, ~11,500 lines, 426 unit tests, 12 migrations, 21 tables" },
  { label: "Frontend scale", value: "~9,500 lines, 32 tests across the lib layer" },
  { label: "Status", value: "Live on dev, invite-only. No production environment" },
];

export function Post() {
  return (
    <Stack gap={7}>
      <StatusNotice label="Deployed to dev.">
        RecAdvisor runs at{" "}
        <Link to={EXTERNAL.recadvisorDev} external>
          dev.recadvisor.app
        </Link>{" "}
        with its API on Cloud Run, and it is invite-only — four addresses at the time of
        writing. Signing in will refuse you unless I have added you, so the link is here for
        honesty rather than as an invitation. If you want to look,{" "}
        <Link to={EXTERNAL.email} external>
          email me
        </Link>
        . There is no production environment yet.
      </StatusNotice>

      <PostSection id="why" title="Why I built RecAdvisor">
        <Text prose>
          I wanted a training and recreation planner that adapts to life. It comes from the
          thing that has gone wrong for me with every plan I have followed: it is really hard
          to stick to a strict schedule. Work moves, the weather turns, something starts
          hurting, a trip appears in the calendar. A plan written three weeks ago does not
          know about any of that, and once you have missed a couple of sessions it tends to be
          easier to abandon the plan than to work out what it should have said instead.
        </Text>
        <Text prose>
          So RecAdvisor takes in the things that should matter — what I have actually been
          doing, what my week actually looks like, what I am training for, and whatever is
          currently sore — and uses that information to build a plan for today and the week.
          When something new turns up, it adapts, instead of leaving me to reconcile the plan
          with reality on my own.
        </Text>
        <Text prose>
          I built it for myself first, since I know what I want, but I also wanted it to be
          something other people could sign into and use. Those turn out to be fairly
          different jobs. Something built for one person can assume that person remembers how
          it works, knows which numbers are real, and will forgive it when it is wrong, and
          handing it to a friend takes all three of those away. A good deal of what follows is
          really about that.
        </Text>
        <Text prose>
          This is the first post about it, and it covers everything up to the dev release:
          the steps that got it here, in order, with dates from the commit history rather
          than from memory. I have left in the attempts that went nowhere, since taking them
          out would make the path look a lot straighter than it was.
        </Text>
        <Figure
          src="/recadvisor/page.webp"
          alt="The RecAdvisor app: today's plan in a card at the top with an Easy badge and a line explaining what changed and why, a Change something box underneath it, and the first two days of the week below that with Rest and Recovery badges"
          caption="RecAdvisor as it stands, on the dev deployment. Today, the box for telling it something, and the week underneath."
        />
      </PostSection>

      <PostSection id="timeline" title="How it got here">
        <ChapterList />
      </PostSection>

      <PostSection id="state" title="Where Blog 1 leaves it">
        <Text prose>
          Released to dev, and invite-only. The backend and the client are both deployed, the
          plan revises itself daily against real Strava and calendar data, and the tester
          program is merged and running — so it is ready for people to try, which is the thing I have
          been working towards since March.
        </Text>
        <Text prose>
          Still true that it is early. There is no production environment yet, only the dev
          one, and the client&rsquo;s tests cover its library layer rather than its
          components. Both repositories are private, so there is nothing to link to for the
          code and the write-up is the artefact.
        </Text>
        <Text prose>
          The next stage is people other than me using it, and that is where the next post
          will pick up.
        </Text>
        <PostNotes notes={NOTES} />
      </PostSection>

    </Stack>
  );
}
