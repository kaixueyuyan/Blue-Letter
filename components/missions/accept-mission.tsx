"use client";

import { usePassport } from "@/components/passport/use-passport";
import {
  formatStampDate,
  isFieldReportReady,
  type FieldAttachment,
  type FieldReport,
} from "@/lib/passport";
import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

const actionButton =
  "inline-flex items-center justify-center rounded-full bg-navy px-8 py-3.5 text-[12px] font-medium tracking-[0.18em] text-ivory uppercase shadow-[0_16px_32px_-18px_rgba(11,28,61,0.85)] transition hover:bg-air-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink disabled:cursor-not-allowed disabled:opacity-50";

const textLink =
  "text-[11px] font-medium tracking-[0.22em] text-navy uppercase transition hover:text-gold-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-ink/12 bg-ivory px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink";

export function AcceptMission({
  title,
  missionId,
}: {
  title: string;
  missionId: string;
}) {
  const { ready, missions, statusOf, accept, submitReport, confirmPartner, approveReview } =
    usePassport();
  const [writing, setWriting] = useState(false);
  const [reflection, setReflection] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [attachment, setAttachment] = useState<FieldAttachment | null>(null);
  const [error, setError] = useState("");

  if (!ready) {
    return (
      <p className="text-[11px] tracking-[0.22em] text-ink-soft uppercase">
        Checking log…
      </p>
    );
  }

  const status = statusOf(missionId);
  const entry = missions[missionId];

  function onAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAttachment({
      name: file.name.slice(0, 120),
      type: file.type || "unknown",
      size: file.size,
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFieldReportReady(reflection, discovery)) {
      setError("Add both a reflection and a note on what was made or found.");
      return;
    }
    setError("");
    submitReport(missionId, {
      reflection,
      discovery,
      ...(attachment ? { attachment } : {}),
    });
    setWriting(false);
  }

  if (status === "verified") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-gold/40 bg-gold/10 px-6 py-5"
      >
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
          Verified
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          {title} is stamped in your passport.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          {`Verified ${entry?.verifiedAt ? formatStampDate(entry.verifiedAt) : "recently"}. The stamp unlocked only after the demo partner confirmation and HQ review. This browser did not send the report anywhere.`}
        </p>
        {entry?.report ? <ReportSummary report={entry.report} /> : null}
        <Link href="/passport" className={`mt-4 inline-flex ${textLink}`}>
          Open Expedition Passport →
        </Link>
      </div>
    );
  }

  if (status === "pending-admin") {
    return (
      <div className="rounded-2xl border border-navy/15 bg-paper px-6 py-5">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
          Pending admin review
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          The partner has confirmed this report.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          Expedition HQ still has to review it. The passport stamp stays locked
          until that review is marked verified.
        </p>
        {entry?.report ? <ReportSummary report={entry.report} /> : null}
        <DemoVerification
          actionLabel="Simulate admin review"
          detail="Pretend Expedition HQ has read the report and approved the stamp. Nothing leaves this browser."
          onAction={() => approveReview(missionId)}
        />
      </div>
    );
  }

  if (status === "pending-partner") {
    return (
      <div role="status" className="rounded-2xl border border-navy/15 bg-paper px-6 py-5">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
          Pending partner confirmation
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          Field report received.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          The report is waiting for the expedition partner. It is stored in
          this browser only, and the stamp stays locked.
        </p>
        {entry?.report ? <ReportSummary report={entry.report} /> : null}
        <DemoVerification
          actionLabel="Simulate partner confirmation"
          detail="Pretend the counterpart has read the field report and confirmed it. The next stop is a demo HQ review."
          onAction={() => confirmPartner(missionId)}
        />
      </div>
    );
  }

  if (status === "in-progress") {
    return (
      <div className="rounded-2xl border border-navy/15 bg-paper px-6 py-5">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
          In progress
        </p>
        <p className="mt-2 font-display text-2xl text-navy">
          {title} is on your berth.
        </p>
        <p className="mt-2 leading-7 text-ink-soft">
          Write the field report when the shared work is ready. Submitting
          does not unlock the stamp. A partner and Expedition HQ still have to
          confirm it.
        </p>
        {writing ? (
          <form className="mt-6" onSubmit={onSubmit}>
            <p className="font-display text-2xl text-navy">{title}</p>
            <label className="mt-5 block text-[11px] font-medium tracking-[0.18em] text-gold-ink uppercase">
              Written reflection
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                rows={5}
                maxLength={2000}
                required
                className={fieldClass}
                placeholder="What did the exchange ask of you?"
              />
            </label>
            <label className="mt-4 block text-[11px] font-medium tracking-[0.18em] text-gold-ink uppercase">
              What was created or discovered
              <textarea
                value={discovery}
                onChange={(event) => setDiscovery(event.target.value)}
                rows={4}
                maxLength={2000}
                required
                className={fieldClass}
                placeholder="Name the object, phrase, hour, or mistake that mattered."
              />
            </label>
            <div className="mt-4">
              <p className="text-[11px] font-medium tracking-[0.18em] text-gold-ink uppercase">
                Optional demo attachment
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                Choose a file to record its name and size only. The file itself
                is not uploaded or saved.
              </p>
              <input
                type="file"
                onChange={onAttachment}
                className="mt-3 block w-full text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[11px] file:tracking-[0.16em] file:text-ivory file:uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
              />
              {attachment ? (
                <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink">
                  <span>
                    {attachment.name} · {formatBytes(attachment.size)} · not
                    uploaded
                  </span>
                  <button
                    type="button"
                    className={textLink}
                    onClick={() => setAttachment(null)}
                  >
                    Remove
                  </button>
                </p>
              ) : null}
            </div>
            {error ? (
              <p className="mt-3 text-sm text-air-red" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button type="submit" className={actionButton}>
                Submit field report
              </button>
              <button
                type="button"
                className={textLink}
                onClick={() => setWriting(false)}
              >
                Close
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className={actionButton}
              onClick={() => setWriting(true)}
            >
              Submit field report
            </button>
            <Link href="/passport" className={textLink}>
              Open Expedition Passport →
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <button type="button" onClick={() => accept(missionId)} className={actionButton}>
      Accept Mission
    </button>
  );
}

function ReportSummary({ report }: { report: FieldReport }) {
  return (
    <div className="mt-4 border-t border-ink/8 pt-4 text-sm leading-6 text-ink">
      <p className="text-[11px] tracking-[0.18em] text-gold-ink uppercase">
        Saved in this browser · {formatStampDate(report.submittedAt)}
      </p>
      <p className="mt-2">{report.reflection}</p>
      <p className="mt-2 text-ink-soft">{report.discovery}</p>
      {report.attachment ? (
        <p className="mt-2 text-ink-soft">
          Attachment noted, not stored: {report.attachment.name} ·{" "}
          {formatBytes(report.attachment.size)}
        </p>
      ) : null}
    </div>
  );
}

function DemoVerification({
  actionLabel,
  detail,
  onAction,
}: {
  actionLabel: string;
  detail: string;
  onAction: () => void;
}) {
  return (
    <aside className="mt-6 rounded-2xl border border-dashed border-gold/55 bg-ivory px-5 py-4">
      <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
        Demo verification panel
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{detail}</p>
      <button type="button" className={`${actionButton} mt-4`} onClick={onAction}>
        {actionLabel}
      </button>
    </aside>
  );
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / 104857.6) / 10} MB`;
}
