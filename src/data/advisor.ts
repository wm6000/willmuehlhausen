/**
 * Sample advisor data. The old site kept two separate seven-day lists — one for snow,
 * one for training — and left the reader to reconcile them. Here a day carries snow,
 * calendar and training load together, because the call the advisor makes needs all
 * three at once. Turning a day into a verdict is `verdictFor` in @/lib/advisor.
 *
 * Every value here is illustrative. DATA_SOURCE.kind stays "mock" until it isn't.
 */

export type Load = "low" | "moderate" | "high";

export type AdvisorDay = {
  label: string;
  /** Snow, as it would read on a forecast. */
  conditions: string;
  goodSnow: boolean;
  /** From the calendar: is there room in the day at all. */
  free: boolean;
  /** What the training plan wants, before the snow is taken into account. */
  training: string;
  load: Load;
};

export const WEEK: readonly AdvisorDay[] = [
  {
    label: "Today",
    conditions: "Fresh powder, 11in overnight",
    goodSnow: true,
    free: true,
    training: "Easy 45 min run",
    load: "moderate",
  },
  {
    label: "Tomorrow",
    conditions: "Packed powder",
    goodSnow: true,
    free: false,
    training: "Rest",
    load: "low",
  },
  {
    label: "Wednesday",
    conditions: "Groomed corduroy",
    goodSnow: true,
    free: true,
    training: "Long run — 10-12 mi",
    load: "high",
  },
  {
    label: "Thursday",
    conditions: "Spring slush",
    goodSnow: false,
    free: true,
    training: "Recovery walk or yoga",
    load: "low",
  },
  {
    label: "Friday",
    conditions: "Rain, low visibility",
    goodSnow: false,
    free: false,
    training: "Interval workout",
    load: "high",
  },
  {
    label: "Saturday",
    conditions: "Fresh powder",
    goodSnow: true,
    free: true,
    training: "Easy run",
    load: "low",
  },
  {
    label: "Sunday",
    conditions: "Packed powder",
    goodSnow: true,
    free: false,
    training: "Rest",
    load: "low",
  },
];

/**
 * The week behind you. Rest days are included rather than filtered out, because a week
 * with two rests in it is a different week from one without — and the recap's summary is
 * derived from this list rather than stated alongside it, so the two can't disagree.
 */
export type PastActivity = {
  label: string;
  activity: string;
  /** Zero on a rest day. */
  miles: number;
  effort: Load;
  duration: string;
};

export const RECENT: readonly PastActivity[] = [
  { label: "Yesterday", activity: "Interval workout", miles: 6.1, effort: "high", duration: "48 min" },
  { label: "2 days ago", activity: "Easy run", miles: 4.2, effort: "low", duration: "38 min" },
  { label: "3 days ago", activity: "Rest", miles: 0, effort: "low", duration: "—" },
  { label: "4 days ago", activity: "Long run", miles: 12.4, effort: "moderate", duration: "1 hr 44" },
  { label: "5 days ago", activity: "Strength", miles: 0, effort: "moderate", duration: "35 min" },
  { label: "6 days ago", activity: "Rest", miles: 0, effort: "low", duration: "—" },
];
