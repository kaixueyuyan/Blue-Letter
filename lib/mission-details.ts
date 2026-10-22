import { featuredMissions } from "@/lib/missions";
import {
  getAdjacentLibraryMissions,
  getLibraryMission,
  type LibraryMission,
} from "@/lib/mission-library";

export type MissionDetailCopy = {
  briefing: string;
  experience: string;
  why: string;
  objectives: string[];
  rewardStamp: string;
  reward: string;
};

const featuredById = Object.fromEntries(
  featuredMissions.map((mission) => [mission.id, mission]),
);

const detailCopy: Record<string, MissionDetailCopy> = {
  "mission-crate": {
    briefing:
      featuredById["mission-crate"]?.summary ??
      "Exchange a crate of ordinary objects until the inventory becomes the letter.",
    experience:
      "You will pack, unpack, and return five things that belong to an ordinary day. The crate is the voyage: weight, smell, and the small shock of someone else's pocket objects on your table.",
    why: "Photographs flatten a place. A crate insists that two people handle the same wood, the same dust, the same unremarkable things — and still have to explain them.",
    objectives: [
      "Select five objects you touch in a typical week. Nothing precious.",
      "Pack them with a handwritten inventory: name, use, and who last held each one.",
      "When the counterpart crate arrives, unpack it on camera without commentary for thirty seconds.",
      "Return five ordinary objects from your city, plus taste notes on what surprised you.",
      featuredById["mission-crate"]?.fieldNote ??
        "Do not send anything precious. Send what you touch every day.",
    ],
    rewardStamp: featuredById["mission-crate"]?.stamp ?? "CRATE CLEARED",
    reward:
      "A wax-red cargo stamp for the inside cover of your logbook, plus a shared inventory written in two languages.",
  },
  "one-second-on-earth": {
    briefing:
      featuredById["one-second-on-earth"]?.summary ??
      "Film one second of the world in front of you at an agreed hour.",
    experience:
      "You will wait for a clock, hold still, and give the expedition exactly one second of your latitude — schoolyard, tram door, river fog, kitchen steam.",
    why: "A planet is too large to visit. One second, taken together, is small enough to mail and large enough to prove you were both here.",
    objectives: [
      "Confirm the agreed local time with your counterpart.",
      "Film exactly one second. Do not pan. Do not narrate.",
      "Send the clip with the time, weather, and three words for the sound.",
      "Watch the shared reel once all seconds have arrived. Note the second that felt most like home.",
      featuredById["one-second-on-earth"]?.fieldNote ??
        "Hold still. Let the second be boring if it must.",
    ],
    rewardStamp: featuredById["one-second-on-earth"]?.stamp ?? "TIME STAMPED",
    reward:
      "A gold time-stamp for your passport page and a place in the crew's one-second globe.",
  },
  "role-swap-24-hours": {
    briefing:
      featuredById["role-swap-24-hours"]?.summary ??
      "Live a day mapped from your partner's ordinary timetable.",
    experience:
      "You will trade hour-by-hour maps of a typical day, then attempt the other person's breakfast, commute, chores, and rest. The evidence is a logbook, not a performance.",
    why: "Charity looks at a life from above. A swapped day asks you to stand in the timetable itself — and to write down where you cannot follow.",
    objectives: [
      "Write a 24-hour map: waking, meals, school or work, chores, rest.",
      "Exchange maps. Mark which hours you can attempt and which you cannot.",
      "Live the counterpart day as closely as local life allows.",
      "Return a log of what you copied, what you invented, and what you refused.",
      featuredById["role-swap-24-hours"]?.fieldNote ??
        "If you cannot copy a task, write why. That is the mission.",
    ],
    rewardStamp: featuredById["role-swap-24-hours"]?.stamp ?? "DUTY SWAP",
    reward:
      "A navy duty-swap stamp and a pair of timetables that now exist in two kitchens.",
  },
  "cook-my-hometown": {
    briefing:
      featuredById["cook-my-hometown"]?.summary ??
      "Teach one hometown dish, then cook the other person's.",
    experience:
      "You will write a recipe as a set of coordinates: market list, heat, and the person who usually cooks it. Then you will cook someone else's hometown and record the mistakes.",
    why: "A dish is a map you can eat. Substitutions, burnt edges, and the wrong chili are part of the letter.",
    objectives: [
      "Write one hometown recipe by hand, with a market list and who usually cooks it.",
      "Send a photograph of the table as it looks on an ordinary night.",
      "Cook your counterpart's dish. Record every substitution.",
      "Return taste notes, a photograph of your attempt, and one question for the original cook.",
      featuredById["cook-my-hometown"]?.fieldNote ??
        "If an ingredient is missing, invent the nearest cousin. Record the substitution.",
    ],
    rewardStamp: featuredById["cook-my-hometown"]?.stamp ?? "KITCHEN POST",
    reward:
      "A kitchen-post stamp and a two-page recipe that now lives in both houses.",
  },
  "story-relay": {
    briefing:
      "A story begins in one language and continues in another. Each crew member writes the next scene from their desk, then mails it on. The plot is the space between the two rooms.",
    experience:
      "You will receive a fragment — a sentence, a drawing, a rumor from a schoolyard — and you must continue it without correcting the other person's world.",
    why: "Translation is already an expedition. A relay story makes the delay, the guesswork, and the courtesy of not overwriting someone else into the plot.",
    objectives: [
      "Write an opening no longer than one page. Leave a door open.",
      "Send it with one rule your counterpart must keep.",
      "Continue their fragment without erasing their details.",
      "Close the story only when both sides have written twice.",
      "Title the finished piece in both languages.",
    ],
    rewardStamp: "RELAY LOGGED",
    reward:
      "A story-relay stamp and a finished tale that cannot be told from only one latitude.",
  },
  "time-capsule": {
    briefing:
      "Write a letter that is not for now. Seal it for a date years ahead. Your counterpart does the same. The mission is complete when both envelopes exist, not when they are opened.",
    experience:
      "You will choose what a future stranger-who-is-still-you should know about this week: weather, a meal, a fear, a joke that will not last.",
    why: "Most letters ask for a reply. A capsule asks for patience — proof that two people agreed to wait for the same future.",
    objectives: [
      "Write one letter to be opened in five years. Date it.",
      "Include one object that will be ordinary by then: a ticket, a wrapper, a class timetable.",
      "Exchange envelopes. Do not open them.",
      "Record the agreed opening date in both logbooks.",
      "Store the counterpart letter where it cannot be casually found.",
    ],
    rewardStamp: "HOLD UNTIL",
    reward:
      "A hold-until stamp and a sealed letter that belongs to a year you have not reached.",
  },
  "treasure-hunt": {
    briefing:
      "Your counterpart names an object from their city that they cannot send: a kind of stone, a shop sign, a fruit sold only in one season. You hunt for its nearest cousin where you live.",
    experience:
      "You will walk with someone else's shopping list. Wrong turns, substitutions, and the photograph of almost-the-thing are the evidence.",
    why: "A hunt makes a city readable. It turns a street you already know into a reply.",
    objectives: [
      "Receive one requested object, described without a brand name.",
      "Search for three hours or three neighborhoods, whichever comes first.",
      "Photograph the nearest cousin in situ, with a note on why it qualifies.",
      "If nothing qualifies, write the absence as the find.",
      "Send back a map of the walk, even if it is ugly.",
    ],
    rewardStamp: "FIELD MARK",
    reward:
      "A field-mark stamp and a photograph of an object that almost matched.",
  },
  "teach-me-one-phrase": {
    briefing:
      "Each crew member teaches one local phrase, dialect word, or piece of slang that does not survive a textbook. The other must use it in a real sentence and send the recording back.",
    experience:
      "You will hear a word that has a kitchen in it, then try it in your own mouth, then learn why you got it slightly wrong.",
    why: "A phrase is a small visa. It lets two people stand in the same joke for a moment.",
    objectives: [
      "Choose one phrase you actually use. Write how it sounds, not only how it is spelled.",
      "Explain when it is polite, when it is rude, and who is allowed to say it.",
      "Record your counterpart attempting it. Do not mock the attempt.",
      "Correct one thing only. Leave the rest.",
      "Use their phrase once in a letter home.",
    ],
    rewardStamp: "PHRASE CLEARED",
    reward:
      "A phrase-cleared stamp and two words that now have two accents.",
  },
  "my-corner-of-the-world": {
    briefing:
      "Share three objects from the corner of the room that is most yours: a desk, a windowsill, a bed-edge. Not a tour of the town. A tour of an arm's reach.",
    experience:
      "You will look at your own shelf as if a stranger had to live from it, then look at theirs the same way.",
    why: "Homes are too large to mail. Three objects are enough to prove a life without performing it.",
    objectives: [
      "Photograph three objects without tidying first.",
      "Write one sentence for each: who put it there, and whether it can be moved.",
      "Do not explain the whole room.",
      "Receive your counterpart's three objects and choose one question for each.",
      "Answer their questions without adding a fourth object.",
    ],
    rewardStamp: "CORNER MARKED",
    reward:
      "A corner-marked stamp and a pair of shelves that have now been introduced.",
  },
  "secret-mission": {
    briefing:
      "Expedition HQ keeps one brief sealed until a crew is ready. The surprise is small on purpose: a task that can be finished in forty-eight hours once the wax is broken.",
    experience:
      "You will wait, then receive a short instruction that cannot be guessed from the library card. Both latitudes get the same sealed note.",
    why: "Not every route should be advertised. A sealed mission restores the feeling of being called, not merely browsing.",
    objectives: [
      "Accept the berth without knowing the task.",
      "Open the HQ note at the agreed hour, not before.",
      "Complete the surprise within forty-eight hours.",
      "Send evidence that does not spoil the surprise for other crews.",
      "Return the envelope. HQ files it as logged or still sealed.",
    ],
    rewardStamp: "HQ WAX",
    reward:
      "An HQ wax stamp, issued only after the sealed note has been opened and the small surprise completed.",
  },
};

export type MissionDossier = LibraryMission &
  MissionDetailCopy & {
    previous?: LibraryMission;
    next?: LibraryMission;
  };

export function getMissionDossier(slug: string): MissionDossier | undefined {
  const mission = getLibraryMission(slug);
  const copy = detailCopy[slug];
  if (!mission || !copy) return undefined;

  const { previous, next } = getAdjacentLibraryMissions(slug);

  return {
    ...mission,
    ...copy,
    previous,
    next,
  };
}
