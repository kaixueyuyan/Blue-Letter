import { ButtonLink } from "@/components/ui/button-link";
import { CompassRose, WorldMap } from "@/components/ui/world-map";
import { Stamp } from "@/components/ui/stamp";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-navy">
        <WorldMap className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/55 to-navy" />
      </div>
      <div className="pointer-events-none absolute -right-6 top-16 hidden w-44 opacity-50 md:block">
        <CompassRose className="h-44 w-44" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="max-w-3xl">
          <p className="animate-ink text-[11px] font-medium tracking-[0.42em] text-gold uppercase">
            Passport of a shared planet
          </p>
          <h1 className="animate-ink mt-6 font-display text-[clamp(3.4rem,10vw,7.4rem)] leading-[0.86] font-medium tracking-tight text-ivory">
            <span className="block">Blue Letter</span>
            <span className="mt-2 block text-[0.58em] text-ivory/70">
              World Expedition
            </span>
          </h1>
          <p className="animate-ink mt-8 max-w-xl font-display text-2xl italic text-ivory/75 sm:text-3xl">
            “A Real Adventure Across Continents”
          </p>
          <p className="animate-ink mt-6 max-w-lg text-base leading-8 text-ivory/65 sm:text-lg">
            Rural Chinese children and overseas volunteers complete the same
            missions from two latitudes. The letter is the voyage.
          </p>
          <div className="animate-ink mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#join" variant="onDark">
              Join the Expedition
            </ButtonLink>
            <ButtonLink
              href="#missions"
              className="border-ivory/20 bg-transparent text-ivory hover:border-gold hover:text-ivory"
              variant="secondary"
            >
              Explore Missions
            </ButtonLink>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-xs lg:mt-20">
          <div className="rounded-[1.5rem] border border-ivory/12 bg-ivory/8 p-6 text-ivory backdrop-blur-md">
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase">
              Entry visa · mock log
            </p>
            <p className="mt-4 font-display text-2xl leading-8 italic text-ivory/90">
              Hold this page to the light. If you can still read it, you are
              already on the crew list.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Stamp
                label="Yunnan"
                tone="gold"
                className="border-ivory/25 bg-ivory/10 text-ivory"
              />
              <Stamp
                label="Cleared"
                tone="gold"
                className="border-ivory/25 bg-ivory/10 text-ivory"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
