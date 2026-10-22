/**
 * How RecAdvisor got here, oldest first.
 *
 * Appending a chapter is the only edit this file should need: add an object at the END of
 * the array, and bump `updated` on the recadvisor entry in @/data/projects. The list
 * renders in array order, so the newest work reads last — the way a build log is written
 * rather than the way a blog index is.
 *
 * Every `date` is taken from the commit history of the repository it describes, not from
 * memory. The first chapter is the prototype in OneDrive/Documents/04_AI_Fitness_Assistant,
 * which has its own git history and does not live in the code directory with everything
 * else.
 *
 * Keep chapters to two or three paragraphs. The whole point is that somebody can skim the
 * dates and stop where they are interested, and that stops working once each entry is an
 * essay.
 *
 * `paragraphs` are plain strings for the same reason the reflections are: rule 3 keeps raw
 * DOM tags inside src/ui, and a .ts file holding JSX would be a way around that rather
 * than a reason it does not apply.
 */

export type Chapter = {
  /** ISO. Rendered through formatDate, or as a range when `until` is set. */
  date: string;
  /** For a chapter that covers a stretch rather than a day. */
  until?: string | undefined;
  title: string;
  paragraphs: readonly string[];
  /**
   * An optional screenshot for the chapter, shown after its prose.
   *
   * Images live in public/recadvisor/ and are referenced by absolute path, so they are
   * fetched rather than bundled. `alt` describes the image and is not optional: a caption
   * is read as well as the alt text, not instead of it.
   */
  shot?:
    | {
        src: string;
        alt: string;
        caption?: string | undefined;
      }
    | undefined;
};

