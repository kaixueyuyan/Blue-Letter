import { GlobalLogbook } from "@/components/logbook/global-logbook";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Logbook · Blue Letter",
  description:
    "A demonstration archive of fictional Blue Letter expeditions. Cultural exchange field notes — not verified student records.",
};

export default function LogbookPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <GlobalLogbook />
      </main>
      <SiteFooter />
    </div>
  );
}
