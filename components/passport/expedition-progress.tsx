import type { ExplorerRank } from "@/lib/passport";

export function ExpeditionProgress({
  completed,
  total,
  rank,
}: {
  completed: number;
  total: number;
  rank: ExplorerRank;
}) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="surface-lift rounded-[1.6rem] border border-ink/8 bg-paper p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            Expedition progress
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
            {completed} of {total} missions logged
          </h2>
        </div>
        <p className="text-sm text-ink-soft">
          Current rank · <span className="text-navy">{rank.title}</span>
          <span className="mt-1 block text-[11px] tracking-[0.18em] uppercase">
            {rank.kicker}
          </span>
        </p>
      </div>

      <div
        className="mt-6 h-2 overflow-hidden rounded-full bg-ink/8"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-label="Missions logged"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-navy to-gold transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-[11px] tracking-[0.18em] text-ink-soft uppercase">
        {percent}% of the book
      </p>
    </section>
  );
}
