"use client";

import { cn } from "@/lib/cn";
import {
  isFormspreeId,
  submitJoinApplication,
  validateJoinApplication,
  type JoinPath,
} from "@/lib/join-application";
import { useState, type FormEvent, type ReactNode } from "react";

type Path = JoinPath;
type SendState = "idle" | "loading" | "success" | "error";

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

export function JoinDesk({
  children,
  volunteerFormId,
  organizationFormId,
}: {
  children: ReactNode;
  volunteerFormId?: string;
  organizationFormId?: string;
}) {
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
      <ApplicationForm
        key={path}
        path={path}
        formId={path === "volunteer" ? volunteerFormId : organizationFormId}
      />
    </>
  );
}

function ApplicationForm({ path, formId }: { path: Path; formId?: string }) {
  const configured = isFormspreeId(formId);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendState === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validateJoinApplication(path, data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSendState("error");
      setMessage("Check the highlighted fields and try again.");
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    if (!configured || !formId) {
      setSendState("error");
      setMessage("This form is not ready to send yet.");
      return;
    }

    setSendState("loading");
    setMessage("");
    const result = await submitJoinApplication(formId, data);
    if (result.ok) {
      form.reset();
      setErrors({});
      setSendState("success");
      setMessage(
        "Formspree confirmed that this form was received. That confirmation is not an acceptance into the expedition.",
      );
      return;
    }
    setSendState("error");
    setMessage(result.message);
  }

  return (
    <section
      id="application"
      className="scroll-mt-36 px-5 py-16 sm:px-8"
      aria-labelledby="application-title"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
          Application
        </p>
        <h2
          id="application-title"
          className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
        >
          {path === "volunteer" ? "Volunteer Explorer" : "Partner Organization"}
        </h2>
        <p className="mt-4 leading-8 text-ink-soft">
          {configured
            ? "Send the form when it is complete. A confirmed receipt is not an acceptance, and this browser does not save what you type. A legal privacy policy is not published on this page yet."
            : "This form is not ready to send yet. Nothing you type is saved in this browser."}
        </p>
        {sendState === "success" ? (
          <p
            className="surface-lift mt-8 rounded-[1.6rem] border border-ink/8 bg-paper px-5 py-7 text-lg leading-8 text-ink sm:px-8"
            role="status"
          >
            {message}
          </p>
        ) : (
          <form
            className="surface-lift relative mt-8 rounded-[1.6rem] border border-ink/8 bg-paper px-5 py-7 sm:px-8"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={`${path}-gotcha`}>Leave this field empty</label>
              <input id={`${path}-gotcha`} name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <input
              type="hidden"
              name="_subject"
              value={path === "volunteer" ? "Volunteer application" : "Partner organization application"}
            />
            {path === "volunteer" ? (
              <VolunteerFields errors={errors} />
            ) : (
              <OrganizationFields errors={errors} />
            )}
            <button
              type="submit"
              disabled={!configured || sendState === "loading"}
              aria-busy={sendState === "loading"}
              aria-describedby="application-status"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-navy px-8 py-3.5 text-[12px] font-medium tracking-[0.18em] text-ivory uppercase shadow-[0_16px_32px_-18px_rgba(11,28,61,0.85)] transition hover:bg-air-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendState === "loading" ? "Sending application" : "Submit application"}
            </button>
            <p
              id="application-status"
              className={cn(
                "mt-4 text-sm leading-7",
                sendState === "error" ? "text-air-red" : "text-ink-soft",
              )}
              role="status"
            >
              {message ||
                (configured
                  ? "Submitting an application does not guarantee acceptance."
                  : "The send button stays off until the form endpoint is configured.")}
            </p>
          </form>
        )}
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

function VolunteerFields({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="grid gap-5">
      <TextField id="preferred-name" name="preferredName" label="Preferred name" autoComplete="name" error={errors["preferred-name"]} required />
      <TextField id="email" name="email" label="Email address" type="email" autoComplete="email" inputMode="email" error={errors.email} required />
      <TextField
        id="region"
        name="region"
        label="Country or region"
        autoComplete="country-name"
        placeholder="A country or region, not a street address"
        error={errors.region}
        required
      />
      <CheckField
        id="age-18"
        name="ageEligible"
        error={errors["age-18"]}
        label="I confirm that I am 18 or older. This form does not ask for a date of birth, and it is not a registration for anyone under 18."
      />
      <TextField id="languages" name="languages" label="Languages spoken" error={errors.languages} required />
      <TextField id="why" name="why" label="Why would you like to join Blue Letter?" rows={5} error={errors.why} required />
      <TextField id="experience" name="experience" label="Relevant experience (optional)" rows={4} />
      <TextField id="availability" name="availability" label="General availability (optional)" />
      <CheckField
        id="volunteer-consent"
        name="consent"
        error={errors["volunteer-consent"]}
        label="I agree to be contacted about this application. Sending the form is not an acceptance."
      />
    </div>
  );
}

function OrganizationFields({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="grid gap-5">
      <TextField id="organization-name" name="organizationName" label="Organization name" autoComplete="organization" error={errors["organization-name"]} required />
      <TextField id="contact-name" name="contactName" label="Contact person's name" autoComplete="name" error={errors["contact-name"]} required />
      <TextField id="work-email" name="email" label="Professional email" type="email" autoComplete="email" inputMode="email" error={errors["work-email"]} required />
      <TextField
        id="org-region"
        name="region"
        label="Country or region"
        autoComplete="country-name"
        placeholder="A country or region, not a street address"
        error={errors["org-region"]}
        required
      />
      <div>
        <Label id="organization-type">Organization type</Label>
        <select
          id="organization-type"
          name="organizationType"
          defaultValue=""
          aria-invalid={Boolean(errors["organization-type"])}
          aria-describedby={errors["organization-type"] ? "organization-type-error" : undefined}
          className={controlClass(Boolean(errors["organization-type"]))}
          required
        >
          <option value="">Select a type</option>
          <option>School</option>
          <option>Nonprofit</option>
          <option>Educational organization</option>
          <option>Other</option>
        </select>
        <FieldError id="organization-type" message={errors["organization-type"]} />
      </div>
      <TextField id="collaboration" name="collaboration" label="Proposed collaboration" rows={5} error={errors.collaboration} required />
      <CheckField
        id="organization-consent"
        name="consent"
        error={errors["organization-consent"]}
        label="I agree to be contacted about this application. Sending the form is not an acceptance."
      />
    </div>
  );
}

function TextField({
  id,
  name,
  label,
  error,
  required,
  rows,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "text";
  placeholder?: string;
}) {
  const invalid = Boolean(error);
  const describedBy = invalid ? `${id}-error` : undefined;
  return (
    <div>
      <Label id={id}>{label}</Label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={controlClass(invalid)}
        />
      )}
      <FieldError id={id} message={error} />
    </div>
  );
}

function CheckField({
  id,
  name,
  label,
  error,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <div className={cn("flex gap-3 rounded-2xl border bg-ivory px-4 py-3", error ? "border-air-red" : "border-ink/10")}>
        <input
          id={id}
          name={name}
          type="checkbox"
          value="yes"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 accent-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
        />
        <label htmlFor={id} className="text-sm leading-6 text-ink">
          {label}
        </label>
      </div>
      <FieldError id={id} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-2 text-sm leading-6 text-air-red">
      {message}
    </p>
  );
}

function controlClass(invalid: boolean) {
  return cn(fieldClass, invalid && "border-air-red");
}
