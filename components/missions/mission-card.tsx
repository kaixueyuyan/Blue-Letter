import type { Mission } from "@/lib/missions";
import { PaperCard } from "@/components/ui/paper-card";
import { Stamp } from "@/components/ui/stamp";

const statusTone = {
  Recruiting: "red" as const,
  "In the field": "navy" as const,
  Logged: "gold" as const,
};

export function MissionCard({ mission }: { mission: Mission; index: number }) {
  return (
    <PaperCard className="group p-6 transition duration-300 hover:-translate-y-1 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.28em] text-ink-soft uppercase">
          {mission.code}
        </p>
        <Stamp label={mission.stamp} tone={statusTone[mission.status]} className="text-[9px]" />
      </div>
      <h3 className="mt-5 font-display text-3xl font-medium tracking-tight text-ink">
        {mission.title}
      </h3>
      <p className="mt-1 font-display text-lg italic text-ink-soft">{mission.subtitle}</p>
      <p className="mt-4 leading-7 text-ink-soft">{mission.summary}</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Origin</dt>
          <dd className="mt-1 text-ink">{mission.origin}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Counterpart</dt>
          <dd className="mt-1 text-ink">{mission.counterpart}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Duration</dt>
          <dd className="mt-1 text-ink">{mission.duration}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">Crew</dt>
          <dd className="mt-1 text-ink">{mission.crewSize}</dd>
        </div>
      </dl>
      <p className="mt-6 border-t border-ink/8 pt-4 font-display text-xl italic leading-7 text-navy">
        {mission.fieldNote}
      </p>
    </PaperCard>
  );
}
