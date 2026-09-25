import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewFrontiersHero } from "@/components/sections/new-frontiers/hero";
import { NewFrontiersFoundersLetter } from "@/components/sections/new-frontiers/founders-letter";
import { NewFrontiersWhyNow } from "@/components/sections/new-frontiers/why-now";
import { NewFrontiersBusinessToday } from "@/components/sections/new-frontiers/business-today";
import { NewFrontiersRoadmap } from "@/components/sections/new-frontiers/roadmap";
import { NewFrontiersInvestmentTerms } from "@/components/sections/new-frontiers/investment-terms";
import { NewFrontiersCta } from "@/components/sections/new-frontiers/cta";
import { NewFrontiersDisclaimer } from "@/components/sections/new-frontiers/disclaimer";
import { getPrivateLandingPageBySlug } from "@/lib/private-landing";
import { buildMetadata } from "@/lib/seo";

/**
 * Catch-all for privately-invited landing pages (e.g. lending rounds, investor
 * updates) created ad hoc in Sanity Studio — never linked from site nav or
 * listed anywhere, and always forced noindex regardless of the CMS toggle.
 * Next resolves literal route folders (about, franchise, etc.) before this
 * dynamic segment, so it only ever catches slugs with no matching static page.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPrivateLandingPageBySlug(slug);
  if (!page) return {};

  return buildMetadata({
    path: `/${slug}`,
    title: page.hero?.heading ?? slug,
    description: page.seo?.metaDescription ?? page.hero?.description ?? "",
    seo: { ...page.seo, noIndex: true },
  });
}

export default async function PrivateLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPrivateLandingPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <NewFrontiersHero
        eyebrow={page.hero?.eyebrow}
        heading={page.hero?.heading ?? ""}
        subheading={page.hero?.subheading}
        description={page.hero?.description}
        primaryCtaLabel={page.hero?.primaryCtaLabel}
        secondaryCtaLabel={page.hero?.secondaryCtaLabel}
        heroImage={page.hero?.heroImage}
        metrics={page.hero?.metrics}
      />
      <NewFrontiersFoundersLetter
        eyebrow={page.foundersLetter?.eyebrow}
        heading={page.foundersLetter?.heading}
        paragraphs={page.foundersLetter?.paragraphs}
        signatureName={page.foundersLetter?.signatureName}
        signatureRole={page.foundersLetter?.signatureRole}
      />
      <NewFrontiersWhyNow
        heading={page.whyNow?.heading}
        body={page.whyNow?.body}
        features={page.whyNow?.features}
      />
      <NewFrontiersBusinessToday
        heading={page.businessToday?.heading}
        body={page.businessToday?.body}
        serviceAreas={page.businessToday?.serviceAreas}
        metrics={page.businessToday?.metrics}
      />
      <NewFrontiersRoadmap
        heading={page.roadmap?.heading}
        phases={page.roadmap?.phases}
        caption={page.roadmap?.caption}
      />
      <NewFrontiersInvestmentTerms
        eyebrow={page.investmentTerms?.eyebrow}
        heading={page.investmentTerms?.heading}
        headlineRate={page.investmentTerms?.headlineRate}
        rateCaption={page.investmentTerms?.rateCaption}
        repaymentRows={page.investmentTerms?.repaymentRows}
        note={page.investmentTerms?.note}
      />
      <NewFrontiersCta
        heading={page.cta?.heading}
        body={page.cta?.body}
        investmentAmountOptions={page.cta?.investmentAmountOptions}
        acknowledgementText={page.cta?.acknowledgementText}
        submitLabel={page.cta?.submitLabel}
      />
      <NewFrontiersDisclaimer text={page.cta?.disclaimer} />
    </>
  );
}
