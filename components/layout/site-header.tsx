"use client";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { id: "overview", href: "/#top", label: "Overview" },
  { id: "brief", href: "/#brief", label: "Brief" },
  { id: "missions", href: "/missions", label: "Missions" },
  { id: "logbook", href: "/logbook", label: "Logbook" },
  { id: "passport", href: "/passport", label: "Passport" },
];

function routeTab(pathname: string) {
  if (pathname.startsWith("/missions")) return "missions";
  if (pathname.startsWith("/logbook")) return "logbook";
  if (pathname.startsWith("/passport")) return "passport";
  if (pathname.startsWith("/join")) return "";
  return null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const lockedTab = routeTab(pathname);
  const [active, setActive] = useState("overview");
  const selected = lockedTab ?? active;

  useEffect(() => {
    if (lockedTab) {
      return;
    }

    const sections = nav
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => ({
        id: item.id,
        el: document.getElementById(item.href.slice(2)),
      }))
      .filter((section): section is { id: string; el: HTMLElement } =>
        Boolean(section.el),
      );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        const match = nav.find((item) => item.href === `/#${visible.target.id}`);
        if (match) setActive(match.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section.el));
    return () => observer.disconnect();
  }, [lockedTab, pathname]);

  return (
    <header className="sticky top-0 z-30">
      <div className="gold-rule h-px w-full" />
      <div className="border-b border-ink/8 bg-ivory/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 text-[10px] tracking-[0.18em] text-navy">
              BL
            </span>
            <span className="font-display text-[1.35rem] leading-none tracking-tight text-ink group-hover:text-navy">
              Blue Letter
            </span>
          </Link>

          <nav className="hidden min-w-0 overflow-x-auto md:block" aria-label="Primary">
            <SegmentedTabs
              items={nav}
              value={selected}
              onChange={setActive}
              tone="onGlass"
            />
          </nav>

          <Link
            href="/join"
            aria-current={pathname.startsWith("/join") ? "page" : undefined}
            className="inline-flex shrink-0 rounded-full border border-ink/10 bg-navy px-3 py-2 text-[10px] tracking-[0.14em] text-ivory uppercase transition hover:bg-air-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
          >
            Join
            <span className="hidden sm:inline">&nbsp;the Expedition</span>
          </Link>
        </div>
        <div className="border-t border-ink/6 px-3 py-2 md:hidden">
          <nav aria-label="Primary">
            <SegmentedTabs
              items={nav}
              value={selected}
              onChange={setActive}
              compact
              className="w-full overflow-x-auto"
            />
          </nav>
        </div>
      </div>
    </header>
  );
}
