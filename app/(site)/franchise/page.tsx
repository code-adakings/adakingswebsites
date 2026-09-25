import type { Metadata } from "next";
import { FranchiseHero } from "@/components/sections/franchise/hero";
import { FounderVision } from "@/components/sections/franchise/founder-vision";
import { FranchiseAdvantages } from "@/components/sections/franchise/advantages";
import { FranchiseHowItWorks } from "@/components/sections/franchise/how-it-works";
import { FranchiseTrainingSupport } from "@/components/sections/franchise/training-support";
import { FranchiseIdealPartners } from "@/components/sections/franchise/ideal-partners";
import { FranchiseFaq } from "@/components/sections/franchise/faq";
import { FranchiseEnquiry } from "@/components/sections/franchise/enquiry";
import { FranchiseProspectusCta } from "@/components/sections/franchise/prospectus-cta";
import { getFranchisePage } from "@/lib/franchise";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "Franchise with Adakings and bring our proven fast-food model to your community.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, hero } = await getFranchisePage();
  return buildMetadata({
    path: "/franchise",
    title: "Franchise",
    description: FALLBACK_DESCRIPTION,
    seo,
    image: hero.heroImage,
    hasOwnOgImage: true,
  });
}

export default async function FranchisePage() {
  const {
    hero,
    founderVision,
    advantages,
    howItWorks,
    trainingSupport,
    idealPartners,
    faq,
    enquiry,
    prospectus,
  } = await getFranchisePage();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Franchise", path: "/franchise" },
        ])}
      />
      <FranchiseHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        heroImage={hero.heroImage}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
      />
      <FounderVision
        eyebrow={founderVision.eyebrow}
        heading={founderVision.heading}
        body={founderVision.body}
        image={founderVision.image}
      />
      <FranchiseAdvantages eyebrow={advantages.eyebrow} heading={advantages.heading} cards={advantages.cards} />
      <FranchiseHowItWorks eyebrow={howItWorks.eyebrow} heading={howItWorks.heading} steps={howItWorks.steps} />
      <FranchiseTrainingSupport
        eyebrow={trainingSupport.eyebrow}
        heading={trainingSupport.heading}
        columns={trainingSupport.columns}
      />
      <FranchiseIdealPartners
        eyebrow={idealPartners.eyebrow}
        heading={idealPartners.heading}
        description={idealPartners.description}
        bullets={idealPartners.bullets}
      />
      <FranchiseFaq eyebrow={faq.eyebrow} heading={faq.heading} items={faq.items} />
      <FranchiseEnquiry heading={enquiry.heading} description={enquiry.description} />
      <FranchiseProspectusCta
        heading={prospectus.heading}
        description={prospectus.description}
        prospectusFileUrl={prospectus.prospectusFileUrl}
        primaryCtaLabel={prospectus.primaryCtaLabel}
        secondaryCta={prospectus.secondaryCta}
      />
    </>
  );
}
