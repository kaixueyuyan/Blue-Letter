import { StoryVisual } from "@/components/logbook/story-visual";
import { ButtonLink } from "@/components/ui/button-link";
import type { LogbookStory } from "@/lib/logbook";
import { getLibraryMission } from "@/lib/mission-library";

export function FeaturedExpeditions({ stories }: { stories: LogbookStory[] }) {
  const [cover, second] = stories;

  if (!cover) return null;

  return (
    <section>
      <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
        Cover stories · fictional archive
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        Featured expeditions
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-ink-soft">
        Magazine pages for the logbook. These notes are composed for the demo.
        They are not verified records of real crews.
      </p>

      <article className="surface-lift mt-10 overflow-hidden rounded-[1.6rem] border border-ink/8 bg-navy lg:grid lg:grid-cols-2">
        <StoryVisual
          visual={cover.visual}
          title={cover.title}
          className="min-h-[22rem] lg:min-h-full"
        />
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">
            Lead dispatch · {cover.date}
          </p>
          <h3 className="mt-3 font-display text-4xl font-medium tracking-tight text-ivory">
            {cover.title}
          </h3>
          <p className="mt-3 text-sm text-ivory/70">
            {getLibraryMission(cover.missionSlug)?.title} · {cover.region}
          </p>
          <p className="mt-6 text-lg leading-8 text-ivory/85">{cover.summary}</p>
          <div className="mt-8">
            <ButtonLink href={`/logbook/${cover.slug}`} variant="onDark">
              Read field notes
            </ButtonLink>
          </div>
        </div>
      </article>

      {second ? (
        <article className="mt-8 grid gap-8 border-t border-ink/8 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-gold-ink uppercase">
              Second plate · {second.date}
            </p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink">
              {second.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {getLibraryMission(second.missionSlug)?.title} · {second.region}
            </p>
            <p className="mt-5 max-w-xl leading-8 text-ink">{second.summary}</p>
            <ButtonLink
              href={`/logbook/${second.slug}`}
              variant="secondary"
              className="mt-6"
            >
              Read field notes
            </ButtonLink>
          </div>
          <StoryVisual
            visual={second.visual}
            title={second.title}
            className="min-h-[16rem] rounded-[1.6rem]"
          />
        </article>
      ) : null}
    </section>
  );
}
