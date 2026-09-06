/**
 * The sports Strava offers when you log an activity by hand.
 *
 * Two sources. The API enum (SportType, in
 * https://developers.strava.com/swagger/sport_type.json) has 56 values. The manual-activity
 * picker documented at
 * https://support.strava.com/en-us/articles/15402005-supported-sport-types-on-strava
 * shows 52 of them, in the five categories below, and supplies their display names.
 *
 * We carry 55: those 52 plus the three virtual types, which Strava omits from the picker
 * only because they arrive from a trainer or an app rather than being typed in by hand.
 * They are still sports somebody does, and a profile is about what you do rather than how
 * it got recorded. The 56th, PhysicalTherapy, stays out — it isn't a sport.
 *
 * Strava publishes no category for the virtual three, so each sits at the end of its
 * real-world category: a virtual ride is a ride. That grouping is ours, not Strava's.
 *
 * Static for now. Reading a person's actual sports needs OAuth, which needs the backend;
 * when that exists it fills this same shape rather than replacing it, which is why the ids
 * below are Strava's API values verbatim and not something friendlier.
 */

export type SportCategory = "foot" | "cycle" | "water" | "winter" | "other";

/**
 * Which part of the advisor's reasoning a sport feeds. Null means the sport is recorded but
 * the advisor has nothing to say about it — we have snow and training load, and no swell,
 * no wind and no court booking.
 */
export type SportDomain = "snow" | "endurance" | null;

/**
 * The contract each entry below is checked against. Not exported: `Sport` is derived from
 * the array instead, so that a sport carries its literal id rather than a bare string and
 * `sport.id` can be handed straight to anything expecting a SportId.
 */
type SportShape = {
  /** Strava's SportType value, verbatim, so a real sync needs no translation. */
  readonly id: string;
  /** Strava's own display name, which is not always the id. */
  readonly label: string;
  readonly category: SportCategory;
  readonly domain: SportDomain;
};

export const SPORT_CATEGORIES: readonly { id: SportCategory; label: string }[] = [
  { id: "foot", label: "Foot Sports" },
  { id: "cycle", label: "Cycle Sports" },
  { id: "water", label: "Water Sports" },
  { id: "winter", label: "Winter Sports" },
  { id: "other", label: "Other Sports" },
];

/**
 * In Strava's own order, category by category.
 *
 * `as const` keeps the ids as literal types so SportId derives from this rather than being
 * maintained by hand; `satisfies` still checks every entry against SportShape. Neither on its
 * own does both.
 */
