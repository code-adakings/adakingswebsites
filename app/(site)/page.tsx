import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/hero";
import { TrustMetrics } from "@/components/sections/home/trust-metrics";
import { SignatureMeals } from "@/components/sections/home/signature-meals";
import { OurStory } from "@/components/sections/home/our-story";
import { BranchesPreview } from "@/components/sections/home/branches-preview";
import { Catering } from "@/components/sections/home/catering";
import { Franchise } from "@/components/sections/home/franchise";
import { Careers } from "@/components/sections/home/careers";
import { LatestJournal } from "@/components/sections/home/journal";
import { FinalCta } from "@/components/sections/home/final-cta";
import { getHomepage } from "@/lib/homepage";
import { getSiteSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, restaurantSchema } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepage();
  return buildMetadata({
    path: "/",
    description: siteConfig.description,
    seo,
    hasOwnOgImage: true,
  });
}

export default async function HomePage() {
  const [{ hero, trustMetrics, branchesPreview, finalCta }, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd data={restaurantSchema(settings)} />
      <Hero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        subheading={hero.subheading}
        backgroundImage={hero.backgroundImage}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
      />
      <TrustMetrics metrics={trustMetrics} />
      <SignatureMeals />
      <OurStory />
      <BranchesPreview {...branchesPreview} />
      <Catering />
      <Franchise />
      <Careers />
      <LatestJournal />
      <FinalCta {...finalCta} />
    </>
  );
}
