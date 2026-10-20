import { Link, Stack, Text } from "@/ui";
import { StatusNotice } from "@/components/projects/StatusNotice";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";

/**
 * The engineering half of RecAdvisor — schema, ingestion, dedup, credentials. The
 * product half is the recadvisor post; this one deliberately stops where the
 * recommendation logic starts, so neither post has to tell the whole story twice.
 *
 * Same status caveat as that post: this runs locally and is not deployed.
 */

const NOTES = [
  { label: "Database", value: "PostgreSQL 16, five schemas, seventeen tables" },
  { label: "Migrations", value: "Alembic, six revisions" },
  { label: "Stack", value: "Python 3.11, SQLAlchemy 2.0, psycopg 3, httpx, Pydantic v2" },
  { label: "Sources", value: "Strava; Garmin, COROS and Wahoo behind the same interface" },
  { label: "Tests", value: "388 unit tests, plus integration tests against real Postgres" },
  { label: "Status", value: "Runs locally via docker compose. Not deployed." },
];

export function Post() {
  return (
    <Stack gap={7}>
      <StatusNotice label="Not deployed.">
        Local only, and the repository is private. Everything below is code that exists and
        tests that run — none of it is serving anyone.
      </StatusNotice>

      <PostSection id="intro" title="The unglamorous half">
        <Text prose>
          <Link to="/projects/recadvisor">RecAdvisor</Link> is the part you would look at. This
          is the part that decides whether it can say anything true. Most of the work in a
          system that gives you advice is not the advice — it is getting the inputs into a
          shape where reasoning over them is honest.
        </Text>
        <Text prose>
          It is one Postgres database, split into five schemas that say what each table is for:
          core identity and connections, fitness activities, advisor plans and adjustments, ops
          for the machinery, and raw for what providers actually sent. Every schema change is an
          Alembic migration, so the database has a history rather than a current state someone
          arrived at.
        </Text>
      </PostSection>

      <PostSection id="dedup" title="The same run, twice">
        <Text size="md" tone="muted" balance>
          A Garmin watch that auto-syncs to Strava produces one workout and two records.
        </Text>
        <Text prose>
          This is the problem I did not expect to spend real time on. If you wear a Garmin and
          it pushes to Strava, and RecAdvisor reads both, then one run arrives twice. Count both
          and you have doubled the training load the planner reasons from — so it tells you to
          rest on the basis of a week you did not have.
        </Text>
        <Text prose>
          Nothing in the data says the two are the same. The identifiers are different, the
          durations disagree slightly, the start times are a minute or two apart. So matching is
          a judgement: same workout if the sources differ, the starts are within two minutes,
          and the durations are within ten percent — with a two-minute floor, because ten
          percent of a short session is nothing.
        </Text>
        <Text prose>
          Matches are grouped as connected components rather than pairs, which matters more than
          it sounds. If A matches B and B matches C, all three belong together even when A and C
          are just outside tolerance of each other — otherwise which record you compared first
          would decide the answer. Within a group, the richest source wins: device platforms
          carry the full sensor data and Strava is usually receiving a copy, so the order is
          Garmin, COROS, Wahoo, then Strava.
        </Text>
        <Text prose>
          Nothing is deleted. The duplicates stay and point at the canonical row, because the
          rule above is a guess, and a guess you can reverse is worth more than a delete you
          cannot.
        </Text>
      </PostSection>

      <PostSection id="ingestion" title="Getting data in without trusting it">
        <Text prose>
          Activity providers are all slightly different and all behind one interface, so adding
          Garmin later is a new implementation rather than a new code path through the sync.
          Strava is the one that is written.
        </Text>
        <Text prose>
          Webhooks are recorded before they are acted on. Providers retry, and a retried webhook
          must not produce a second copy of the work — so delivery and processing are separate
          rows, and the sync tasks carry a dedupe key derived from the connection and the time
          window rather than from the moment the task was created. Two events about the same
          window collapse into one pull.
        </Text>
        <Text prose>
          Calendars come in as a private iCal URL, which is a credential in disguise: anyone
          holding that link can read the calendar. The URL is stored as ciphertext with the
          hostname kept alongside it in the clear — enough to show which calendar is connected,
          not enough to leak it. OAuth tokens get the same treatment, with state parameters
          stored server-side and expired rather than trusted as round-tripped values.
        </Text>
        <Text prose>
          What comes out of a calendar is narrower still. The advisor needs to know whether
          Thursday evening is free; it does not need to know what you are doing. So the table
          holds busy intervals and nothing else — no titles, no attendees, no locations. The
          restraint is in the schema rather than in the code that reads it, which is the only
          place it is hard to lose later.
        </Text>
      </PostSection>

      <PostSection id="timezones" title="Days are local, and that is a schema decision">
        <Text prose>
          A training day is a local calendar day. A run that starts at eleven at night belongs
          to that evening, not to the next morning in UTC, and an email meant to help you plan
          tomorrow is meaningless if it arrives at the wrong end of your afternoon.
        </Text>
        <Text prose>
          So activities carry both an absolute start time and a local date, and the local date is
          what everything downstream groups by. The timezone itself is learned from a header the
          client sends on every authenticated request, not stored as a setting someone has to
          find — and the consequences of it going missing are severe enough to be worth naming:
          days get computed in UTC, the email switches refuse to turn on, and the nightly job
          skips the user entirely.
        </Text>
      </PostSection>

      <PostSection id="testing" title="What the tests are actually for">
        <Text prose>
          388 unit tests run in about a second, with no database, because the parts worth testing
          hardest are pure: the deduplication election, the verdict rules, the guardrails that
          check a generated plan before it is committed. Anything needing a real Postgres is an
          integration test and says so, and is skipped rather than mocked when there is no
          database to reach.
        </Text>
        <Text prose>
          Import rules are enforced too, so the domain logic cannot quietly grow a dependency on
          the web framework or the database session. That constraint is the reason the rules can
          be tested without either.
        </Text>
        <PostNotes notes={NOTES} />
      </PostSection>

      <PostSection id="state" title="Where it actually is">
        <Text prose>
          Local only. It runs under docker compose against a Postgres container, and there is no
          deployed instance — the hosting shape is specified (Cloud Run, Cloud SQL, scheduled
          jobs) and not built. The repository is private, so the links here go to the public
          write-ups rather than the code.
        </Text>
        <Text prose>
          What works end to end today: connect Strava, sync and deduplicate activities, ingest a
          calendar, save a profile, write an adjustment, and have the nightly append produce a
          day the client can render. What does not: anything that requires it to be running
          somewhere other than my machine.
        </Text>
      </PostSection>
    </Stack>
  );
}
