import { sanityFetch } from "@/sanity/lib/fetch";
import { allBranchesQuery, branchesPageQuery, openBranchesQuery } from "@/sanity/lib/queries";
import { siteConfig } from "@/lib/site-config";
import type { SanityBranch, SanityBranchesPage, Seo } from "@/types/sanity";

export { formatOpeningHours, getBranchMapsUrl, getBranchesMapEmbedUrl } from "@/lib/branch-utils";

const BRANCH_TAG = "branch";
const BRANCHES_PAGE_TAG = "branchesPage";

const FALLBACK_HERO: NonNullable<SanityBranchesPage["hero"]> = {
  eyebrow: "Branches",
  title: "Find your nearest Adakings",
  description: "From Accra to Kumasi to Takoradi — we're growing across Ghana.",
  cta: { label: "View Locations", href: "#locations" },
};

const FALLBACK_MAP_SECTION: NonNullable<SanityBranchesPage["mapSection"]> = {
  eyebrow: "Find Us",
  title: "Every location, mapped",
  description: "Explore the map or browse the full list to find the Adakings nearest to you.",
};

const FALLBACK_SERVICES_SECTION: NonNullable<SanityBranchesPage["servicesSection"]> = {
  eyebrow: "What We Offer",
  title: "Delivery, pickup, and catering — wherever you are",
  description: "Every branch is built to get Adakings to you however you'd like it.",
  items: [
    {
      icon: "delivery",
      title: "Delivery",
      description: "Order online and have your meal delivered hot, straight to your door.",
    },
    {
      icon: "pickup",
      title: "Pickup",
      description: "Skip the wait — order ahead and collect your meal at your nearest branch.",
    },
    {
      icon: "catering",
      title: "Catering",
      description: "Feeding a crowd? Our catering team handles everything from setup to service.",
    },
  ],
};

const FALLBACK_GROWTH: NonNullable<SanityBranchesPage["growth"]> = {
  eyebrow: "Growing With Ghana",
  title: "From Legon to every corner of Accra",
  description:
    "What started as a single Legon storefront has grown into a network of branches across Accra — with more on the way as we bring Adakings closer to every neighbourhood.",
};

const FALLBACK_FINAL_CTA: NonNullable<SanityBranchesPage["finalCta"]> = {
  heading: "Order from your nearest Adakings",
  description: "Order online for delivery or pickup from your nearest branch.",
  cta: { label: "Open", href: siteConfig.orderUrl },
};

export async function getAllBranches(): Promise<SanityBranch[]> {
  return sanityFetch<SanityBranch[]>({
    query: allBranchesQuery,
    tags: [BRANCH_TAG],
  });
}

export async function getOpenBranches(limit = 4): Promise<SanityBranch[]> {
  const branches = await sanityFetch<SanityBranch[]>({
    query: openBranchesQuery,
    tags: [BRANCH_TAG],
  });
  return branches.slice(0, limit);
}

export async function getBranchesPage(): Promise<{
  hero: NonNullable<SanityBranchesPage["hero"]>;
  mapSection: NonNullable<SanityBranchesPage["mapSection"]>;
  servicesSection: NonNullable<SanityBranchesPage["servicesSection"]>;
  growth: NonNullable<SanityBranchesPage["growth"]>;
  finalCta: NonNullable<SanityBranchesPage["finalCta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityBranchesPage | null>({
    query: branchesPageQuery,
    tags: [BRANCHES_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? { ...FALLBACK_HERO, ...page.hero } : FALLBACK_HERO,
    mapSection: page?.mapSection?.title ? page.mapSection : FALLBACK_MAP_SECTION,
    servicesSection: page?.servicesSection?.items?.length
      ? page.servicesSection
      : FALLBACK_SERVICES_SECTION,
    growth: page?.growth?.title ? page.growth : FALLBACK_GROWTH,
    finalCta: page?.finalCta?.heading ? page.finalCta : FALLBACK_FINAL_CTA,
    seo: page?.seo,
  };
}
