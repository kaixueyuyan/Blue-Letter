import {
  ExpeditionExperience,
  HowJoiningWorks,
  SafetyNotice,
} from "@/components/join/join-brief";
import { JoinDesk } from "@/components/join/join-desk";
import { JoinHero } from "@/components/join/join-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Expedition · Blue Letter",
  description:
    "A preview of the Blue Letter crew roster for adult volunteers and partner organizations. Applications are not open, and this page does not save what you type.",
};

export default function JoinPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <JoinHero />
        <JoinDesk>
          <ExpeditionExperience />
          <HowJoiningWorks />
        </JoinDesk>
        <SafetyNotice />
      </main>
      <SiteFooter />
    </div>
  );
}
