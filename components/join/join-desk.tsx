"use client";

import { cn } from "@/lib/cn";
import { useState, type FormEvent, type ReactNode } from "react";

type Path = "volunteer" | "organization";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-ink/12 bg-ivory px-4 py-3 text-base leading-6 text-ink outline-none transition placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink";

function choiceClass(selected: boolean, tone: "navy" | "gold") {
  return cn(
    "flex h-full flex-col rounded-[1.6rem] border bg-paper px-6 py-7 text-left transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink",
    selected
      ? tone === "gold"
        ? "border-gold shadow-[0_24px_50px_-32px_rgba(184,154,92,0.7)]"
        : "border-navy shadow-[0_24px_50px_-32px_rgba(11,28,61,0.65)]"
      : "border-ink/10 hover:border-navy/30",
  );
}

export function JoinDesk({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<Path>("volunteer");

  function choose(next: Path) {
    setPath(next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("application")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="px-5 py-20 sm:px-8" aria-labelledby="path-title">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
            Choose your path
          </p>
          <h2
            id="path-title"
            className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
          >
            Two ways onto the roster
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2" role="group" aria-label="Application path">
            <button
              type="button"
              className={choiceClass(path === "volunteer", "navy")}
              aria-pressed={path === "volunteer"}
              onClick={() => choose("volunteer")}
            >
              <span className="text-[11px] tracking-[0.28em] text-navy uppercase">
                Adult volunteer · 18 and older
              </span>
              <span className="mt-4 font-display text-4xl text-ink">
                Volunteer Explorer
              </span>
              <span className="mt-3 leading-7 text-ink-soft">
                For an adult who wants a berth beside a partner classroom.
                This path asks you to confirm you are 18 or older. It does not
                ask for a date of birth.
              </span>
            </button>
            <button
              type="button"
              className={choiceClass(path === "organization", "gold")}
              aria-pressed={path === "organization"}
              onClick={() => choose("organization")}
            >
              <span className="text-[11px] tracking-[0.28em] text-gold-ink uppercase">
                School, nonprofit, or classroom
              </span>
              <span className="mt-4 font-display text-4xl text-ink">
                Partner Organization
              </span>
              <span className="mt-3 leading-7 text-ink-soft">
                For a school, nonprofit, or educational organization that would
                supervise participation, including any work with minors.
              </span>
            </button>
          </div>
        </div>
      </section>
      {children}
      <ApplicationForm path={path} />
    </>
  );
}

function ApplicationForm({ path }: { path: Path }) {
  function hold(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      id="application"
      className="scroll-mt-36 px-5 py-16 sm:px-8"
      aria-labelledby="application-title"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
          Application preview
        </p>
        <h2
          id="application-title"
          className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
        >
          {path === "volunteer" ? "Volunteer Explorer" : "Partner Organization"}
        </h2>
        <p className="mt-4 leading-8 text-ink-soft" role="status">
          Applications opening soon. This is a non-submitting preview. Nothing
          you type is sent or saved in this browser.
        </p>
        <form
          key={path}
          className="surface-lift mt-8 rounded-[1.6rem] border border-ink/8 bg-paper px-5 py-7 sm:px-8"
          onSubmit={hold}
          noValidate
        >
          {path === "volunteer" ? <VolunteerFields /> : <OrganizationFields />}
          <button
            type="submit"
            disabled
            aria-describedby="application-hold"
            className="mt-8 inline-flex cursor-not-allowed items-center justify-center rounded-full bg-navy px-8 py-3.5 text-[12px] font-medium tracking-[0.18em] text-ivory uppercase opacity-50"
          >
            Submit application
          </button>
          <p id="application-hold" className="mt-4 text-sm leading-7 text-ink-soft">
            Applications opening soon. The button stays off until a real
            submission provider is connected.
          </p>
        </form>
      </div>
    </section>
  );
}

function Label({ id, children }: { id: string; children: ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="text-[11px] font-medium tracking-[0.18em] text-gold-ink uppercase"
    >
      {children}
    </label>
  );
}

function VolunteerFields() {
  return (
    <div className="grid gap-5">
      <div>
        <Label id="preferred-name">Preferred name</Label>
        <input id="preferred-name" name="preferredName" autoComplete="name" className={fieldClass} />
      </div>
      <div>
        <Label id="email">Email address</Label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className={fieldClass} />
      </div>
      <div>
        <Label id="region">Country or region</Label>
        <input
          id="region"
          name="region"
          autoComplete="country-name"
          placeholder="A country or region, not a street address"
          className={fieldClass}
        />
      </div>
      <div className="flex gap-3 rounded-2xl border border-ink/10 bg-ivory px-4 py-3">
        <input
          id="age-18"
          name="ageEligible"
          type="checkbox"
          className="mt-1 h-4 w-4 accent-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
        />
        <label htmlFor="age-18" className="text-sm leading-6 text-ink">
          I confirm that I am 18 or older. This form does not ask for a date of
          birth, and it is not a registration for anyone under 18.
        </label>
      </div>
      <div>
        <Label id="languages">Languages spoken</Label>
        <input id="languages" name="languages" className={fieldClass} />
      </div>
      <div>
        <Label id="why">Why would you like to join Blue Letter?</Label>
        <textarea id="why" name="why" rows={5} className={fieldClass} />
      </div>
      <div>
        <Label id="experience">Relevant experience (optional)</Label>
        <textarea id="experience" name="experience" rows={4} className={fieldClass} />
      </div>
      <div>
        <Label id="availability">General availability (optional)</Label>
        <input id="availability" name="availability" className={fieldClass} />
      </div>
      <Consent id="volunteer-consent" />
    </div>
  );
}

function OrganizationFields() {
  return (
    <div className="grid gap-5">
      <div>
        <Label id="organization-name">Organization name</Label>
        <input id="organization-name" name="organizationName" autoComplete="organization" className={fieldClass} />
      </div>
      <div>
        <Label id="contact-name">Contact person&apos;s name</Label>
        <input id="contact-name" name="contactName" autoComplete="name" className={fieldClass} />
      </div>
      <div>
        <Label id="work-email">Professional email</Label>
        <input id="work-email" name="email" type="email" autoComplete="email" inputMode="email" className={fieldClass} />
      </div>
      <div>
        <Label id="org-region">Country or region</Label>
        <input
          id="org-region"
          name="region"
          autoComplete="country-name"
          placeholder="A country or region, not a street address"
          className={fieldClass}
        />
      </div>
      <div>
        <Label id="organization-type">Organization type</Label>
        <select id="organization-type" name="organizationType" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select a type
          </option>
          <option>School</option>
          <option>Nonprofit</option>
          <option>Educational organization</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <Label id="collaboration">Proposed collaboration</Label>
        <textarea id="collaboration" name="collaboration" rows={5} className={fieldClass} />
      </div>
      <Consent id="organization-consent" />
    </div>
  );
}

function Consent({ id }: { id: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-ink/10 bg-ivory px-4 py-3">
      <input
        id={id}
        name="consent"
        type="checkbox"
        className="mt-1 h-4 w-4 accent-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
      />
      <label htmlFor={id} className="text-sm leading-6 text-ink">
        I agree to be contacted about this application once applications open.
        This preview does not contact anyone.
      </label>
    </div>
  );
}
