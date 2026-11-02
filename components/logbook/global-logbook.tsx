"use client";

import { ExpeditionMap } from "@/components/logbook/expedition-map";
import { FeaturedExpeditions } from "@/components/logbook/featured-expeditions";
import { StoryCard } from "@/components/logbook/story-card";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import {
  getFeaturedStories,
  logbookMissionFilters,
  logbookRegions,
  logbookStories,
} from "@/lib/logbook";
import { useMemo, useState } from "react";

const missionFilters = [
  { id: "all", label: "All stories" },
  ...logbookMissionFilters(),
];

const regionFilters = [
  { id: "all", label: "All regions" },
  ...logbookRegions().map((region) => ({ id: region, label: region })),
];

export function GlobalLogbook() {
  const [mission, setMission] = useState("all");
  const [region, setRegion] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const featured = getFeaturedStories();

  const stories = useMemo(
    () =>
      logbookStories.filter(
        (story) =>
          (mission === "all" || story.missionSlug === mission) &&
          (region === "all" || story.region === region),
      ),
    [mission, region],
  );

  function selectFromMap(slug: string | null) {
    setSelectedSlug(slug);
    if (slug) {
      setMission("all");
      setRegion("all");
    }
  }

  function revealInGallery(slug: string) {
    setSelectedSlug(slug);
    setMission("all");
    setRegion("all");
    requestAnimationFrame(() => {
      document.getElementById(`story-${slug}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium tracking-[0.32em] text-gold-ink uppercase">
          Global logbook · demonstration archive
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl">
          Field notes from two latitudes
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          A curated cabinet of fictional exchanges: rural Chinese field
          correspondents and overseas volunteers completing the same brief.
          Curiosity, not charity. Nothing here is a verified student record.
        </p>

        <div className="mt-14">
          <FeaturedExpeditions stories={featured} />
        </div>

        <div className="mt-16">
          <ExpeditionMap
            selectedSlug={selectedSlug}
            onSelect={selectFromMap}
            onRevealInGallery={revealInGallery}
          />
        </div>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-gold-ink uppercase">
                Gallery
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
                Expedition stories
              </h2>
            </div>
            <p className="text-[11px] tracking-[0.22em] text-ink-soft uppercase">
              {String(stories.length).padStart(2, "0")} demo notes
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="overflow-x-auto pb-1">
              <SegmentedTabs
                items={missionFilters}
                value={mission}
                onChange={(id) => {
                  setMission(id);
                  if (id === "all") setRegion("all");
                  setSelectedSlug(null);
                }}
                className="w-max"
              />
            </div>
            <div className="overflow-x-auto pb-1">
              <SegmentedTabs
                items={regionFilters}
                value={region}
                onChange={(id) => {
                  setRegion(id);
                  setSelectedSlug(null);
                }}
                className="w-max"
              />
            </div>
          </div>

          {stories.length === 0 ? (
            <p className="mt-10 text-ink-soft">
              No field notes match these filters. Choose All stories.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  highlighted={selectedSlug === story.slug}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
