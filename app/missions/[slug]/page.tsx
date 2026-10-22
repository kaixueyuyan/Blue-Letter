import { MissionDetail } from "@/components/missions/mission-detail";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getMissionDossier } from "@/lib/mission-details";
import { libraryMissions } from "@/lib/mission-library";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return libraryMissions.map((mission) => ({ slug: mission.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/missions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dossier = getMissionDossier(slug);

  if (!dossier) {
    return { title: "Mission · Blue Letter" };
  }

  return {
    title: `${dossier.title} · Blue Letter`,
    description: dossier.description,
  };
}

export default function MissionDetailPage({
  params,
}: PageProps<"/missions/[slug]">) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-5 py-16 text-[11px] tracking-[0.22em] text-ink-soft uppercase">
              Opening dossier…
            </div>
          }
        >
          <MissionDossier params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

async function MissionDossier({
  params,
}: {
  params: PageProps<"/missions/[slug]">["params"];
}) {
  const { slug } = await params;
  const dossier = getMissionDossier(slug);

  if (!dossier) {
    notFound();
  }

  return <MissionDetail dossier={dossier} />;
}
