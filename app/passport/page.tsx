import { ExpeditionPassport } from "@/components/passport/expedition-passport";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expedition Passport · Blue Letter",
  description:
    "A local demonstration passport for Blue Letter World Expedition. Collect mission stamps in this browser — not an account.",
};

export default function PassportPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ExpeditionPassport />
      </main>
      <SiteFooter />
    </div>
  );
}
