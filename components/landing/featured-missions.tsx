"use client";

import { featuredMissions } from "@/lib/missions";
import { MissionCard } from "@/components/missions/mission-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { useMemo, useState } from "react";

const filters = [
  { id: "all", label: "All" },
  { id: "Recruiting", label: "Recruiting" },
  { id: "In the field", label: "In the field" },
  { id: "Logged", label: "Logged" },
];

export function FeaturedMissions() {
  const [filter, setFilter] = useState("all");

  const missions = useMemo(
    () =>
      featuredMissions.filter(
        (mission) => filter === "all" || mission.status === filter,
      ),
    [filter],
  );

  return (
    <section id="missions" className="scroll-mt-44 px-5 py-8 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Open dossiers"
            title="Featured Missions"
            kicker="Four assignments currently pinned to the expedition board. Choose a brief, meet a counterpart on the other side of the map, and keep the same log."
          />
          <SegmentedTabs
            items={filters}
            value={filter}
            onChange={setFilter}
            className="self-start lg:self-auto"
          />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {missions.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
