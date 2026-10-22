/**
 * The four beds, oldest first.
 *
 * Same shape as the RecAdvisor timeline, for the same reason: the post is a build log, so
 * a new version is one object at the END of this array and never an edit to prose in the
 * middle of Post.tsx. Rendered in array order, not sorted.
 *
 * `when` is a plain string rather than an ISO date because these are known to the year at
 * best, and formatDate would render "2020-01-01" as January 1, 2020 — a precision nobody
 * has. Write what is actually known; a bracketed placeholder beats a guessed year. The
 * years for versions 2 and 3 are the dates of their earliest photos.
 *
 * Version 4 has been built for a smaller car and not yet for the Pilot. Its entry says so,
 * and must keep saying so until it is in the Pilot.
 */

export type Shot = {
  /**
   * Under public/car-camping-beds/<version>/, referenced by absolute path so it's fetched,
   * not bundled. A webp photo, or a muted MP4 when `poster` is set.
   */
  src: string;
  alt: string;
  caption?: string | undefined;
  /** Present only for a clip: the still shown before it plays. */
  poster?: string | undefined;
};

const v = (version: string, file: string) => `/car-camping-beds/${version}/${file}`;

export type Version = {
  name: string;
  when: string;
  title: string;
  paragraphs: readonly string[];
  shots: readonly Shot[];
};

