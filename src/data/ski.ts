/**
 * Ski locations, ported from the old site. Sample data — every blurb, pass and
 * coordinate here is illustrative, which is why DATA_SOURCE.kind still says "mock".
 */

export type SkiType = "resort" | "backcountry" | "nordic";

export type SkiLocation = {
  name: string;
  type: SkiType;
  pass: string;
  lat: number;
  lng: number;
  blurb: string;
};

export const CITIES = ["Seattle", "Portland", "Spokane", "Tacoma", "Bend"] as const;
export type City = (typeof CITIES)[number];

export const SKI_TYPES: readonly { value: SkiType; label: string }[] = [
  { value: "resort", label: "Resort" },
  { value: "backcountry", label: "Backcountry" },
  { value: "nordic", label: "Nordic" },
];

export const PASSES = ["Any pass", "Ikon", "Epic", "Indy", "Mountain Collective", "Independent"] as const;

export const SKI_LOCATIONS_BY_CITY: Record<City, readonly SkiLocation[]> = {
  Seattle: [
    {
      name: "Crystal Mountain",
      type: "resort",
      pass: "Ikon",
      lat: 46.9348,
      lng: -121.474,
      blurb: "The largest resort in the state, with wide-open bowls and a gondola.",
    },
    {
      name: "Alpental Backcountry",
      type: "backcountry",
      pass: "Independent",
      lat: 47.4394,
      lng: -121.4258,
      blurb: "Steep, avalanche-terrain access right off the Snoqualmie Pass parking lot.",
    },
    {
      name: "Stevens Pass Nordic Center",
      type: "nordic",
      pass: "Epic",
      lat: 47.7448,
      lng: -121.089,
      blurb: "Groomed cross-country trails through old-growth forest.",
    },
  ],
  Portland: [
    {
      name: "Mt. Hood Meadows",
      type: "resort",
      pass: "Ikon",
      lat: 45.3311,
      lng: -121.6656,
      blurb: "Mt. Hood's biggest resort, with terrain for every level.",
    },
    {
      name: "Cooper Spur Backcountry",
      type: "backcountry",
      pass: "Independent",
      lat: 45.4017,
      lng: -121.6437,
      blurb: "Quiet north-side touring under the Eliot Glacier.",
    },
    {
      name: "Teacup Lake Nordic",
      type: "nordic",
      pass: "Independent",
      lat: 45.2939,
      lng: -121.6478,
      blurb: "Volunteer-groomed classic and skate trails near Government Camp.",
    },
  ],
  Spokane: [
    {
      name: "Mt. Spokane",
      type: "resort",
      pass: "Indy",
      lat: 47.9219,
      lng: -117.1108,
      blurb: "Night skiing twenty minutes from town, with a quiet back side.",
    },
    {
      name: "Silver Mountain Sidecountry",
      type: "backcountry",
      pass: "Indy",
      lat: 47.5424,
      lng: -116.1279,
      blurb: "Gondola-served terrain that opens onto long, low-angle trees.",
    },
    {
      name: "Sherman Pass Nordic",
      type: "nordic",
      pass: "Independent",
      lat: 48.6017,
      lng: -118.4642,
      blurb: "High, dry and empty — the driest snow in the state.",
    },
  ],
  Tacoma: [
    {
      name: "Crystal Mountain",
      type: "resort",
      pass: "Ikon",
      lat: 46.9348,
      lng: -121.474,
      blurb: "The largest resort in the state, with wide-open bowls and a gondola.",
    },
    {
      name: "Paradise, Mt. Rainier",
      type: "backcountry",
      pass: "Independent",
      lat: 46.7859,
      lng: -121.7355,
      blurb: "Rolling volcano terrain that holds spring corn well into June.",
    },
    {
      name: "Mt. Tahoma Trails",
      type: "nordic",
      pass: "Independent",
      lat: 46.7833,
      lng: -122.0167,
      blurb: "A hut-to-hut trail system on the mountain's quiet south-west side.",
    },
  ],
  Bend: [
    {
      name: "Mt. Bachelor",
      type: "resort",
      pass: "Ikon",
      lat: 43.9793,
      lng: -121.6884,
      blurb: "A whole volcano, lift-served from every aspect.",
    },
    {
      name: "Tumalo Mountain",
      type: "backcountry",
      pass: "Independent",
      lat: 43.9908,
      lng: -121.6494,
      blurb: "A short, reliable skin straight across the road from Bachelor.",
    },
    {
      name: "Meissner Sno-park",
      type: "nordic",
      pass: "Independent",
      lat: 43.9603,
      lng: -121.5836,
      blurb: "Forty kilometres of nightly-groomed trails, run by volunteers.",
    },
  ],
};
