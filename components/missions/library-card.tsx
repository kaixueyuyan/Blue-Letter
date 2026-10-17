import type { LibraryMission } from "@/lib/mission-library";
import { PaperCard } from "@/components/ui/paper-card";
import { Stamp } from "@/components/ui/stamp";

const statusTone = {
  "Open berth": "red" as const,
  "In the field": "navy" as const,
  Logged: "gold" as const,
  Sealed: "gold" as const,
};

export function LibraryCard({ mission }: { mission: LibraryMission }) {
  return (
    <PaperCard className="flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold">
          {mission.number}
        </p>
        <Stamp
          label={mission.status}
          tone={statusTone[mission.status]}
          className="text-[9px]"
        />
      </div>
      <h2 className="mt-5 font-display text-3xl font-medium tracking-tight text-ink">
        {mission.title}
      </h2>
      <p className="mt-3 flex-1 leading-7 text-ink-soft">{mission.description}</p>
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/8 pt-4 text-sm">
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Category</dt>
          <dd className="mt-1 text-ink">{mission.category}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Difficulty</dt>
          <dd className="mt-1 text-ink">{mission.difficulty}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Time</dt>
          <dd className="mt-1 text-ink">{mission.time}</dd>
        </div>
      </dl>
    </PaperCard>
  );
}
