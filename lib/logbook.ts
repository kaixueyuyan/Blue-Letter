import { getLibraryMission } from "@/lib/mission-library";

export type LogbookVisual =
  | "crate"
  | "second"
  | "timetable"
  | "kitchen"
  | "relay"
  | "capsule"
  | "field"
  | "phrase";

export type LogbookStory = {
  id: string;
  slug: string;
  title: string;
  missionSlug: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  summary: string;
  story: string[];
  discoveries: string[];
  visual: LogbookVisual;
  featured: boolean;
};

export const logbookStories: LogbookStory[] = [
  {
    id: "crate-rain",
    slug: "the-crate-that-smelled-of-rain",
    title: "The Crate That Smelled of Rain",
    missionSlug: "mission-crate",
    region: "Guizhou highlands",
    country: "China",
    lat: 26.6,
    lng: 106.7,
    date: "March 2026",
    featured: true,
    visual: "crate",
    summary:
      "Five ordinary objects crossed two kitchens. The inventory became the letter — and neither crew expected the rain to travel with the wood.",
    story: [
      "This field note is a demonstration dossier. The names below are invented. No student is identified.",
      "Crew 07 packed a small crate in a mountain classroom: a worn eraser, a bus ticket, a folded paper frog, a spoon with a bent neck, and a pebble that lived in a coat pocket. The Lyon volunteer unpacked it on a rented table without speaking for thirty seconds, then packed five cousins from an ordinary French week.",
      "What returned was not a gift. It was a second inventory written in two hands. The Lyon crate smelled faintly of rain because the volunteer had dried the wood by a window. The Guizhou crew wrote that their original crate had dried the same way, after a wet walk to school.",
      "Neither side sent anything precious. Both sides had to explain what ‘ordinary’ meant. That argument — polite, specific, unfinished — is the expedition.",
    ],
    discoveries: [
      "A bent spoon can be a timetable: who eats, and when the metal last touched a pot.",
      "Rain on untreated wood is a shared climate, not a metaphor.",
      "Inventories work better than photographs when two rooms refuse to look alike.",
    ],
  },
  {
    id: "chili-cousins",
    slug: "chili-cousins",
    title: "Chili Cousins",
    missionSlug: "cook-my-hometown",
    region: "Hunan market town",
    country: "China",
    lat: 28.2,
    lng: 112.9,
    date: "April 2026",
    featured: true,
    visual: "kitchen",
    summary:
      "Two cooks traded a hometown dish. Substitutions were required. The mistakes were filed as coordinates, not failures.",
    story: [
      "Demo content only. No real kitchens or students are named here.",
      "The field correspondent wrote a recipe as a set of market instructions: which stall, how the chili should look, who usually stands at the wok. The Lisbon volunteer cooked it with a cousin pepper and a different oil, then mailed taste notes and a photograph of an ordinary table — not a styled one.",
      "In return, a seafood stew arrived as handwriting. The mountain kitchen could not find the same fish. They used river tofu and wrote why. The Lisbon cook answered with one question: did the steam still smell like the original house?",
      "Charity would have sent a cookbook. The mission sent two imperfect plates and a record of every substitution.",
    ],
    discoveries: [
      "A missing ingredient is part of the letter if you name the cousin.",
      "An ordinary table photographs more honestly than a festival spread.",
      "Heat is local. Courtesy is asking who usually cooks, then leaving their method intact.",
    ],
  },
  {
    id: "one-second-yards",
    slug: "one-second-two-yards",
    title: "One Second, Two Yards",
    missionSlug: "one-second-on-earth",
    region: "Guangxi schoolyard",
    country: "China",
    lat: 23.1,
    lng: 108.3,
    date: "February 2026",
    featured: false,
    visual: "second",
    summary:
      "At an agreed hour, two crews held still. One second of a schoolyard and one second of a tram door were stitched into the same reel.",
    story: [
      "Fictional log. The second is invented; the method is the mission.",
      "The agreed time fell during morning break in Guangxi and during a grey commute in Helsinki. Neither crew panned. Neither narrated. Three words for sound came back: ‘rubber, skip, bell’ and ‘door, coat, rain’.",
      "When the seconds were placed side by side, the boring one felt more like home. That was the discovery the brief had asked for.",
    ],
    discoveries: [
      "A planet is too large to visit; a second is small enough to mail.",
      "Holding still is harder than filming a tour.",
      "Sound notes travel farther than the image.",
    ],
  },
  {
    id: "uncopied-hour",
    slug: "the-hour-we-could-not-copy",
    title: "The Hour We Could Not Copy",
    missionSlug: "role-swap-24-hours",
    region: "Mountain classroom",
    country: "China",
    lat: 27.7,
    lng: 108.1,
    date: "January 2026",
    featured: false,
    visual: "timetable",
    summary:
      "Two 24-hour maps were exchanged. The mission was completed in the hours that could not be followed, written down without performance.",
    story: [
      "Demonstration only. No real timetables of minors are reproduced here.",
      "The volunteer in Melbourne tried a school-day map and marked the hours that night-shift baking made impossible. The field crew tried a bakery dawn and marked the hours that class made impossible.",
      "The logbooks did not pretend. Refusal, with a reason, was filed as evidence. That is the assignment.",
    ],
    discoveries: [
      "A swapped day is not a costume.",
      "The honest hour is the one you cannot copy.",
      "Two kitchens can share a timetable without sharing a life.",
    ],
  },
  {
    id: "two-doors",
    slug: "a-story-with-two-doors",
    title: "A Story With Two Doors",
    missionSlug: "story-relay",
    region: "Village reading room",
    country: "China",
    lat: 25.0,
    lng: 102.7,
    date: "May 2026",
    featured: false,
    visual: "relay",
    summary:
      "A fragment left a door open in one language. The next scene arrived from a desk in Nairobi without correcting the first room.",
    story: [
      "Demo tale. The plot is invented so the method can be shown.",
      "The opening was one page, in pencil, about a key that only worked after rain. The counterpart continued it in another language and kept the rain. They did not tidy the geography.",
      "The finished piece needed two titles. Neither crew claimed to own the middle.",
    ],
    discoveries: [
      "Translation is already an expedition.",
      "Leaving a door open is a craft, not an accident.",
      "A relay story is complete only when both rooms have written twice.",
    ],
  },
  {
    id: "hold-until",
    slug: "hold-until-spring-2031",
    title: "Hold Until Spring 2031",
    missionSlug: "time-capsule",
    region: "School archive shelf",
    country: "China",
    lat: 29.6,
    lng: 106.5,
    date: "June 2026",
    featured: false,
    visual: "capsule",
    summary:
      "Two envelopes were sealed for a year neither crew has reached. The mission ended when both letters existed — not when they are opened.",
    story: [
      "Fictional capsule. No real letters from children are stored on this site.",
      "Each crew dated a letter and included one object that would be ordinary by then: a class timetable, a tram ticket. They exchanged envelopes and did not open them.",
      "The opening date was copied into both logbooks. Patience became the evidence.",
    ],
    discoveries: [
      "Most letters ask for a reply. A capsule asks for a shared future.",
      "An ordinary ticket will be the strange object in five years.",
      "Completion is the seal, not the reading.",
    ],
  },
  {
    id: "almost-stone",
    slug: "the-stone-that-almost-matched",
    title: "The Stone That Almost Matched",
    missionSlug: "treasure-hunt",
    region: "Kyoto neighborhood",
    country: "Japan",
    lat: 35.0,
    lng: 135.8,
    date: "March 2026",
    featured: false,
    visual: "field",
    summary:
      "A river-town request named a stone without a brand. Three neighborhoods later, the nearest cousin was photographed in situ — almost the thing.",
    story: [
      "Demo hunt. Locations are regional, not addresses.",
      "The request came from a river town: a pale stone used to weigh pickled greens, described by weight and by the sound it made in a tin. The Kyoto volunteer walked until the list became a map.",
      "Nothing qualified exactly. The almost-stone was filed with a note on why it counted, and a sketch of the wrong turns. Absence was allowed to be the find.",
    ],
    discoveries: [
      "A city becomes readable when you carry someone else’s list.",
      "Almost matching is still evidence.",
      "Ugly maps are more useful than pretty ones.",
    ],
  },
  {
    id: "kitchen-phrase",
    slug: "a-phrase-with-a-kitchen-in-it",
    title: "A Phrase With a Kitchen In It",
    missionSlug: "teach-me-one-phrase",
    region: "Mexico City",
    country: "Mexico",
    lat: 19.4,
    lng: -99.1,
    date: "April 2026",
    featured: false,
    visual: "phrase",
    summary:
      "One local phrase that does not survive a textbook was taught, attempted, and corrected once. The rest was left standing.",
    story: [
      "Demonstration exchange. No real student voices are recorded here.",
      "The field crew chose a dialect greeting used at the stove, not in class. They wrote how it sounds, who may say it, and when it would be rude. The Mexico City volunteer sent an attempt and received one correction only.",
      "In return, a cafe slang word crossed the other way and was used once in a letter home. Two accents now share two small visas.",
    ],
    discoveries: [
      "A phrase is a visa if you learn when not to use it.",
      "One correction is a courtesy; five is a lecture.",
      "Kitchens keep the words textbooks drop.",
    ],
  },
];

export function getLogbookStory(slug: string) {
  return logbookStories.find((story) => story.slug === slug);
}

export function getFeaturedStories() {
  return logbookStories.filter((story) => story.featured);
}

export function logbookRegions() {
  return Array.from(new Set(logbookStories.map((story) => story.region)));
}

export function logbookMissionFilters() {
  const ids = Array.from(
    new Set(logbookStories.map((story) => story.missionSlug)),
  );
  return ids.map((id) => ({
    id,
    label: getLibraryMission(id)?.title ?? id,
  }));
}

export { projectAtlasPoint as projectMapPoint } from "@/lib/world-atlas-project";
