import { cn } from "@/lib/cn";
import { formatStampDate, type MissionProgressStatus } from "@/lib/passport";
import type { MissionDossier } from "@/lib/mission-details";
import Link from "next/link";

const marks: Record<
  string,
  { rotate: number; ink: string; glyph: string; port: string }
> = {
  "mission-crate": {
    rotate: -8,
    ink: "text-air-red",
    glyph: "口",
    port: "Cargo port",
  },
  "one-second-on-earth": {
    rotate: 7,
    ink: "text-gold",
    glyph: "1″",
    port: "Meridian",
  },
  "role-swap-24-hours": {
    rotate: -4,
    ink: "text-navy",
    glyph: "⇄",
    port: "Duty desk",
  },
  "cook-my-hometown": {
    rotate: 11,
    ink: "text-wax",
    glyph: "◎",
    port: "Market",
  },
  "story-relay": {
    rotate: -12,
    ink: "text-moss",
    glyph: "¶",
    port: "Relay",
  },
  "time-capsule": {
    rotate: 6,
    ink: "text-navy",
    glyph: "▣",
    port: "Archive",
  },
  "treasure-hunt": {
    rotate: -6,
    ink: "text-gold",
    glyph: "✦",
    port: "Field",
  },
  "teach-me-one-phrase": {
    rotate: 5,
    ink: "text-air-red",
    glyph: "あ",
    port: "Tongue",
  },
  "my-corner-of-the-world": {
    rotate: -10,
    ink: "text-moss",
    glyph: "⌂",
    port: "Room",
  },
  "secret-mission": {
    rotate: 13,
    ink: "text-wax",
    glyph: "✱",
    port: "HQ wax",
  },
};

const fallbackMark = {
  rotate: 0,
  ink: "text-navy",
  glyph: "BL",
  port: "HQ",
};

function caption(status: MissionProgressStatus, completedAt?: string) {
  if (status === "completed" && completedAt) {
    return formatStampDate(completedAt);
  }
  if (status === "in-progress") return "In progress";
  return "Not started";
}

export function MissionStamp({
  dossier,
  status,
  completedAt,
}: {
  dossier: MissionDossier;
  status: MissionProgressStatus;
  completedAt?: string;
}) {
  const mark = marks[dossier.id] ?? fallbackMark;
  const unlocked = status === "completed";

  return (
    <article className="flex flex-col items-center text-center">
      <Link
        href={`/missions/${dossier.id}`}
        className="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <span className="sr-only">
          {dossier.title}, {caption(status, completedAt)}
        </span>
        <div
          className={cn(
            "relative flex h-36 w-36 items-center justify-center transition duration-300 group-hover:scale-[1.03]",
            mark.ink,
            unlocked ? "opacity-100" : "opacity-[0.38] grayscale",
          )}
        >
          <svg
            viewBox="0 0 144 144"
            className="h-full w-full"
            style={{ transform: `rotate(${mark.rotate}deg)` }}
            aria-hidden
          >
            <circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="currentColor"
              strokeWidth={unlocked ? 2.4 : 1.6}
              strokeDasharray={unlocked ? undefined : "5 6"}
            />
            <circle
              cx="72"
              cy="72"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.7"
            />
            <circle
              cx="72"
              cy="72"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2 4"
              opacity="0.55"
            />
          </svg>
          <div className="pointer-events-none absolute inset-6 flex flex-col items-center justify-center">
            <span className="font-display text-3xl leading-none">
              {mark.glyph}
            </span>
            <span className="mt-1 max-w-[6.5rem] text-[8px] font-medium tracking-[0.16em] uppercase">
              {dossier.rewardStamp}
            </span>
            <span className="mt-1 text-[8px] tracking-[0.2em] uppercase opacity-70">
              {mark.port}
            </span>
          </div>
        </div>
        <p className="mt-3 font-display text-xl text-ink group-hover:text-navy">
          {dossier.number} · {dossier.title}
        </p>
        <p
          className={cn(
            "mt-1 text-[11px] tracking-[0.18em] uppercase",
            status === "in-progress" ? "text-gold" : "text-ink-soft",
          )}
        >
          {caption(status, completedAt)}
        </p>
      </Link>
    </article>
  );
}
