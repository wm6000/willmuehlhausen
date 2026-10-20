import { Link, Stack, Text } from "@/ui";
import { EXTERNAL } from "@/data/site";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";
import { ReflectionList } from "@/components/projects/recadvisor/ReflectionList";
import { StatusNotice } from "@/components/projects/StatusNotice";

/**
 * RecAdvisor is deployed to a dev environment and invite-only, which is the one fact
 * this post has to keep straight: everything described below is running, and almost
 * nobody can get to it.
 *
 * The post is a reversal narrative rather than a feature list. It shipped on a rule — the
 * plan never changes on its own — and a month of use broke that rule in three specific
 * ways. Both halves have to be argued properly or the second one means nothing.
 *
 * The honesty rule in docs/spec.md binds hardest on two things here: the tester program
 * is built but unmerged, so it is written as a decision rather than as something in use;
 * and both source repositories are private, so nothing links to them.
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

      <PostSection id="problem" title="The problem with training apps">
        <Text prose>
          Every training app I have used has the same failure. You open it on Tuesday and the
          plan has changed, because you went for a walk on Sunday and something recalculated.
          The number moved. Nothing told you why. Whatever you were going to train against is
          gone, and what replaced it has no more authority than the last one did.
        </Text>
        <Text prose>
          A plan that rewrites itself is not a plan. It is a readout. You cannot commit to a
          readout, and committing is the entire point — the value of a training week is that
          you decided something in advance and then did it.
        </Text>
        <Text prose>
          So I built the opposite. Then I used it for a month, and had to take most of it
          back. That is what this post is about.
        </Text>
      </PostSection>

      <PostSection id="rule" title="The rule it shipped with">
        <Text prose>
          The first version had one rule, and I meant it absolutely: the plan never changes on
          its own. A Strava activity arriving did not change it. A calendar event appearing did
          not change it. Saving your profile did not change it. Two things could change a
          committed day, and both were someone pressing something — writing an adjustment in
          plain text, or accepting a prompt to rebuild.
        </Text>
        <Text prose>
          The backend appended exactly one day each night, at the far edge of a rolling
          seven-day window, and left every committed day exactly as written. That had an
          awkward consequence, and at the time I was proud of keeping it. Here is what I wrote
          in the first draft of this very post:
        </Text>
        <Text size="md" tone="muted" balance>
          &ldquo;The recommendation you see today may be six days old. It would be easy to hide
          that. Instead the page says when the plan was written, because a six-day-old plan you
          can trust is worth more than a fresh one you cannot.&rdquo;
        </Text>
        <Text prose>
          I still think the second sentence is right. The first one turned out to be describing
          a bug.
        </Text>
      </PostSection>

      <PostSection id="broke" title="A few weeks of real use">
        <Text prose>
          Using your own software is different from designing it. Three things went wrong, and
          none of them were the thing I had been defending against.
        </Text>
        <Text prose>
          <Text inline weight="medium">
            It went stale in a way that felt like neglect, not stability.
          </Text>{" "}
          A six-day-old plan is trustworthy in the sense that it has not moved. It is also, by
          Saturday, a document written by someone who did not know what your week turned into.
          Trust was never the thing at risk.
        </Text>
        <Text prose>
          <Text inline weight="medium">
            It was blind to the two things that most obviously matter.
          </Text>{" "}
          I skipped a long run. The plan did not notice, and kept building on the assumption
          that I had done it. I added a trip. The plan did not notice that either. The rule I
          had written to stop the plan reacting to noise was also stopping it reacting to news.
        </Text>
        <Text prose>
          <Text inline weight="medium">
            One day at a time does not produce a week.
          </Text>{" "}
          Appending a single day each night meant each new day was planned without being able
          to change anything around it. The result read as disconnected from the rest of the
          week, because it was: it had to take six days as given and fit itself into the gap.
        </Text>
        <Text prose>
          The rule was not wrong about everything. It was wrong about where the line went. I had
          drawn it at &ldquo;nothing may change the plan&rdquo;, when what I actually wanted was
          &ldquo;nothing may change the plan without telling you why&rdquo;.
        </Text>
      </PostSection>

      <PostSection id="revise" title="Revise, don&rsquo;t rewrite">
        <Text prose>
          The replacement is narrower rather than absent. The plan now revises itself when
          something real has changed — but the model is handed the current plan plus what
          changed, and returns only the days that should be different. Everything it does not
          mention stays exactly as it was.
        </Text>
        <Text prose>
          That is the part that keeps the original promise. A plan that recalculates is a
          readout; a plan where Thursday changed and Friday did not is still a plan, and you can
          see which is which.
        </Text>
        <Text prose>
          Two weeks are planned and one is shown. The hidden week is what lets this week&rsquo;s
          choices see a race or a trip coming — the old one-day-at-a-time append had no way to
          know what it was building towards. It also fixed something subtler: a database whose
          unit is a day now matches an interface whose unit is a day card, so no read has to
          reassemble one from the other.
        </Text>
        <Text prose>
          And today is frozen from six in the morning. Not by asking the model nicely — by
          filtering what it is allowed to touch, so a held day stays held whatever comes back.
          The reason is that the morning email and the app have to agree about today. If you
          read your plan over breakfast and the page disagrees with it by lunchtime, nothing
          else about the system matters.
        </Text>
      </PostSection>

      <PostSection id="notes" title="A change you can see the reason for">
        <Text prose>
          Every changed day carries a sentence saying why it changed, written at the same time
          as the change. The day shows an{" "}
          <Text inline mono>
            Updated
          </Text>{" "}
          marker and a line underneath it — the shape is &ldquo;updated, because&hellip;&rdquo;.
          This is where the original rule&rsquo;s intent survives: the thing I actually hated
          about other apps was never that the plan moved, it was that it moved silently.
        </Text>
        <Text prose>
          Nothing is ever deleted. Every version of every day is kept, and you can restore a
          single day or a whole earlier week. That makes the revision safe to accept rather than
          something to brace for: the version you left is in the same list, one pick away.
        </Text>
      </PostSection>

      <PostSection id="news" title="What counts as news">
        <Text prose>
          Six things count: an activity arriving or being deleted, a profile edit, a calendar
          change, a finished history backfill, a connection going away, and a planned day that
          came and went with nothing recorded against it. Anything else is not news and the plan
          does not move.
        </Text>
        <Text prose>
          Events are batched for five minutes before a revision runs. That number is not
          arbitrary — it is long enough for an upload and the title edit that follows it to land
          in the same revision, and short enough that the plan still answers the same session.
        </Text>
        <Text prose>
          The decision I like most here is the least technical. The events are English
          sentences, not structured payloads:{" "}
          <Text inline mono>
            An activity from 2026-10-14 was deleted at strava.
          </Text>{" "}
          They are written to be read by the model, because the thing downstream of them is a
          language model and a tidy enum would have to be translated back into a sentence
          anyway. They say why something happened; the revision reads current state for what
          actually is.
        </Text>
        <Text prose>
          Revisions run as queued tasks rather than inside the request that caused them, which
          is a constraint imposed from outside: Strava wants its webhook answered within two
          seconds, and planning takes tens of seconds.
        </Text>
      </PostSection>

      <PostSection id="llm" title="The model moved to the other side of the line">
        <Text prose>
          The first design had a language model produce constraints — what the week looked like,
          what was available — and deterministic rules build the actual sessions inside them.
          I wrote the boundary for it and never wired it up.
        </Text>
        <Text prose>
          It is now the other way round. The model writes the plan; the rules only check it
          afterwards. That is a bigger concession than it sounds, and I made it because the rules
          were good at respecting a constraint and bad at the thing a coach actually does, which
          is deciding that this week should look different from last week.
        </Text>
        <Text prose>
          The checks that remain correct rather than reject. A day that breaks a rule gets
          trimmed — too many hard days in a rolling week, back-to-back high load, a session
          longer than the calendar allows — and the reason is recorded in the day&rsquo;s notes.
          Returning nothing helps nobody at six in the morning.
        </Text>
        <Text prose>
          Choosing the model was the first thing on this project I did with a measurement instead
          of an opinion. There is a scenario harness — seven invented athletes, eighteen
          assertions, built with the same code production uses, and a guardrail correction counts
          as a failure rather than a save. The model I settled on passed all eighteen where the
          cheaper one I started with passed sixteen, at the same cost and about nineteen seconds
          a plan. Raising its reasoning effort got nothing except forty-five seconds.
        </Text>
        <Text prose>
          The deterministic planner is still there and still tested, as the fallback when the
          model is unavailable or returns something unusable. I want to be able to take the model
          back out. A recommendation I cannot explain is worse than a duller one I can.
        </Text>
      </PostSection>

      <PostSection id="dedup" title="The same run, twice">
        <Text size="md" tone="muted" balance>
          A Garmin watch that auto-syncs to Strava produces one workout and two records.
        </Text>
        <Text prose>
          This is the problem I did not expect to spend real time on. If you wear a Garmin and it
          pushes to Strava, and RecAdvisor reads both, then one run arrives twice. Count both and
          you have doubled the training load the planner reasons from — so it tells you to rest
          on the basis of a week you did not have.
        </Text>
        <Text prose>
          Nothing in the data says the two are the same. The identifiers differ, the durations
          disagree slightly, the start times are a minute or two apart. So matching is a
          judgement: same workout if the sources differ, the starts are within two minutes, and
          the durations are within ten percent — with a two-minute floor, because ten percent of
          a short session is nothing.
        </Text>
        <Text prose>
          Matches are grouped as connected components rather than pairs, which matters more than
          it sounds. If A matches B and B matches C, all three belong together even when A and C
          are just outside tolerance of each other — otherwise which record you compared first
          would decide the answer. Within a group the richest source wins: device platforms carry
          the full sensor data and Strava is usually receiving a copy.
        </Text>
        <Text prose>
          Nothing is deleted. The duplicates stay and point at the canonical row, because the
          rule above is a guess, and a guess you can reverse is worth more than a delete you
          cannot.
        </Text>
      </PostSection>

      <PostSection id="underneath" title="What the data has to do first">
        <Text prose>
          A system that gives advice spends most of its effort before the advice: getting the
          inputs into a shape where reasoning over them is honest. Three decisions there are
          worth naming.
        </Text>
        <Text prose>
          A training day is a local calendar day. A run that starts at eleven at night belongs to
          that evening, not to the next morning in UTC, and an email meant to help you plan
          tomorrow is useless if it arrives at the wrong end of your afternoon. So activities
          carry both an absolute start time and a local date, and the local date is what
          everything downstream groups by.
        </Text>
        <Text prose>
          A calendar feed URL is a credential in disguise — anyone holding that link can read the
          calendar — so it is stored as ciphertext with only the hostname kept in the clear,
          enough to show which calendar is connected and not enough to leak it.
        </Text>
        <Text prose>
          What comes out of a calendar is narrower still. The advisor needs to know whether
          Thursday evening is free; it does not need to know what you are doing. The table holds
          busy intervals and nothing else — no titles, no attendees, no locations. The restraint
          is in the schema rather than in the code that reads it, which is the only place it is
          hard to lose later.
        </Text>
      </PostSection>

      <PostSection id="shipping" title="Getting it in front of someone">
        <Text prose>
          For a while RecAdvisor and this portfolio were one codebase and one domain. Splitting
          them looked fussy at the time and now looks obvious: a static write-up and a service
          holding other people&rsquo;s training data have nothing in common at deploy time.
        </Text>
        <Text prose>
          It is one Docker image that runs in four roles — the API, a worker, and two scheduled
          jobs — because a release that ships the API and the jobs separately can run them on two
          different versions of the code. Postgres is a managed database on a free tier rather
          than Google&rsquo;s own, which would have been close to the entire bill at this size.
          Deploys authenticate by federated identity with no key files anywhere, and the
          migration job runs to completion before the API rolls out, so the schema is never
          behind the code reading it. Continuous integration runs the whole suite, including the
          integration tests, against a real Postgres on every merge.
        </Text>
        <Text prose>
          There are no passwords. Signing in means a six-digit code sent to your email, or
          Google; the code is exchanged for a session token server-side. Signing up and signing
          in are the same action, and the request answers identically whether or not the address
          already has an account, so it cannot be used to find out who has one.
        </Text>
        <Text prose>
          Then it refuses almost everyone. The invite check happens before the account row is
          created, so an address I have not added never gets one — there is no half-existing user
          to clean up later. Four addresses are on the list.
        </Text>
      </PostSection>

      <PostSection id="careful" title="Asking people to be careful with my software">
        <Text prose>
          Handing something to family is different from deploying it. They will not file a bug;
          they will quietly stop using it. So the next piece of work is a tester program, and the
          part I spent longest on was consent.
        </Text>
        <Text prose>
          It is a screen you have to agree to, and it lists what is recorded in plain sentences:
          which steps you reach, anything that goes wrong and how long pages take, and what the
          app does with your plan. Diagnostics are an allow-list — an event kind that is not on
          it is dropped rather than stored — and the uploads are marked so they can never
          redirect you, sign you out, or report themselves as a failure. The admin view answers
          404 rather than 403 to anyone who is not me, because 403 confirms a thing exists.
        </Text>
        <Text prose>
          That is written and not yet shipped: it sits on a branch, unmerged, so nobody is being
          observed by it today. I am describing a decision, not a running feature.
        </Text>
      </PostSection>

      <PostSection id="parity" title="The old advisor is still the test">
        <Text prose>
          RecAdvisor started on this site, as a mock. The advice came from{" "}
          <Text inline mono>
            verdictFor
          </Text>
          , a TypeScript function over sample data that decided whether a day was ski, train,
          rest or busy. Before deleting it I froze its behaviour: 216 recorded cases, and a test
          that holds the Python to them.
        </Text>
        <Text prose>
          It does not require the two to agree everywhere. It requires every disagreement to be
          one of three I wrote down and can justify — anything else fails the build. All three
          trace to the same root: in the frontend,{" "}
          <Text inline mono>
            load
          </Text>{" "}
          meant both what the plan wants and what you are carrying, a conflation you can only get
          away with while the plan is fake.
        </Text>
        <Text prose>
          That fixture has now survived two reversals of the thing it tests. It is the oldest
          code in the project and the only part written for this portfolio that is still running.
        </Text>
      </PostSection>

      <PostSection id="state" title="Where it actually is">
        <Text prose>
          Live on dev, invite-only, and genuinely used by one person. The backend and the client
          are both deployed and the plan revises itself daily against real Strava and calendar
          data. What is not true yet: there is no production environment, the tester program is
          unmerged, and the client&rsquo;s tests cover its library layer rather than its
          components.
        </Text>
        <Text prose>
          Both repositories are private, so there is nothing to link to for the code. The write-up
          is the artefact.
        </Text>
        <PostNotes notes={NOTES} />
      </PostSection>

      <PostSection id="reflections" title="What friends and family said">
        <ReflectionList />
      </PostSection>
    </Stack>
  );
}
