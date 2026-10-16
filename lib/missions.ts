export type Mission = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  origin: string;
  counterpart: string;
  duration: string;
  crewSize: string;
  summary: string;
  fieldNote: string;
  stamp: string;
  status: "Recruiting" | "In the field" | "Logged";
};

export const featuredMissions: Mission[] = [
  {
    id: "mission-crate",
    code: "BL-07",
    title: "Mission Crate",
    subtitle: "Objects that cannot fit in a photograph",
    origin: "Guizhou highlands",
    counterpart: "Lisbon / Nairobi / Portland",
    duration: "6 weeks",
    crewSize: "pairs of 2",
    summary:
      "A child packs a wooden crate with five ordinary things from home. An overseas volunteer unpacks it on camera, then returns a crate of five ordinary things from their city. The inventory becomes the letter.",
    fieldNote: "Do not send anything precious. Send what you touch every day.",
    stamp: "CRATE CLEARED",
    status: "Recruiting",
  },
  {
    id: "one-second-on-earth",
    code: "BL-12",
    title: "One Second on Earth",
    subtitle: "A globe assembled from 86,400 fragments",
    origin: "Yunnan villages",
    counterpart: "Any longitude",
    duration: "21 days",
    crewSize: "open crew",
    summary:
      "At an agreed local time, every participant films exactly one second of the world in front of them. The seconds are stitched into a shared reel — schoolyard, tram door, river fog, kitchen steam — one planet, one second at a time.",
    fieldNote: "Hold still. Let the second be boring if it must.",
    stamp: "TIME STAMPED",
    status: "In the field",
  },
  {
    id: "role-swap-24-hours",
    code: "BL-03",
    title: "Role Swap 24 Hours",
    subtitle: "Live someone else's ordinary day",
    origin: "Hunan schoolyards",
    counterpart: "Berlin / Melbourne / Accra",
    duration: "24 hours + 7 days of letters",
    crewSize: "matched pairs",
    summary:
      "A child and a volunteer exchange an hour-by-hour map of a typical day, then attempt to follow the other person's timetable: breakfast, commute, chores, rest. Evidence is a logbook, not a performance.",
    fieldNote: "If you cannot copy a task, write why. That is the mission.",
    stamp: "DUTY SWAP",
    status: "Recruiting",
  },
  {
    id: "cook-my-hometown",
    code: "BL-18",
    title: "Cook My Hometown",
    subtitle: "Recipes as coordinates",
    origin: "Sichuan kitchens",
    counterpart: "Home kitchens worldwide",
    duration: "4 weeks",
    crewSize: "pairs of 2",
    summary:
      "Each crew member teaches one hometown dish with a handwritten recipe, a market list, and a story about who usually cooks it. Then they cook the other person's dish and send back taste notes, mistakes, and a photograph of the table.",
    fieldNote: "If an ingredient is missing, invent the nearest cousin. Record the substitution.",
    stamp: "KITCHEN POST",
    status: "Logged",
  },
];

export const expeditionSteps = [
  {
    numeral: "I",
    title: "Draw a berth",
    body: "Volunteers from any country join a crew. Children in partner rural schools in China join as field correspondents. Everyone receives the same mission brief.",
  },
  {
    numeral: "II",
    title: "Work the same assignment",
    body: "Two latitudes, one task. Pack a crate, film a second, swap a day, cook a hometown. Evidence is gathered in notebooks, photographs, and short films.",
  },
  {
    numeral: "III",
    title: "Mail the proof",
    body: "Blue letters — digital and paper — cross the map. A mission is complete only when both sides can read the same story in two languages.",
  },
];
