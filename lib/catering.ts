import { sanityFetch } from "@/sanity/lib/fetch";
import { cateringPageQuery } from "@/sanity/lib/queries";
import type { SanityCateringPage, Seo } from "@/types/sanity";

const CATERING_PAGE_TAG = "cateringPage";

const FALLBACK_HERO: NonNullable<SanityCateringPage["hero"]> = {
  eyebrow: "Catering",
  title: "Adakings for your next event",
  description: "From office lunches to weddings, let us bring bold Ghanaian flavor to your celebration.",
};

const FALLBACK_HIGHLIGHTS = [
  "Custom menus for any event size",
  "Corporate lunches and office catering",
  "Weddings, parties, and celebrations",
  "Delivery and on-site setup available",
];

const FALLBACK_CTA = { label: "Request a Catering Quote", href: "/contact" };

const FALLBACK_HOME_CTA: NonNullable<SanityCateringPage["homeCta"]> = {
  heading: "Adakings for your next event",
  description: "From corporate lunches to weddings, let us cater your celebration.",
  cta: { label: "Get a Catering Quote", href: "/catering" },
};

export async function getCateringPage(): Promise<{
  hero: NonNullable<SanityCateringPage["hero"]>;
  highlights: string[];
  image?: SanityCateringPage["image"];
  cta: NonNullable<SanityCateringPage["cta"]>;
  homeCta: NonNullable<SanityCateringPage["homeCta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityCateringPage | null>({
    query: cateringPageQuery,
    tags: [CATERING_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    highlights: page?.highlights?.length ? page.highlights : FALLBACK_HIGHLIGHTS,
    image: page?.image,
    cta: page?.cta?.href ? page.cta : FALLBACK_CTA,
    homeCta: page?.homeCta?.heading ? page.homeCta : FALLBACK_HOME_CTA,
    seo: page?.seo,
  };
}
