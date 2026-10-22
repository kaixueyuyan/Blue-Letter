import { libraryMissions } from "@/lib/mission-library";

export const PASSPORT_STORAGE_KEY = "blue-letter.passport.v1";
export const PASSPORT_EVENT = "blue-letter-passport";
export const PASSPORT_VERSION = 2 as const;

export type MissionProgressStatus = "not-started" | "in-progress" | "completed";

export type MissionProgress = {
  status: "in-progress" | "completed";
  acceptedAt: string;
  completedAt?: string;
};

export type PassportState = {
  version: typeof PASSPORT_VERSION;
  missions: Record<string, MissionProgress>;
};

type LegacyPassportState = {
  completed?: Record<string, string>;
  missions?: Record<string, unknown>;
  version?: number;
};

export const explorerIdentity = {
  name: "Clara Moreau",
  expeditionId: "BL-WE-26-0418",
  joinDate: "12 March 2026",
  berth: "Overseas correspondent",
  issuePlace: "Expedition HQ",
} as const;

export type ExplorerRank = {
  min: number;
  title: string;
  kicker: string;
};

export const explorerRanks: ExplorerRank[] = [
  { min: 0, title: "Cadet", kicker: "Papers issued" },
  { min: 1, title: "Correspondent", kicker: "First stamp in the book" },
  { min: 4, title: "Field Officer", kicker: "Several latitudes logged" },
  { min: 7, title: "Expedition Lead", kicker: "Log nearly full" },
  { min: 10, title: "Master Explorer", kicker: "Book complete" },
];

const knownIds = new Set(libraryMissions.map((mission) => mission.id));

export function emptyPassport(): PassportState {
  return { version: PASSPORT_VERSION, missions: {} };
}

export function rankForCount(count: number): ExplorerRank {
  return (
    [...explorerRanks].reverse().find((rank) => count >= rank.min) ??
    explorerRanks[0]
  );
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatStampDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  return `${date.getUTCDate()} ${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function parseEntry(value: unknown): MissionProgress | undefined {
  if (!value || typeof value !== "object") return undefined;
  const entry = value as Partial<MissionProgress> & { status?: string };
  if (!isIsoDate(entry.acceptedAt)) return undefined;

  if (entry.status === "completed" && isIsoDate(entry.completedAt)) {
    return {
      status: "completed",
      acceptedAt: entry.acceptedAt,
      completedAt: entry.completedAt,
    };
  }

  if (entry.status === "in-progress" || entry.status === "completed") {
    return {
      status: "in-progress",
      acceptedAt: entry.acceptedAt,
    };
  }

  return undefined;
}

function parsePassport(raw: string | null): {
  state: PassportState;
  migrated: boolean;
} {
  if (!raw) return { state: emptyPassport(), migrated: false };

  try {
    const parsed = JSON.parse(raw) as LegacyPassportState;
    const missions: Record<string, MissionProgress> = {};
    let migrated = parsed.version !== PASSPORT_VERSION;

    if (parsed.missions && typeof parsed.missions === "object") {
      for (const [id, value] of Object.entries(parsed.missions)) {
        if (!knownIds.has(id)) continue;
        const entry = parseEntry(value);
        if (entry) missions[id] = entry;
      }
    }

    if (parsed.completed && typeof parsed.completed === "object") {
      for (const [id, value] of Object.entries(parsed.completed)) {
        if (!knownIds.has(id) || !isIsoDate(value) || missions[id]) continue;
        migrated = true;
        missions[id] = {
          status: "completed",
          acceptedAt: value,
          completedAt: value,
        };
      }
    }

    return {
      state: { version: PASSPORT_VERSION, missions },
      migrated,
    };
  } catch {
    return { state: emptyPassport(), migrated: false };
  }
}

export function getMissionStatus(
  state: PassportState,
  id: string,
): MissionProgressStatus {
  return state.missions[id]?.status ?? "not-started";
}

export function completedCount(state: PassportState) {
  return Object.values(state.missions).filter(
    (entry) => entry.status === "completed",
  ).length;
}

export function readPassport(): PassportState {
  if (typeof window === "undefined") return emptyPassport();
  const { state, migrated } = parsePassport(
    window.localStorage.getItem(PASSPORT_STORAGE_KEY),
  );
  if (migrated) writePassport(state);
  return state;
}

export function writePassport(state: PassportState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(PASSPORT_EVENT));
}

export function acceptMission(id: string, at = new Date()) {
  if (!knownIds.has(id)) return readPassport();
  const state = readPassport();
  if (state.missions[id]) return state;
  state.missions[id] = {
    status: "in-progress",
    acceptedAt: at.toISOString(),
  };
  writePassport(state);
  return state;
}

export function completeMission(id: string, at = new Date()) {
  if (!knownIds.has(id)) return readPassport();
  const state = readPassport();
  const current = state.missions[id];
  if (!current || current.status !== "in-progress") return state;
  state.missions[id] = {
    ...current,
    status: "completed",
    completedAt: at.toISOString(),
  };
  writePassport(state);
  return state;
}
