"use client";

import { ExpeditionProgress } from "@/components/passport/expedition-progress";
import { ExplorerIdentity } from "@/components/passport/explorer-identity";
import { MissionStamp } from "@/components/passport/mission-stamp";
import { usePassport } from "@/components/passport/use-passport";
import { getMissionDossier } from "@/lib/mission-details";
import { libraryMissions } from "@/lib/mission-library";
import { rankForCount } from "@/lib/passport";

const dossiers = libraryMissions
  .map((mission) => getMissionDossier(mission.id))
  .filter((dossier): dossier is NonNullable<typeof dossier> => Boolean(dossier));

export function ExpeditionPassport() {
  const { ready, missions, completed, statusOf } = usePassport();
  const rank = rankForCount(completed);

  if (!ready) {
    return (
      <div className="px-5 py-16 sm:px-8">
        <p className="mx-auto max-w-6xl text-[11px] tracking-[0.22em] text-ink-soft uppercase">
          Opening passport…
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold uppercase">
          Crew papers · not an account
        </p>
        <p className="mt-3 max-w-2xl leading-7 text-ink-soft">
          A local demonstration logbook. Stamps are stored in this browser
          only — Expedition HQ does not receive names, and this is not a
          login.
        </p>

        <div className="mt-8">
          <ExplorerIdentity
            rank={rank}
            completed={completed}
            total={dossiers.length}
          />
        </div>

        <div className="mt-8">
          <ExpeditionProgress
            completed={completed}
            total={dossiers.length}
            rank={rank}
          />
        </div>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
                Visa pages
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
                Mission stamp collection
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink-soft">
              Full-color stamps are completed. In-progress berths stay locked.
              Open a dossier to accept or mark a demo completion.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {dossiers.map((dossier) => (
              <MissionStamp
                key={dossier.id}
                dossier={dossier}
                status={statusOf(dossier.id)}
                completedAt={missions[dossier.id]?.completedAt}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