export const TIMELINE: readonly Chapter[] = [
  {
    date: "2026-03-21",
    until: "2026-04-08",
    title: "A daily email run with a script",
    paragraphs: [
      "I started with a Python script that emailed me a plan every morning at seven, and again on Monday mornings for the week ahead. It read my Strava history, my calendar and the weather, along with a markdown file where I kept my goals and the things a coach would want to know about me, and sent all of that to OpenAI.",
      "Two ideas from it have not changed since. The first is that the context about me belongs in a file I can edit, because my goals and my injuries change far more often than the code does. The second is that my own Strava titles are the most useful signal in the whole system — when I write easy run, legs still heavy, that is me telling the planner how I actually feel, and it goes straight into the prompt.",
      "What the script could not do was be used by anybody but me. It needed my credentials in a local file, my Python environment, and a machine that stayed on, and there was nothing to look at in between emails. I wanted something running on a cloud service that other people could sign into, and closing that gap is what everything since has been about.",
    ],
  },
  {
    date: "2026-07-09",
    title: "I built a project plan, and it slowed me down",
    paragraphs: [
      "When I picked the idea back up I decided to run it like a real engineering project. I set up a GitHub project board, wrote architecture documentation and worked out a phased plan: a shared API gateway in the middle, a fitness platform on one side and a ski advisor platform on the other, each in its own repository.",
      "Working through it with Claude, things were getting written, but after a week or so I noticed how slow the progress was — and that the structure meant to keep me organised was what was slowing me down. I had settled how five components would talk to each other before anything produced a single piece of advice, so every question became a question about the plan rather than about the product. Two of those repositories still exist, and I never pushed to either of them again.",
    ],
  },
  {
    date: "2026-08-04",
    until: "2026-08-21",
    title: "One recreation advisor and one ski advisor",
    paragraphs: [
      "The next attempt was a portfolio site in Next.js, and it got as far as two separate advisors side by side: a fitness dashboard and a ski dashboard, each its own section of the site, each producing its own seven-day list.",
      "Building it is what showed me the split was wrong. Recreation as a whole is the thing I want to address, and dividing it in two meant neither advisor could see the week I was really having — which left me reconciling two lists in my head, the exact work I had been hoping to hand off. So I decided to treat recreation as one problem and leave the detailed skiing analysis for later. None of that site was deployed; by then I had started a second site before finishing the first, so neither was live.",
    ],
  },
  {
    date: "2026-09-05",
    title: "Starting over, and getting further in a day than in a month",
    paragraphs: [
      "I started again, beginning with documents written alongside Claude rather than diagrams — what the thing is, what each page owes the person reading it, and the rules that were not allowed to bend. In a day I had the whole portfolio standing up: the shell, a mock sign-in, the projects blog, a profile carrying the full Strava sport catalogue, and the advisor running on sample data.",
      "It went faster than the month before because, before, I had been working through each task very specifically in GitHub alongside Claude. That is a good practice, but I can get a similar result in a tenth of the time by outlining the project in documentation and having Claude do the work. That is how I have worked since.",
      "One more useful thing I worked out was that the advisor needed to be its own app. What I had been building, across three attempts, was a suite of tools bolted onto my personal website, which was difficult to present without it being confusing.",
    ],
  },
  {
    date: "2026-09-06",
    title: "Taking things out",
    paragraphs: [
      "The advisor still had a ski section: a city and pass picker, a ranked list of ski areas and a map. I took all of it out, along with the mapping dependency, because the profile had grown into fifty-five rankable sports and next to that a hard-coded list of Pacific Northwest resorts read as furniture bolted onto something much more general.",
      "It left behind a rule I still like. A sport you have not ranked is gone rather than hidden, so if you rank no snow sports there is no ski verdict, no mountains on the page, and no mention of the snow in the reasoning either — telling a runner about fresh powder is the same mistake as showing them a ski section. The same day I cut the advisor down to three things: what to do today, a recap of the week behind me, and the seven days ahead.",
    ],
  },
  {
    date: "2026-09-12",
    title: "A name, a domain, and nothing real behind it",
    paragraphs: [
      "The portfolio went live at willmuehlhausen.com, published by GitHub Actions on every push, and the advisor got its name. Calling it RecAdvisor was part of deciding what it was: a recreation advisor rather than a fitness tracker, and something in its own right rather than one more page on my site.",
      "Everything it displayed was still sample data, and a single switch in the code made the whole site say so, with a chip in the footer and a banner on any page showing numbers. No page was allowed to claim real conditions while that switch said mock.",
    ],
  },
  {
    date: "2026-09-16",
    until: "2026-09-22",
    title: "A backend that actually reads your training",
    paragraphs: [
      "This is where it stopped being a mock: Python, FastAPI and Postgres, with Strava sync, profiles, and the daily verdict logic moved out of the browser and onto a server.",
      "This part is really important to me. I wanted a backend that could work with any frontend, so that in the future I can build an Android app that works with the same backend seamlessly.",
    ],
  },
  {
    date: "2026-10-08",
    title: "Sessions with structure, and a history you can go back through",
    paragraphs: [
      "A plan stopped being a sentence per day and became structured sessions: a sport, a kind, a duration, a load, and the details that belong to that sport — intervals with their steps, lifts with sets and reps, distances where a distance means something. Calendars got access levels at the same time, and the table holds busy intervals and nothing else: no titles, no attendees, no locations. The advisor needs to know whether Thursday evening is free, not what I am doing with it.",
      "Plan history arrived here too, and it is a feature I felt was important. Every version of every day is kept and any of them can be restored, so nothing is ever deleted. That lets a user change their plan comfortably, without fear of losing previous versions.",
    ],
    shot: {
      src: "/recadvisor/today.webp",
      alt: "Today's plan in RecAdvisor: an Easy badge, the title Easy Local Trail Hike, a line beginning Updated explaining that the rationale was corrected, the reason underneath, and a session card showing Hike, Morning, one hour thirty minutes at easy effort and low load",
      caption: "Today, in the deployed app. The session carries its sport, slot, duration and load; the line under the title is the plan saying what it changed and why.",
    },
  },
  {
    date: "2026-10-10",
    title: "On the internet, with a limited release",
    paragraphs: [
      "The day it stopped being localhost. The API went onto Cloud Run with a managed Postgres on a free tier, which I chose because the more obvious managed database would have been close to the entire bill at this size, and the client went onto Firebase Hosting at dev.recadvisor.app.",
      "Passwords came out altogether — signing in is a six-digit code sent to your email, or Google — and signing up and signing in became the same action. I have invited close family so far.",
      "New accounts also got a walkthrough: connect Strava, connect a calendar, say what you are training for. Connecting comes first because both of those leave the app for a consent screen and come back to a fresh page, so anything typed beforehand would not survive the trip.",
    ],
  },
  {
    date: "2026-10-14",
    title: "The rule I built it on turned out to be wrong",
    paragraphs: [
      "RecAdvisor shipped with a rule that the plan never changes on its own. A new activity did not change it, a new calendar event did not change it, and the only things that could were me writing an adjustment or asking for a rebuild.",
      "I made that rule to keep down how much I was calling a language model. Every regeneration is a call, and I did not want the thing replanning each time an activity landed. I framed it afterwards as a philosophy about plans you can commit to, but that came second.",
      "Then I worked out what it actually costs, and decided the updating is the part I need. At the number of people realistically going to use this, keeping the plan current comes to a very small amount of money — small enough that it was never worth designing around. Living with the rule for a month had already made its cost clear in a way the savings never were: the plan went stale, and it was blind to the two things that most obviously matter, since I skipped a long run and it carried on as though I had done it, and I added a trip and it never noticed. The rule was working against the reason I started.",
      "So it revises itself now, but it revises rather than rewrites: the model gets the current plan plus whatever changed and returns only the days that should be different. Today is frozen from six in the morning, because the morning email and the app have to agree about today, and every changed day carries a sentence saying why. What I wanted was never that the plan should hold still, only that it should not move without telling me.",
      "The same day, the model went back to writing the plan outright, which is how the March script had worked. Rules turned out to be good at respecting a constraint and less good at deciding that this week should look different from last week. What is different from March is what happens afterwards: the result goes through a strict schema and a set of checks that trim a day rather than reject it, since returning nothing at all helps nobody at six in the morning.",
    ],
    shot: {
      src: "/recadvisor/change-note.webp",
      alt: "An expanded day in the week view, reading: Updated — replaced Thursday's easy bouldering with short, gentle mobility because you asked to rest your forearm before Friday's Cashmere Peak hike. Below it a fifteen minute gentle mobility session and a Watch out for note about a touchy groin and hamstring",
      caption: "The part that mattered to get right. The plan changed Thursday on its own, and the first line of the day says what it did and why.",
    },
  },
  {
    date: "2026-10-19",
    title: "Making it fit to hand to somebody",
    paragraphs: [
      "The last stretch has been about other people using it. Calendar changes and missed sessions now reach the plan. The change box answers in a sentence rather than silently altering something. Today loads in one request and shows the last plan immediately while the fresh one is on its way, because a spinner on top of a plan you already have is worse than text that is slightly behind.",
      "And a tester program, where the part I spent longest on was consent. It is a screen you agree to, listing in plain sentences what gets recorded: which steps you reach, anything that goes wrong and how long pages take to load, and what the app does with your plan. The diagnostics are an allow-list, so anything I have not explicitly added is dropped rather than stored, and nothing is recorded at all for somebody who has not agreed. That went live on the twentieth, which means the thing is now ready for people to try."
    ],
    shot: {
      src: "/recadvisor/change.webp",
      alt: "The Change something box with its placeholder reading I'm sore today, can I bike instead? Why is Thursday so hard? Underneath, a reply: I added a short, easy walk for tomorrow so you get the light activity you asked for without adding meaningful strain before Friday's Cashmere Peak outing",
      caption: "The change box answers in a sentence, and the week below it already shows the walk it added.",
    },
  },
  {
    date: "2026-10-20",
    title: "Saying how hard a day is, instead of what kind of day it is",
    paragraphs: [
      "Until this week each day carried a verdict — train, rest, busy or ski — which told you what sort of day it was and nothing about what it would cost you. Two training days can sit a long way apart in effort, and the label flattened that.",
      "So the badge now says how hard the day is, in tiers borrowed from Strava’s relative effort: historic, massive and tough at the top, then steady, easy, recovery, and rest, busy or event where there is nothing to do. The week reads tough, steady, rest at a glance, which is the question I was actually asking when I looked at it. The verdict colours came out with the old labels.",
    ],
    shot: {
      src: "/recadvisor/week.webp",
      alt: "The week in RecAdvisor: six day cards from Tomorrow to Monday, each with a sport icon, a title and an effort badge reading Rest, Recovery, Tough, Rest, Steady and Rest. Sunday carries three sport icons for a run, body work and bouldering",
      caption: "The week at a glance. Sunday shows three icons because three sports are planned for it, which a single line would have hidden.",
    },
  },
];
