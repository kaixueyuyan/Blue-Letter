import { expeditionSteps } from "@/lib/missions";
import { PaperCard } from "@/components/ui/paper-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stamp } from "@/components/ui/stamp";

export function ExpeditionBrief() {
  return (
    <section id="brief" className="relative scroll-mt-44 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How a crew is formed"
          title="Participants from around the world complete missions together."
          kicker="This is not a donation page. It is a shared assignment: children in rural China and volunteers overseas work the same brief, then mail the evidence until one story exists in two places."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PaperCard className="p-7 sm:p-10">
            <p className="font-display text-2xl italic text-navy">
              Field note — pinned to the inside cover
            </p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink">
              A mission begins when two people who will likely never meet agree
              to notice the same hour of Earth. One writes from a mountain
              classroom. The other writes from a rented kitchen, a night bus,
              a city park. The expedition is the space between those two desks.
            </p>
            <Stamp label="Field rule" tone="gold" className="mt-8" />
          </PaperCard>

          <ol className="grid gap-4">
            {expeditionSteps.map((step) => (
              <li
                key={step.numeral}
                className="surface-lift flex gap-4 rounded-2xl border border-ink/8 bg-paper px-5 py-5"
              >
                <span className="pt-1 text-[11px] tracking-[0.22em] text-gold">
                  {step.numeral}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