export const VERSIONS: readonly Version[] = [
  {
    name: "Version 1",
    when: "2020",
    title: "A wooden platform on the folded seats",
    paragraphs: [
      "The first one was a wooden platform that sat on top of the folded-down seats. It was super heavy, and once it was in I found it was too high — lying on it put me too close to the ceiling. So I cut the legs down a little and lowered it.",
      "After that it worked great for about a year, and the space underneath held my gear. It proved the idea, and living with it showed me what to improve next: less weight, and a smarter use of the space.",
    ],
    shots: [
      {
        src: v("v1", "20201115_221922.webp"),
        alt: "A sheet of plywood propped on a yellow stand in the cargo area of a silver SUV, with the hatch open",
        caption: "November 2020: test-fitting the first sheet of plywood.",
      },
      {
        src: v("v1", "20201125_215626.webp"),
        alt: "A wooden platform on wooden legs in the back of the SUV, with water jugs and a toolbox on the floor underneath it",
        caption: "The platform on its legs, with room underneath for gear.",
      },
      {
        src: v("v1", "20201203_210854.webp"),
        alt: "The wooden platform as two panels spanning the back of the SUV, with skis and a water bottle stored underneath",
        caption: "December 2020: two panels across the back, skis underneath.",
      },
      {
        src: v("v1", "20201227_151406.webp"),
        alt: "A person in ski goggles sitting on the open tailgate of the SUV in a snowy parking lot, the platform visible behind them with gear stowed underneath",
        caption: "Out in the snow that winter.",
      },
    ],
  },
  {
    name: "Version 2",
    when: "2022",
    title: "A steel frame that folded out of the way",
    paragraphs: [
      "For the second version I found Steel Tek structural tubing at Lowe's. Its connectors push into the ends of the tubes and hold by friction, so I could cut tubes to length with an angle grinder and build a steel frame without welding anything. I pulled all the seats out of the back of the car and bolted the frame into the seat mounting holes.",
      "The frame sat on the driver side and folded or slid out to extend across the whole width. The idea was that I could fold it back into the driver side and use the other half of the car as space to move around in — to sit up, get changed and so on.",
      "It worked, and it taught me two things. My Honda Pilot is too small to really move around in, so the open half got less use than I'd planned. And a bed that folds needs segmented foam, which is less comfortable than one solid mattress. Both lessons went straight into version 3.",
    ],
    shots: [
      {
        src: v("v2", "20220130_210745.webp"),
        alt: "Foam mattress segments on the bed in the back of the SUV at night, one segment folded up on its edge",
        caption: "The foam had to be cut into segments so the bed could fold, which is what made it less comfortable.",
      },
      {
        src: v("v2", "20220525_201423.webp"),
        alt: "Plywood deck panels laid out on metal legs in the back of the SUV, with a drill, a straightedge and drill bits around them",
        caption: "May 2022: cutting and fitting the plywood deck.",
      },
      {
        src: v("v2", "20230928_182527.webp"),
        alt: "A frame of galvanised steel tube and push-in connectors along the driver side of the SUV, its feet bolted to the floor, with a drawer slide lying on the carpet beside it",
        caption: "The bare frame on the driver side: Steel Tek tube, push-in connectors, and feet bolted into the seat mounts.",
      },
      {
        src: v("v2", "20230930_055918.webp"),
        alt: "The steel tube frame running along one side of the SUV's interior, with a bench seat still in place on the other side",
        caption: "The frame along one side, with the other half of the car left free.",
      },
    ],
  },
  {
    name: "Version 3",
    when: "2023",
    title: "The whole back as one bed",
    paragraphs: [
      "Version 3 is the best version by far. It is the same steel tubing, but this time the frame covers the whole back of the car, and the whole back is one six-inch-thick futon mattress — the most comfortable of any version.",
      "The frame has two sections that pivot up from the middle of the car, along its length. On either side I can lift the mattress and the board under it to reach the storage underneath, which gives it the most storage, and the easiest to get at, of any version. It also leaves the far back passenger seat usable, so in a pinch the car still seats three. It has been in my car for the last few years.",
    ],
    shots: [
      {
        src: v("v3", "20231026_214616.webp"),
        alt: "A steel tube frame spanning the whole cargo area of the SUV, with one plywood panel laid across it and connectors and a screwdriver on the floor",
        caption: "October 2023: the frame now spans the whole back, with the first panel on.",
      },
      {
        src: v("v3", "20231104_170046.webp"),
        alt: "Two plywood panels covering the whole back of the SUV, joined by a hinge running down the middle of the car",
        caption: "Both panels on, hinged along the middle of the car.",
      },
      {
        src: v("v3", "20231104_170134.mp4"),
        poster: v("v3", "20231104_170134-poster.webp"),
        alt: "Video: one plywood panel of the bed being lifted up from the middle of the car, showing gear stored on the floor underneath",
        caption: "Lifting one half to get at the storage underneath.",
      },
      {
        src: v("v3", "20231129_202027.mp4"),
        poster: v("v3", "20231129_202027-poster.webp"),
        alt: "Video, at night: a hand lifting a plywood panel of the bed to show folding chairs and bags stored on the floor beneath the frame, then lowering it",
        caption: "The same at night, with the gear stowed underneath.",
      },
    ],
  },
  {
    name: "Version 4",
    when: "Built for a smaller car; Pilot build next",
    title: "A bed that folds back into the trunk",
    paragraphs: [
      "Version 3 has served me well, and the next step is getting the whole car back: with it in, the car seats three at most. So version 4 is designed to fold up completely into the trunk. Stowed, I have my regular seats in the middle and back rows; when I'm going camping, I unfold the mechanism and the bed is ready to sleep on.",
      "It is the first version fully modelled in Onshape before it was built, and the first to use 3D-printed parts. I have built it for a smaller car first. Next I'm building it for my own car. The part I haven't figured out yet is the mattress: this design needs one that can fold or compress into the frame when it is stowed.",
    ],
    shots: [
      {
        src: v("v4", "20260602_115703.webp"),
        alt: "A low rectangular frame of metal tube with round connectors and black hinge blocks, standing on a garage floor next to a drill",
        caption: "June 2026: the start of the version 4 frame.",
      },
      {
        src: v("v4", "20260609_130205.webp"),
        alt: "The version 4 bed unfolded on the garage floor: hinged plywood panels on the tube frame, one end resting on a leg and the other on wooden blocks",
        caption: "Unfolded, with the plywood deck hinged between panels.",
      },
      {
        src: v("v4", "20260609_135233.webp"),
        alt: "The version 4 bed partway folded on the garage floor, a section of tube frame and plywood swung up over the rest",
        caption: "Partway through folding up.",
      },
    ],
  },
];
