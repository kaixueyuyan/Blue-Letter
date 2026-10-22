import { AcceptMission } from "@/components/missions/accept-mission";
import { PaperCard } from "@/components/ui/paper-card";
import { Stamp } from "@/components/ui/stamp";
import type { MissionDossier } from "@/lib/mission-details";
import Link from "next/link";

const statusTone = {
  "Open berth": "red" as const,
  "In the field": "navy" as const,
  Logged: "gold" as const,
  Sealed: "gold" as const,
};

export function MissionDetail({ dossier }: { dossier: MissionDossier }) {
  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/missions"
          className="text-[11px] font-medium tracking-[0.22em] text-ink-soft uppercase transition hover:text-navy"
        >
          ← Back to Mission Library
        </Link>

        <header className="mt-8">
          <p className="text-[11px] font-medium tracking-[0.32em] text-gold uppercase">
            Classified dossier · {dossier.number}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {dossier.title}
            </h1>
            <Stamp
              label={dossier.status}
              tone={statusTone[dossier.status]}
              className="mt-2"
            />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-ink/8 py-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Category
              </dt>
              <dd className="mt-1 text-ink">{dossier.category}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Difficulty
              </dt>
              <dd className="mt-1 text-ink">{dossier.difficulty}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Time
              </dt>
              <dd className="mt-1 text-ink">{dossier.time}</dd>
            </div>
          </dl>
        </header>

        <PaperCard className="mt-10 p-6 sm:p-8">
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            Mission briefing
          </p>
          <p className="mt-4 text-lg leading-8 text-ink">{dossier.briefing}</p>
          <p className="mt-5 leading-8 text-ink-soft">{dossier.experience}</p>
          <p className="mt-5 font-display text-xl italic leading-8 text-navy">
            {dossier.why}
          </p>
        </PaperCard>

        <section className="mt-12">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
            Mission objectives
          </h2>
          <ol className="mt-6 grid gap-3">
            {dossier.objectives.map((step, index) => (
              <li
                key={step}
                className="surface-lift flex gap-4 rounded-2xl border border-ink/8 bg-paper px-5 py-4"
              >
                <span className="pt-0.5 text-[11px] tracking-[0.22em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="leading-7 text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <PaperCard className="mt-12 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <Stamp label={dossier.rewardStamp} tone="gold" className="shrink-0" />
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
              Mission reward
            </p>
            <p className="mt-2 leading-7 text-ink">{dossier.reward}</p>
          </div>
        </PaperCard>

        <div className="mt-12">
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            Mission action
          </p>
          <div className="mt-4">
            <AcceptMission title={dossier.title} missionId={dossier.id} />
          </div>
        </div>

        <nav
          aria-label="Adjacent missions"
          className="mt-16 flex flex-col gap-4 border-t border-ink/8 pt-8 sm:flex-row sm:justify-between"
        >
          {dossier.previous ? (
            <Link
              href={`/missions/${dossier.previous.id}`}
              className="group max-w-xs"
            >
              <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Previous
              </p>
              <p className="mt-1 font-display text-xl text-ink group-hover:text-navy">
                {dossier.previous.number} · {dossier.previous.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {dossier.next ? (
            <Link
              href={`/missions/${dossier.next.id}`}
              className="group max-w-xs sm:text-right"
            >
              <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
                Next
              </p>
              <p className="mt-1 font-display text-xl text-ink group-hover:text-navy">
                {dossier.next.number} · {dossier.next.title}
              </p>
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
