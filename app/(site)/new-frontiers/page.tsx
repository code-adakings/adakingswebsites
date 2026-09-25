import type { Metadata } from "next";
import { NewFrontiersHero } from "@/components/sections/new-frontiers/hero";
import { NewFrontiersFoundersLetter } from "@/components/sections/new-frontiers/founders-letter";
import { NewFrontiersWhyNow } from "@/components/sections/new-frontiers/why-now";
import { NewFrontiersBusinessToday } from "@/components/sections/new-frontiers/business-today";
import { NewFrontiersRoadmap } from "@/components/sections/new-frontiers/roadmap";
import { NewFrontiersInvestmentTerms } from "@/components/sections/new-frontiers/investment-terms";
import { NewFrontiersCta } from "@/components/sections/new-frontiers/cta";
import { NewFrontiersDisclaimer } from "@/components/sections/new-frontiers/disclaimer";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/new-frontiers",
    title: "Operation New Frontiers",
    description:
      "A private GHS 70,000 semester lending facility supporting Adakings' next phase of growth across the Greater Legon corridor.",
    seo: { noIndex: true },
  });
}

export default function NewFrontiersPage() {
  return (
    <>
      <NewFrontiersHero />
      <NewFrontiersFoundersLetter />
      <NewFrontiersWhyNow />
      <NewFrontiersBusinessToday />
      <NewFrontiersRoadmap />
      <NewFrontiersInvestmentTerms />
      <NewFrontiersCta />
      <NewFrontiersDisclaimer />
    </>
  );
}
