import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageQuery } from "@/sanity/lib/queries";
import { siteConfig } from "@/lib/site-config";
import type { SanityHomepage } from "@/types/sanity";

const HOMEPAGE_TAG = "homepage";

const FALLBACK_HERO: NonNullable<SanityHomepage["hero"]> = {
  eyebrow: "Proudly Ghanaian · Black-owned",
  heading: "Fast food, made with pride.",
  subheading:
    "Adakings brings bold Ghanaian flavor to every plate — crafted fresh, served fast, and rooted in the communities we call home.",
  primaryCta: { label: "Order Food", href: siteConfig.orderUrl },
  secondaryCta: { label: "Find a Branch", href: "/branches" },
};

const FALLBACK_METRICS = [
  { value: "200,000+", label: "Meals Sold" },
  { value: "10+", label: "Branches Across Ghana" },
  { value: "500+", label: "Team Members" },
  { value: "4.8/5", label: "Average Customer Rating" },
];

const FALLBACK_BRANCHES_PREVIEW: NonNullable<SanityHomepage["branchesPreview"]> = {
  eyebrow: "Find Us",
  title: "Branches across Ghana",
  description: "From Accra to Kumasi to Takoradi — find your nearest Adakings.",
};

const FALLBACK_HOW_ORDERING_WORKS: NonNullable<SanityHomepage["howOrderingWorks"]> = {
  eyebrow: "How It Works",
  title: "Ordering Adakings is simple",
  steps: [
    {
      icon: "smartphone",
      title: "Order on the app",
      description: "Browse the menu and place your order on the Adakings app in minutes.",
    },
    {
      icon: "chef-hat",
      title: "We cook it fresh",
      description: "Your meal is prepared fresh to order at your nearest branch.",
    },
    {
      icon: "truck",
      title: "Delivered or ready for pickup",
      description: "Track your order in real time, delivered to your door or ready to collect.",
    },
  ],
  cta: { label: "Order Now", href: siteConfig.orderUrl },
};

const FALLBACK_TESTIMONIALS_HEADING: NonNullable<SanityHomepage["testimonialsHeading"]> = {
  eyebrow: "Testimonials",
  title: "What our customers are saying",
};

const FALLBACK_FINAL_CTA: NonNullable<SanityHomepage["finalCta"]> = {
  heading: "Hungry? Let's fix that.",
  description: "Order your favorite Adakings meal now, or find a branch near you.",
  primaryCta: { label: "Order Food", href: siteConfig.orderUrl },
  secondaryCta: { label: "Find a Branch", href: "/branches" },
};

export async function getHomepage(): Promise<{
  hero: NonNullable<SanityHomepage["hero"]>;
  trustMetrics: { value: string; label: string }[];
  branchesPreview: NonNullable<SanityHomepage["branchesPreview"]>;
  howOrderingWorks: NonNullable<SanityHomepage["howOrderingWorks"]>;
  testimonialsHeading: NonNullable<SanityHomepage["testimonialsHeading"]>;
  finalCta: NonNullable<SanityHomepage["finalCta"]>;
  seo?: SanityHomepage["seo"];
}> {
  const homepage = await sanityFetch<SanityHomepage | null>({
    query: homepageQuery,
    tags: [HOMEPAGE_TAG],
  });

  return {
    hero: homepage?.hero?.heading ? homepage.hero : FALLBACK_HERO,
    trustMetrics: homepage?.trustMetrics?.length ? homepage.trustMetrics : FALLBACK_METRICS,
    branchesPreview: homepage?.branchesPreview?.title
      ? homepage.branchesPreview
      : FALLBACK_BRANCHES_PREVIEW,
    howOrderingWorks: homepage?.howOrderingWorks?.steps?.length
      ? homepage.howOrderingWorks
      : FALLBACK_HOW_ORDERING_WORKS,
    testimonialsHeading: homepage?.testimonialsHeading?.title
      ? homepage.testimonialsHeading
      : FALLBACK_TESTIMONIALS_HEADING,
    finalCta: homepage?.finalCta?.heading ? homepage.finalCta : FALLBACK_FINAL_CTA,
    seo: homepage?.seo,
  };
}
