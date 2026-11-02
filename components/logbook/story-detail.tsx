import { StoryVisual } from "@/components/logbook/story-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { PaperCard } from "@/components/ui/paper-card";
import type { LogbookStory } from "@/lib/logbook";
import { getLibraryMission } from "@/lib/mission-library";
import Link from "next/link";

export function StoryDetail({ story }: { story: LogbookStory }) {
  const mission = getLibraryMission(story.missionSlug);

  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/logbook"
          className="text-[11px] font-medium tracking-[0.22em] text-ink-soft uppercase transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
        >
          ← Back to Global Logbook
        </Link>

        <p className="mt-8 text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
          Demo field note · not a verified record
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {story.title}
        </h1>

        <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-ink/8 py-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[10px] tracking-[0.22em] text-gold-ink uppercase">
              Mission
            </dt>
            <dd className="mt-1 text-ink">{mission?.title ?? story.missionSlug}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.22em] text-gold-ink uppercase">
              Region
            </dt>
            <dd className="mt-1 text-ink">
              {story.region}, {story.country}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[10px] tracking-[0.22em] text-gold-ink uppercase">
              Logged
            </dt>
            <dd className="mt-1 text-ink">{story.date}</dd>
          </div>
        </dl>

        <StoryVisual
          visual={story.visual}
          title={story.title}
          className="mt-10 min-h-[18rem] rounded-[1.6rem]"
        />

        <div className="mt-10 space-y-6 text-lg leading-8 text-ink">
          {story.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <PaperCard className="mt-12 p-6 sm:p-8">
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
            Key cultural discoveries
          </p>
          <ul className="mt-5 space-y-3">
            {story.discoveries.map((item) => (
              <li key={item} className="leading-7 text-ink">
                {item}
              </li>
            ))}
          </ul>
        </PaperCard>

        <div className="mt-12 flex flex-wrap gap-3">
          {mission ? (
            <ButtonLink href={`/missions/${mission.id}`}>
              Open related mission
            </ButtonLink>
          ) : null}
          <ButtonLink href="/logbook" variant="secondary">
            Return to logbook
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
