export type MissionStatus = "Open berth" | "In the field" | "Logged" | "Sealed";
export type MissionDifficulty = "Gentle" | "Moderate" | "Demanding";

export type LibraryMission = {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  difficulty: MissionDifficulty;
  time: string;
  status: MissionStatus;
};

export const libraryMissions: LibraryMission[] = [
  {
    id: "mission-crate",
    number: "01",
    title: "Mission Crate",
    description:
      "Exchange a box containing small objects from everyday life.",
    category: "Cargo",
    difficulty: "Moderate",
    time: "6 weeks",
    status: "Open berth",
  },
  {
    id: "one-second-on-earth",
    number: "02",
    title: "One Second on Earth",
    description:
      "Capture the same moment from different places around the world.",
    category: "Time",
    difficulty: "Gentle",
    time: "21 days",
    status: "In the field",
  },
  {
    id: "role-swap-24-hours",
    number: "03",
    title: "Role Swap 24 Hours",
    description:
      "Experience a day inspired by your expedition partner's routine.",
    category: "Routine",
    difficulty: "Demanding",
    time: "24 hours + 7 days",
    status: "Open berth",
  },
  {
    id: "cook-my-hometown",
    number: "04",
    title: "Cook My Hometown",
    description: "Recreate a dish from your partner's hometown.",
    category: "Kitchen",
    difficulty: "Moderate",
    time: "4 weeks",
    status: "Logged",
  },
  {
    id: "story-relay",
    number: "05",
    title: "Story Relay",
    description: "Collaboratively continue a story across countries.",
    category: "Story",
    difficulty: "Gentle",
    time: "3 weeks",
    status: "Open berth",
  },
  {
    id: "time-capsule",
    number: "06",
    title: "Time Capsule",
    description: "Write letters to each other to be opened years later.",
    category: "Archive",
    difficulty: "Gentle",
    time: "1 letter · open in 5 years",
    status: "In the field",
  },
  {
    id: "treasure-hunt",
    number: "07",
    title: "Treasure Hunt",
    description:
      "Search your city for an object requested by your expedition partner.",
    category: "Field",
    difficulty: "Moderate",
    time: "10 days",
    status: "Open berth",
  },
  {
    id: "teach-me-one-phrase",
    number: "08",
    title: "Teach Me One Phrase",
    description: "Teach each other a local phrase, dialect, or slang.",
    category: "Language",
    difficulty: "Gentle",
    time: "2 weeks",
    status: "Open berth",
  },
  {
    id: "my-corner-of-the-world",
    number: "09",
    title: "My Corner of the World",
    description: "Share three meaningful objects from your personal space.",
    category: "Place",
    difficulty: "Gentle",
    time: "1 week",
    status: "Logged",
  },
  {
    id: "secret-mission",
    number: "10",
    title: "Secret Mission",
    description:
      "Complete a small surprise mission released by Expedition HQ.",
    category: "HQ",
    difficulty: "Moderate",
    time: "48 hours",
    status: "Sealed",
  },
];

export const libraryCategories = [
  "All",
  ...Array.from(new Set(libraryMissions.map((mission) => mission.category))),
];
