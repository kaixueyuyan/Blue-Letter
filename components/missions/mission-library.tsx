"use client";

import { LibraryCard } from "@/components/missions/library-card";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { libraryCategories, libraryMissions } from "@/lib/mission-library";
import { useMemo, useState } from "react";

const filters = libraryCategories.map((category) => ({
  id: category,
  label: category,
}));

export function MissionLibrary() {
  const [filter, setFilter] = useState("All");

  const missions = useMemo(
    () =>
      libraryMissions.filter(
        (mission) => filter === "All" || mission.category === filter,
      ),
    [filter],
  );

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.32em] text-gold uppercase">
              Expedition board
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-pretty text-ink sm:text-5xl">
              Mission Library
            </h1>
            <p className="mt-4 text-base leading-8 text-ink-soft sm:text-lg">
              Every mission is a shared experience between two corners of the
              world. Choose a route, meet your partner, and begin the
              expedition.
            </p>
          </header>
          <p className="text-[11px] tracking-[0.22em] text-ink-soft uppercase lg:pb-1">
            {String(missions.length).padStart(2, "0")} open dossiers
          </p>
        </div>

        <div className="mt-10 overflow-x-auto pb-1">
          <SegmentedTabs
            items={filters}
            value={filter}
            onChange={setFilter}
            className="w-max"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {missions.map((mission) => (
            <LibraryCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </section>
  );
}
