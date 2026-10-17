import { MissionLibrary } from "@/components/missions/mission-library";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Library · Blue Letter",
  description:
    "Ten expedition briefs connecting rural Chinese children with overseas volunteers. Choose a berth, not a charity task.",
};

export default function MissionsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <MissionLibrary />
      </main>
      <SiteFooter />
    </div>
  );
}
