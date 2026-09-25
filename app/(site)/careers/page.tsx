import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { FinalCta } from "@/components/sections/home/final-cta";
import { WhyWorkHere } from "@/components/sections/careers/why-work-here";
import { LifeAtAdakings } from "@/components/sections/careers/life-at-adakings";
import { OpenPositions } from "@/components/sections/careers/open-positions";
import { HiringProcess } from "@/components/sections/careers/hiring-process";
import { EmployeeValues } from "@/components/sections/careers/employee-values";
import { getCareersPage, getOpenCareers } from "@/lib/careers";
import { getSiteSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema, jobPostingSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION =
  "Build your career with Adakings — kitchen, operations, and corporate roles across Ghana.";

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
  const [
    { hero, image, cvCtaLabel, whyWorkHere, lifeAtAdakings, departments, hiringProcess, employeeValues, finalCta },
    openRoles,
    settings,
  ] = await Promise.all([getCareersPage(), getOpenCareers(), getSiteSettings()]);

  return (
    <>
      <JsonLd
        data={[
          ...openRoles.map((career) => jobPostingSchema(career, settings)),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
          ]),
        ]}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <WhyWorkHere
        eyebrow={whyWorkHere.eyebrow}
        heading={whyWorkHere.heading}
        description={whyWorkHere.description}
        cards={whyWorkHere.cards}
      />

      <LifeAtAdakings
        eyebrow={lifeAtAdakings.eyebrow}
        heading={lifeAtAdakings.heading}
        description={lifeAtAdakings.description}
        gallery={lifeAtAdakings.gallery}
        quote={lifeAtAdakings.quote}
        departments={departments}
      />

      <OpenPositions
        careers={openRoles}
        image={image}
        cvCtaLabel={cvCtaLabel}
        contactEmail={settings.contactEmail}
      />

      <HiringProcess eyebrow={hiringProcess.eyebrow} heading={hiringProcess.heading} steps={hiringProcess.steps} />

      <EmployeeValues
        eyebrow={employeeValues.eyebrow}
        heading={employeeValues.heading}
        description={employeeValues.description}
        values={employeeValues.values}
      />

      <FinalCta
        heading={finalCta.heading}
        description={finalCta.description}
        primaryCta={finalCta.cta}
        secondaryCta={undefined}
        primaryCtaEvent={null}
      />
    </>
  );
}
