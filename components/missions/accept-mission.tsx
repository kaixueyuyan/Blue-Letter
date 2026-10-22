"use client";

import { usePassport } from "@/components/passport/use-passport";
import { formatStampDate } from "@/lib/passport";
import Link from "next/link";

export function AcceptMission({
  title,
  missionId,
}: {
  title: string;
  missionId: string;
}) {
  const { ready, missions, statusOf, accept, complete } = usePassport();

  if (!ready) {
    return (
      <p className="text-[11px] tracking-[0.22em] text-ink-soft uppercase">
        Checking log…
      </p>
    );
  }

  const status = statusOf(missionId);
  const entry = missions[missionId];

  if (status === "completed") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-gold/40 bg-gold/10 px-6 py-5"
      >
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
          Completed · demo log
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          {title} is stamped in your passport.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          {`Logged ${entry?.completedAt ? formatStampDate(entry.completedAt) : "recently"}. This is a local demonstration mark, not verified completion of a real mission.`}
        </p>
        <Link
          href="/passport"
          className="mt-4 inline-flex text-[11px] font-medium tracking-[0.22em] text-navy uppercase transition hover:text-gold"
        >
          Open Expedition Passport →
        </Link>
      </div>
    );
  }

  if (status === "in-progress") {
    return (
      <div className="rounded-2xl border border-navy/15 bg-paper px-6 py-5">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
          In progress
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          {title} is on your berth.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          Expedition HQ has your interest. Counterpart matching is not open
          yet — this is a confirmation only, not an enrollment. The passport
          stamp stays locked until you mark a demo completion.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => complete(missionId)}
            className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-3.5 text-[12px] font-medium tracking-[0.18em] text-ivory uppercase shadow-[0_16px_32px_-18px_rgba(11,28,61,0.85)] transition hover:bg-air-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Mark as completed
          </button>
          <Link
            href="/passport"
            className="text-[11px] font-medium tracking-[0.22em] text-navy uppercase transition hover:text-gold"
          >
            Open Expedition Passport →
          </Link>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          Demo only. Marking complete does not verify that the mission was
          actually finished.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => accept(missionId)}
      className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-3.5 text-[12px] font-medium tracking-[0.18em] text-ivory uppercase shadow-[0_16px_32px_-18px_rgba(11,28,61,0.85)] transition hover:bg-air-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      Accept Mission
    </button>
  );
}
