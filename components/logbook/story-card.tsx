import { StoryVisual } from "@/components/logbook/story-visual";
import { PaperCard } from "@/components/ui/paper-card";
import { cn } from "@/lib/cn";
import type { LogbookStory } from "@/lib/logbook";
import { getLibraryMission } from "@/lib/mission-library";
import Link from "next/link";

export function StoryCard({
  story,
  highlighted = false,
}: {
  story: LogbookStory;
  highlighted?: boolean;
}) {
  const mission = getLibraryMission(story.missionSlug);

  return (
    <div id={`story-${story.slug}`}>
    <PaperCard
      className={cn(
        "flex h-full flex-col p-0",
        highlighted && "ring-1 ring-gold/70",
      )}
    >
      <StoryVisual visual={story.visual} title={story.title} />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] tracking-[0.22em] text-gold-ink uppercase">
          Demo field note · {story.date}
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
          {story.title}
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          {mission?.title ?? story.missionSlug} · {story.region}
        </p>
        <p className="mt-4 flex-1 leading-7 text-ink">{story.summary}</p>
        <Link
          href={`/logbook/${story.slug}`}
          className="mt-6 inline-flex text-[11px] font-medium tracking-[0.22em] text-navy uppercase transition hover:text-gold-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
        >
          Read field notes →
        </Link>
      </div>
    </PaperCard>
    </div>
  );
}
