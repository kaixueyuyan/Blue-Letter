import { SectionHeading } from "@/components/ui/section-heading";

const experience = [
  {
    number: "01",
    title: "Shared missions",
    copy: "A volunteer and a partner classroom work the same brief from two places. The assignment is the meeting point.",
  },
  {
    number: "02",
    title: "An exchange of perspectives",
    copy: "Each side answers from its own street, kitchen, or schoolyard. The point is the difference, kept intact.",
  },
  {
    number: "03",
    title: "Field reports",
    copy: "When a mission is ready, the crew writes what was made or found. A report is reviewed before any stamp is earned.",
  },
  {
    number: "04",
    title: "A global logbook",
    copy: "Accepted work can be retold, without real names or exact addresses, in the expedition’s shared logbook.",
  },
];

const steps = [
  {
    number: "01",
    title: "Apply",
    copy: "An adult volunteer or an organization contact previews the form that will open later.",
  },
  {
    number: "02",
    title: "Application review",
    copy: "A person reads the application. A form on a website is not an acceptance letter.",
  },
  {
    number: "03",
    title: "Orientation",
    copy: "Accepted applicants learn how missions, supervision, and the logbook actually work.",
  },
  {
    number: "04",
    title: "Supervised participation",
    copy: "Work with minors happens only through an authorized partner organization, with that organization supervising.",
  },
];

export function ExpeditionExperience() {
  return (
    <section className="px-5 py-20 sm:px-8" aria-labelledby="experience-title">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience-title"
          eyebrow="The expedition experience"
          title="The same mission, two latitudes"
          kicker="Participants collaborate on a brief, trade what they notice, file a field report, and add to a logbook that more than one place can read."
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {experience.map((item) => (
            <li
              key={item.number}
              className="surface-lift rounded-[1.6rem] border border-ink/8 bg-paper px-6 py-7"
            >
              <p className="text-[11px] tracking-[0.28em] text-gold-ink uppercase">
                {item.number}
              </p>
              <h3 className="mt-3 font-display text-3xl text-ink">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-ink-soft">{item.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HowJoiningWorks() {
  return (
    <section className="px-5 pb-4 sm:px-8" aria-labelledby="joining-title">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="joining-title"
          eyebrow="How joining works"
          title="A review sits between the form and the field"
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.6rem] border border-ink/8 bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="bg-paper px-6 py-7">
              <p className="font-display text-4xl text-navy">{step.number}</p>
              <h3 className="mt-4 font-display text-2xl text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl leading-7 text-ink-soft">
          Submitting an application does not guarantee acceptance. Until the
          roster opens, the form below is a preview and does not submit.
        </p>
      </div>
    </section>
  );
}

export function SafetyNotice() {
  return (
    <section className="px-5 py-20 sm:px-8" aria-labelledby="safety-title">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] border border-ink/8 bg-paper px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
            Safety
          </p>
          <h2
            id="safety-title"
            className="mt-3 font-display text-4xl font-medium tracking-tight text-ink"
          >
            Children do not register here.
          </h2>
          <p className="mt-4 leading-8 text-ink-soft">
            This page is for adult volunteers, aged 18 and older, and for
            schools, nonprofits, and educational organizations. It does not
            create a child account, collect a minor’s name or contact details,
            or open a conversation between a volunteer and a child.
          </p>
          <p className="mt-4 leading-8 text-ink-soft">
            Participation that involves minors is arranged and supervised by an
            authorized partner organization.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
            Privacy notice
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
            What a future application will ask
          </h2>
          <p className="mt-4 leading-8 text-ink-soft">
            When applications open, Blue Letter will ask for a preferred name
            or organization contact, an email address, a country or region, and
            a short reason for joining. Those details are for reviewing an
            application and writing back about it. An exact street address is
            not required.
          </p>
          <p className="mt-4 leading-8 text-ink-soft">
            This preview does not send or save what you type. The note above is
            a plain description of the prototype, not a legal privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