export const SPORTS = [
  // Foot Sports
  { id: "Run", label: "Run", category: "foot", domain: "endurance" },
  { id: "Hike", label: "Hike", category: "foot", domain: "endurance" },
  { id: "TrailRun", label: "Trail Run", category: "foot", domain: "endurance" },
  { id: "Wheelchair", label: "Wheelchair", category: "foot", domain: "endurance" },
  { id: "Walk", label: "Walk", category: "foot", domain: "endurance" },
  { id: "VirtualRun", label: "Virtual Run", category: "foot", domain: "endurance" },

  // Cycle Sports
  { id: "Ride", label: "Ride", category: "cycle", domain: "endurance" },
  { id: "EBikeRide", label: "E-Bike Ride", category: "cycle", domain: "endurance" },
  { id: "MountainBikeRide", label: "Mountain Bike Ride", category: "cycle", domain: "endurance" },
  {
    id: "EMountainBikeRide",
    label: "E-Mountain Bike Ride",
    category: "cycle",
    domain: "endurance",
  },
  { id: "GravelRide", label: "Gravel Ride", category: "cycle", domain: "endurance" },
  { id: "Velomobile", label: "Velomobile", category: "cycle", domain: "endurance" },
  { id: "Handcycle", label: "Handcycle", category: "cycle", domain: "endurance" },
  { id: "VirtualRide", label: "Virtual Ride", category: "cycle", domain: "endurance" },

  // Water Sports
  { id: "Canoeing", label: "Canoe", category: "water", domain: "endurance" },
  { id: "StandUpPaddling", label: "Stand Up Paddling", category: "water", domain: "endurance" },
  { id: "Kayaking", label: "Kayak", category: "water", domain: "endurance" },
  { id: "Surfing", label: "Surf", category: "water", domain: null },
  { id: "Kitesurf", label: "Kitesurf", category: "water", domain: null },
  { id: "Swim", label: "Swim", category: "water", domain: "endurance" },
  { id: "Rowing", label: "Rowing", category: "water", domain: "endurance" },
  { id: "Windsurf", label: "Windsurf", category: "water", domain: null },
  { id: "Sail", label: "Sailing", category: "water", domain: null },
  { id: "VirtualRow", label: "Virtual Row", category: "water", domain: "endurance" },

  // Winter Sports. Ice Skate is deliberately not "snow" — it's a rink sport, and has nothing
  // to do with whether there is anything worth chasing in the mountains.
  { id: "IceSkate", label: "Ice Skate", category: "winter", domain: null },
  { id: "NordicSki", label: "Nordic Ski", category: "winter", domain: "snow" },
  { id: "AlpineSki", label: "Alpine Ski", category: "winter", domain: "snow" },
  { id: "Snowboard", label: "Snowboard", category: "winter", domain: "snow" },
  { id: "BackcountrySki", label: "Backcountry Ski", category: "winter", domain: "snow" },
  { id: "Snowshoe", label: "Snowshoe", category: "winter", domain: "snow" },

  // Other Sports
  { id: "Workout", label: "Workout", category: "other", domain: "endurance" },
  { id: "Golf", label: "Golf", category: "other", domain: null },
  { id: "Badminton", label: "Badminton", category: "other", domain: null },
  // Strava's help page spells this "Eliptical". Theirs is the typo.
  { id: "Elliptical", label: "Elliptical", category: "other", domain: "endurance" },
  { id: "Basketball", label: "Basketball", category: "other", domain: null },
  { id: "InlineSkate", label: "Inline Skate", category: "other", domain: "endurance" },
  { id: "Skateboard", label: "Skateboarding", category: "other", domain: null },
  { id: "Tennis", label: "Tennis", category: "other", domain: null },
  { id: "StairStepper", label: "Stair Stepper", category: "other", domain: "endurance" },
  { id: "Padel", label: "Padel", category: "other", domain: null },
  { id: "RockClimbing", label: "Rock Climb", category: "other", domain: null },
  { id: "Soccer", label: "Football (Soccer)", category: "other", domain: null },
  { id: "Pickleball", label: "Pickleball", category: "other", domain: null },
  { id: "WeightTraining", label: "Weight Training", category: "other", domain: "endurance" },
  { id: "Volleyball", label: "Volleyball", category: "other", domain: null },
  { id: "RollerSki", label: "Roller Ski", category: "other", domain: "endurance" },
  { id: "Squash", label: "Squash", category: "other", domain: null },
  { id: "Crossfit", label: "Crossfit", category: "other", domain: "endurance" },
  { id: "Yoga", label: "Yoga", category: "other", domain: null },
  { id: "Dance", label: "Dance", category: "other", domain: null },
  { id: "TableTennis", label: "Table Tennis", category: "other", domain: null },
  { id: "Pilates", label: "Pilates", category: "other", domain: null },
  { id: "Racquetball", label: "Racquetball", category: "other", domain: null },
  {
    id: "HighIntensityIntervalTraining",
    label: "HIIT",
    category: "other",
    domain: "endurance",
  },
  { id: "Cricket", label: "Cricket", category: "other", domain: null },
] as const satisfies readonly SportShape[];

export type Sport = (typeof SPORTS)[number];

/** The 55 ids as a union, derived from SPORTS rather than maintained beside it. */
export type SportId = Sport["id"];

const BY_ID: ReadonlyMap<string, Sport> = new Map(SPORTS.map((sport) => [sport.id, sport]));

/**
 * Storage and, later, the Strava API are untyped input. A saved profile naming a sport that
 * Strava has since renamed should be dropped rather than trusted, which is what this is for.
 */
export function isSportId(value: unknown): value is SportId {
  return typeof value === "string" && BY_ID.has(value);
}

export function sportById(id: SportId): Sport {
  const sport = BY_ID.get(id);
  if (sport === undefined) {
    // Unreachable while SportId derives from SPORTS, and worth saying so loudly if that
    // ever stops being true.
    throw new Error(`No sport with id "${id}", but SportId claims there is one.`);
  }
  return sport;
}

const BY_CATEGORY: Record<SportCategory, readonly Sport[]> = {
  foot: SPORTS.filter((sport) => sport.category === "foot"),
  cycle: SPORTS.filter((sport) => sport.category === "cycle"),
  water: SPORTS.filter((sport) => sport.category === "water"),
  winter: SPORTS.filter((sport) => sport.category === "winter"),
  other: SPORTS.filter((sport) => sport.category === "other"),
};

/** Grouped once at module load, so a consumer can hold the reference across renders. */
export function sportsInCategory(category: SportCategory): readonly Sport[] {
  return BY_CATEGORY[category];
}
