import { Link, Stack, Text } from "@/ui";
import { EXTERNAL } from "@/data/site";
import { StatusNotice } from "@/components/projects/StatusNotice";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";

/**
 * RecAdvisor is not deployed. Everything here describes code that exists and runs
 * locally, and the post says so rather than implying a product you can go and use —
 * the same honesty rule the disaster-response post lives under, applied to a claim
 * about status instead of a claim about a model.
 */

const NOTES = [
  { label: "Backend", value: "Python 3.11, FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL 16" },
  { label: "Frontend", value: "React 19, TypeScript, Vite, React Router" },
  { label: "Auth", value: "Firebase ID tokens, verified server-side" },
  { label: "Scale", value: "~7,500 lines of Python, 388 unit tests" },
  { label: "Status", value: "Runs locally. Not deployed." },
];

export function Post() {
  return (
    <Stack gap={7}>
      <StatusNotice label="Not deployed.">
        This describes a system that runs on my machine and nowhere else. The write-up is
        finished; the product is not, and there is nothing to link you to yet.
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
          RecAdvisor is built around the opposite rule, and most of the interesting decisions
          fall out of it.
        </Text>
      </PostSection>

      <PostSection id="rule" title="The plan never changes on its own">
        <Text size="md" tone="muted" balance>
          New data landing does not alter the plan. Only you do.
        </Text>
        <Text prose>
          A Strava activity arriving does not change it. A calendar event appearing does not
          change it. Saving your profile does not change it. Two things change a committed day,
          and both are someone pressing something: writing an adjustment — plain text, I am
          sore, or I only have thirty minutes — or accepting a prompt to rebuild.
        </Text>
        <Text prose>
          The backend appends exactly one day each night, at the far edge of a rolling
          seven-day window, and leaves every committed day exactly as written. That has an
          awkward consequence I decided to keep: the recommendation you see today may be six
          days old. It would be easy to hide that. Instead the page says when the plan was
          written, because a six-day-old plan you can trust is worth more than a fresh one you
          cannot.
        </Text>
      </PostSection>

      <PostSection id="shape" title="One function, called in a loop">
        <Text prose>
          The first version planned a week at a time — a seven-day snapshot, regenerated whole.
          That forced an all-or-nothing choice on every change, and it meant the database unit
          (a run) never matched the interface unit (a day). Every read had to reassemble one
          from the other.
        </Text>
        <Text prose>
          Moving the unit of planning to the day was the whole fix. There is now one function,
          <Text inline mono>{" recommend_day"}</Text>, and every scenario is that function in a
          loop: the nightly append calls it once, a full rebuild calls it seven times. There is
          no separate week builder to keep in sync with the day builder.
        </Text>
        <Text prose>
          What it is allowed to see is the part I would defend hardest. Behind it: facts and
          commitments — what you actually did, and what is already planned. Ahead of it:
          constraints only. Already-committed days are inputs, so the generator can see what is
          placed and plan around it. It simply cannot rearrange it.
        </Text>
      </PostSection>

      <PostSection id="llm" title="Where the model is, and is not">
        <Text prose>
          The LLM boundary is one protocol, one output schema, one error type, so the API and
          the jobs only ever see a provider interface. The OpenAI implementation uses strict
          structured outputs rather than plain JSON mode — JSON mode only guarantees that the
          response parses, not that it carries the fields you asked for, so the schema declares
          every property required and forbids additional ones.
        </Text>
        <Text prose>
          That is written. It is not wired in. The planning pipeline currently builds
          constraints from your calendar and your adjustment notes and hands them to
          deterministic rules — no model in the path at all. Rather than paper over which one
          produced a given day, every day row records its own source and the API reports it.
          When a plan is built partly by rules and partly by a model, the page says so.
        </Text>
        <Text prose>
          The reason for building the boundary before the implementation is that I want to be
          able to take the model back out. A recommendation I cannot explain is worse than a
          duller one I can.
        </Text>
      </PostSection>

      <PostSection id="parity" title="The old advisor is the test">
        <Text prose>
          RecAdvisor started here, on this site, as a mock. The advice came from{" "}
          <Text inline mono>verdictFor</Text> — a TypeScript function over sample data that
          decided whether a day was ski, train, rest or busy. When the real backend arrived that
          logic had to move to Python, and a rewrite in another language is exactly where
          behaviour quietly changes.
        </Text>
        <Text prose>
          So before deleting the TypeScript, I froze it: 216 cases recorded from the original,
          and a test that holds the Python to them. It does not require the two to agree
          everywhere. It requires every disagreement to be one of three I wrote down and can
          justify — anything else fails the build.
        </Text>
        <Text prose>
          All three come from the same root. In the frontend,{" "}
          <Text inline mono>load</Text> did double duty: it meant both what the plan wants and
          what you are carrying, which is a conflation you can only get away with when the plan
          is fake. A planned rest day used to come out as take the plan: rest. A steady long run
          came out as a rest day, because a moderate load read as fatigue. Once the plan was
          real, the word had to mean one thing.
        </Text>
      </PostSection>

      <PostSection id="split" title="Splitting it off this site">
        <Text prose>
          For a while RecAdvisor and this portfolio were one codebase and one domain. They
          separated once the advisor had a real backend, real auth and real user data, none of
          which belongs behind the same deploy as a static site. A hiring manager reading a
          project write-up and someone planning a ski week want different things from a page,
          and were being served the same bundle.
        </Text>
        <Text prose>
          The split cost this site about 3,300 lines and took roughly a tenth off the
          JavaScript. What it bought was the sample-data machinery going away entirely: with no
          advisor here, no page is left that could claim live conditions, and the switch that
          used to guard against that had nothing to guard.
        </Text>
        <Text prose>
          The two repos deliberately share nothing at build time. A package of shared design
          tokens existed for about a day before I deleted it — the cost was a release process
          standing between a hex code and the site it belongs to, and these two are supposed to
          drift apart rather than stay identical.
        </Text>
      </PostSection>

      <PostSection id="state" title="Where it actually is">
        <Text prose>
          Honestly: not finished. The backend runs locally — Strava sync with deduplication,
          calendar ingestion, the profile, the adjustment flow, the nightly append, and 388
          passing unit tests. The client renders today, the week, the recap and the adjustment
          box against it. The profile, connections and activity views are specified but not
          built, and render a placeholder that says so.
        </Text>
        <Text prose>
          Nothing is deployed. There is no hosted instance to link to, which is why this post
          links to code instead.
        </Text>
        <PostNotes notes={NOTES} />
        <Text prose>
          The backend lives in{" "}
          <Link to={EXTERNAL.githubDataPlatform} external>
            data-platform
          </Link>{" "}
          alongside the schema and the ingestion, written up separately in{" "}
          <Link to="/projects/data-platform">the platform post</Link>.
        </Text>
      </PostSection>
    </Stack>
  );
}
