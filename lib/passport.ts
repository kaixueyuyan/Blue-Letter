import { libraryMissions } from "@/lib/mission-library";

export const PASSPORT_STORAGE_KEY = "blue-letter.passport.v1";
export const PASSPORT_EVENT = "blue-letter-passport";
export const PASSPORT_VERSION = 3 as const;

export type MissionProgressStatus =
  | "not-started"
  | "in-progress"
  | "pending-partner"
  | "pending-admin"
  | "verified";

export type FieldAttachment = {
  name: string;
  type: string;
  size: number;
};

export type FieldReport = {
  reflection: string;
  discovery: string;
  attachment?: FieldAttachment;
  submittedAt: string;
};

export type MissionProgress = {
  status: "in-progress" | "pending-partner" | "pending-admin" | "verified";
  acceptedAt: string;
  verifiedAt?: string;
  report?: FieldReport;
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

const REPORT_LIMIT = 2000;

function clipText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, REPORT_LIMIT);
}

function parseAttachment(value: unknown): FieldAttachment | undefined {
  if (!value || typeof value !== "object") return undefined;
  const file = value as Partial<FieldAttachment>;
  if (typeof file.name !== "string" || typeof file.size !== "number") return undefined;
  if (!Number.isFinite(file.size) || file.size < 0) return undefined;
  const name = file.name.trim().slice(0, 120);
  if (!name) return undefined;
  return {
    name,
    type: typeof file.type === "string" ? file.type.slice(0, 80) : "unknown",
    size: file.size,
  };
}

function parseReport(value: unknown): FieldReport | undefined {
  if (!value || typeof value !== "object") return undefined;
  const report = value as Partial<FieldReport>;
  const reflection = clipText(report.reflection);
  const discovery = clipText(report.discovery);
  if (!reflection || !discovery || !isIsoDate(report.submittedAt)) return undefined;
  const attachment = parseAttachment(report.attachment);
  return {
    reflection,
    discovery,
    submittedAt: report.submittedAt,
    ...(attachment ? { attachment } : {}),
  };
}

function parseEntry(value: unknown): MissionProgress | undefined {
  if (!value || typeof value !== "object") return undefined;
  const entry = value as {
    status?: string;
    acceptedAt?: string;
    verifiedAt?: string;
    completedAt?: string;
    report?: unknown;
  };
  if (!isIsoDate(entry.acceptedAt)) return undefined;
  const report = parseReport(entry.report);

  if (
    (entry.status === "verified" && isIsoDate(entry.verifiedAt)) ||
    (entry.status === "completed" && isIsoDate(entry.completedAt))
  ) {
    return {
      status: "verified",
      acceptedAt: entry.acceptedAt,
      verifiedAt: entry.status === "verified" ? entry.verifiedAt : entry.completedAt,
      ...(report ? { report } : {}),
    };
  }

  if (entry.status === "pending-admin") {
    return {
      status: "pending-admin",
      acceptedAt: entry.acceptedAt,
      ...(report ? { report } : {}),
    };
  }

  if (entry.status === "pending-partner" && report) {
    return {
      status: "pending-partner",
      acceptedAt: entry.acceptedAt,
      report,
    };
  }

  if (
    entry.status === "in-progress" ||
    entry.status === "pending-partner" ||
    entry.status === "completed"
  ) {
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
          status: "verified",
          acceptedAt: value,
          verifiedAt: value,
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
    (entry) => entry.status === "verified",
  ).length;
}

export function isFieldReportReady(reflection: string, discovery: string) {
  return (
    reflection.trim().length > 0 &&
    reflection.trim().length <= REPORT_LIMIT &&
    discovery.trim().length > 0 &&
    discovery.trim().length <= REPORT_LIMIT
  );
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

export function submitFieldReport(
  id: string,
  input: { reflection: string; discovery: string; attachment?: FieldAttachment },
  at = new Date(),
) {
  if (!knownIds.has(id)) return readPassport();
  const reflection = clipText(input.reflection);
  const discovery = clipText(input.discovery);
  if (!isFieldReportReady(reflection, discovery)) return readPassport();
  const state = readPassport();
  const current = state.missions[id];
  if (!current || current.status !== "in-progress") return state;
  const attachment = parseAttachment(input.attachment);
  state.missions[id] = {
    status: "pending-partner",
    acceptedAt: current.acceptedAt,
    report: {
      reflection,
      discovery,
      submittedAt: at.toISOString(),
      ...(attachment ? { attachment } : {}),
    },
  };
  writePassport(state);
  return state;
}

export function confirmPartner(id: string) {
  if (!knownIds.has(id)) return readPassport();
  const state = readPassport();
  const current = state.missions[id];
  if (!current || current.status !== "pending-partner") return state;
  state.missions[id] = {
    ...current,
    status: "pending-admin",
  };
  writePassport(state);
  return state;
}

export function approveReview(id: string, at = new Date()) {
  if (!knownIds.has(id)) return readPassport();
  const state = readPassport();
  const current = state.missions[id];
  if (!current || current.status !== "pending-admin") return state;
  state.missions[id] = {
    ...current,
    status: "verified",
    verifiedAt: at.toISOString(),
  };
  writePassport(state);
  return state;
}
