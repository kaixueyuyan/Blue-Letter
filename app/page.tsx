import { ExpeditionBrief } from "@/components/landing/expedition-brief";
import { FeaturedMissions } from "@/components/landing/featured-missions";
import { Hero } from "@/components/landing/hero";
import { JoinCta } from "@/components/landing/join-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ExpeditionBrief />
        <FeaturedMissions />
        <JoinCta />
      </main>
      <SiteFooter />
    </div>
  );
}
