import { explorerIdentity, type ExplorerRank } from "@/lib/passport";

export function ExplorerIdentity({
  rank,
  completed,
  total,
}: {
  rank: ExplorerRank;
  completed: number;
  total: number;
}) {
  const initials = explorerIdentity.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <article className="surface-lift relative overflow-hidden rounded-[1.6rem] bg-navy text-ivory">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold/20"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-16 h-36 w-36 rounded-full border border-gold/10"
      />

      <div className="relative grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="flex flex-col items-start gap-4">
          <p className="text-[10px] tracking-[0.32em] text-gold uppercase">
            Expedition passport
          </p>
          <div className="flex h-28 w-24 items-center justify-center rounded-sm border border-gold/45 bg-navy shadow-[inset_0_0_0_1px_rgba(184,154,92,0.2)]">
            <span className="font-display text-4xl text-gold">{initials}</span>
          </div>
          <p className="text-[10px] tracking-[0.22em] text-ivory/55 uppercase">
            Photo withheld · mock berth
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            Bearer
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {explorerIdentity.name}
          </h1>
          <p className="mt-2 text-sm text-ivory/70">
            {explorerIdentity.berth} · {explorerIdentity.issuePlace}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Expedition ID
              </dt>
              <dd className="mt-1 font-medium tracking-wide">
                {explorerIdentity.expeditionId}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Rank
              </dt>
              <dd className="mt-1">{rank.title}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Joined
              </dt>
              <dd className="mt-1">{explorerIdentity.joinDate}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Missions logged
              </dt>
              <dd className="mt-1">
                {completed} / {total}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="relative border-t border-ivory/10 px-6 py-3 font-mono text-[10px] tracking-[0.18em] text-ivory/45 uppercase sm:px-8">
        {`BLWE<<MOREAU<CLARA<<<${explorerIdentity.expeditionId.replaceAll("-", "")}<<DEMO`}
      </p>
    </article>
  );
}
