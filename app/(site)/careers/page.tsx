import type { Metadata } from "next";
import { CareerHero } from "@/components/careers/career-hero";
import { WhyWorkHere } from "@/components/careers/why-work-here";
import { CultureGallery } from "@/components/careers/culture-gallery";
import { FeaturedJobs } from "@/components/careers/featured-jobs";
import { HiringProcess } from "@/components/careers/hiring-process";
import { Benefits } from "@/components/careers/benefits";
import { CareersFaq } from "@/components/careers/careers-faq";
import { TalentPoolCta } from "@/components/careers/talent-pool-cta";
import { getCareersPage, getDepartments, getFeaturedJobs, getOpenJobs } from "@/lib/careers";
import { getSiteSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, jobPostingSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION =
  "Build your career with Adakings — kitchen, customer, delivery, and marketing roles across Ghana.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCareersPage();
  return buildMetadata({
    path: "/careers",
    title: "Careers",
    description: FALLBACK_DESCRIPTION,
    seo,
    hasOwnOgImage: true,
  });
}

export default async function CareersPage() {
  const [page, featuredJobs, openJobs, departments, settings] = await Promise.all([
    getCareersPage(),
    getFeaturedJobs(),
    getOpenJobs(),
    getDepartments(),
    getSiteSettings(),
  ]);
  const { hero, image, whyWorkHere, lifeAtAdakings, hiringProcess, benefits, faq, talentPool } = page;

  const featuredIds = new Set(featuredJobs.map((job) => job._id));
  const otherOpenJobs = openJobs.filter((job) => !featuredIds.has(job._id));

  const talentPoolCta = talentPool.cta?.href
    ? talentPool.cta
    : {
        label: talentPool.cta?.label || "Join the talent pool",
        href: `mailto:${settings.contactEmail}?subject=${encodeURIComponent("Adakings Talent Pool")}`,
      };

  return (
    <>
      <JsonLd
        data={[
          ...openJobs.filter((job) => !job.noIndex).map((job) => jobPostingSchema(job, settings)),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
          ]),
        ]}
      />

      <CareerHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={image}
        openRolesCount={openJobs.length}
      />

      <WhyWorkHere
        eyebrow={whyWorkHere.eyebrow}
        heading={whyWorkHere.heading}
        description={whyWorkHere.description}
        cards={whyWorkHere.cards}
      />

      <CultureGallery
        eyebrow={lifeAtAdakings.eyebrow}
        heading={lifeAtAdakings.heading}
        description={lifeAtAdakings.description}
        gallery={lifeAtAdakings.gallery}
        quote={lifeAtAdakings.quote}
        departments={departments}
      />

      <FeaturedJobs featured={featuredJobs} otherOpenJobs={otherOpenJobs} />

      <HiringProcess eyebrow={hiringProcess.eyebrow} heading={hiringProcess.heading} steps={hiringProcess.steps} />

      <Benefits
        eyebrow={benefits.eyebrow}
        heading={benefits.heading}
        description={benefits.description}
        items={benefits.items}
      />

      <CareersFaq eyebrow={faq.eyebrow} heading={faq.heading} items={faq.items} />

      <TalentPoolCta heading={talentPool.heading} description={talentPool.description} cta={talentPoolCta} />
    </>
  );
}
