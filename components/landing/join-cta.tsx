import { ButtonLink } from "@/components/ui/button-link";
import { Stamp } from "@/components/ui/stamp";

export function JoinCta() {
  return (
    <section id="join" className="scroll-mt-44 px-5 py-20 sm:px-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-ivory/10 bg-navy px-8 py-16 text-ivory sm:px-14">
        <span
          aria-hidden
          className="gold-rule absolute inset-x-8 top-0 h-px"
        />
        <p className="text-[11px] font-medium tracking-[0.34em] text-gold uppercase">
          Next departure · spring roster
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Join the expedition
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-ivory/70">
          Crew applications and school partnerships will open here. For now the
          logbook is paper: missions, stamps, and the promise of a letter that
          actually goes somewhere.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="#missions" variant="onDark">
            Read the mission board
          </ButtonLink>
          <span className="font-display text-xl italic text-ivory/75">
            Curiosity is the only visa required today.
          </span>
        </div>
        <Stamp
          label="Hold for crew"
          tone="gold"
          className="absolute right-8 bottom-8 hidden border-ivory/25 bg-ivory/10 text-ivory sm:inline-flex"
        />
      </div>
    </section>
  );
}
