import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/home/final-cta";
import { BranchesHero } from "@/components/sections/branches/branches-hero";
import { BranchGrid } from "@/components/sections/branches/branch-grid";
import { BranchServices } from "@/components/sections/branches/branch-services";
import { BranchGrowth } from "@/components/sections/branches/branch-growth";
import { getAllBranches, getBranchesPage } from "@/lib/branches";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, branchesItemListSchema, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "Find your nearest Adakings branch across Ghana.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getBranchesPage();
  return buildMetadata({ path: "/branches", title: "Branches", description: FALLBACK_DESCRIPTION, seo });
}

export default async function BranchesPage() {
  const [branches, page] = await Promise.all([getAllBranches(), getBranchesPage()]);

  return (
    <>
      <JsonLd
        data={[
          branchesItemListSchema(branches),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Branches", path: "/branches" },
          ]),
        ]}
      />
      <BranchesHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        heroImage={page.hero.heroImage}
        cta={page.hero.cta}
      />

      <BranchGrid
        branches={branches}
        eyebrow={page.mapSection.eyebrow}
        title={page.mapSection.title ?? ""}
        description={page.mapSection.description}
      />

      <BranchServices
        items={page.servicesSection.items ?? []}
        eyebrow={page.servicesSection.eyebrow}
        title={page.servicesSection.title ?? ""}
        description={page.servicesSection.description}
      />

      <BranchGrowth
        eyebrow={page.growth.eyebrow}
        title={page.growth.title ?? ""}
        description={page.growth.description}
        image={page.growth.image}
      />

      <FinalCta
        heading={page.finalCta.heading}
        description={page.finalCta.description}
        primaryCta={page.finalCta.cta}
        secondaryCta={undefined}
      />
    </>
  );
}
