import { StoryDetail } from "@/components/logbook/story-detail";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getLogbookStory, logbookStories } from "@/lib/logbook";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return logbookStories.map((story) => ({ slug: story.slug }));
}

type StoryParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: StoryParams): Promise<Metadata> {
  const { slug } = await params;
  const story = getLogbookStory(slug);

  if (!story) {
    return { title: "Field note · Blue Letter" };
  }

  return {
    title: `${story.title} · Blue Letter`,
    description: story.summary,
  };
}

export default function LogbookStoryPage({ params }: StoryParams) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-5 py-16 text-[11px] tracking-[0.22em] text-ink-soft uppercase">
              Opening field note…
            </div>
          }
        >
          <LogbookStory params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

async function LogbookStory({
  params,
}: {
  params: StoryParams["params"];
}) {
  const { slug } = await params;
  const story = getLogbookStory(slug);

  if (!story) {
    notFound();
  }

  return <StoryDetail story={story} />;
}
