import { sanityFetch } from "@/sanity/lib/fetch";
import { ourStoryPageQuery } from "@/sanity/lib/queries";
import type { SanityOurStoryPage, Seo } from "@/types/sanity";

const OUR_STORY_PAGE_TAG = "ourStoryPage";

const FALLBACK_HERO: NonNullable<SanityOurStoryPage["hero"]> = {
  eyebrow: "Our Story",
  title: "From one kitchen to a movement",
  description:
    "The story of Adakings is the story of the people who believed in it first — our founders, our team, and our customers.",
};

const FALLBACK_HOME_TEASER: NonNullable<SanityOurStoryPage["homeTeaser"]> = {
  heading: "Built from one kitchen, one community at a time",
  description:
    "Adakings began with a simple belief: Ghanaian food deserves a fast-food experience that matches its flavor. What started as one restaurant has grown into a family of branches — without ever losing the recipe for what made us who we are.",
};

const FALLBACK_MILESTONES: NonNullable<SanityOurStoryPage["milestones"]> = [
  {
    year: "Year One",
    title: "One kitchen, one belief",
    description:
      "Adakings opened its first location with a simple promise: Ghanaian food, done right, served fast.",
  },
  {
    year: "Growth",
    title: "A second branch, then a third",
    description:
      "Word spread. Customers kept coming back, and Adakings grew into new neighborhoods.",
  },
  {
    year: "Today",
    title: "A family of branches",
    description:
      "Now serving communities across Ghana, with franchise partners bringing Adakings even further.",
  },
];

export async function getOurStoryPage(): Promise<{
  hero: NonNullable<SanityOurStoryPage["hero"]>;
  image?: SanityOurStoryPage["image"];
  homeTeaser: NonNullable<SanityOurStoryPage["homeTeaser"]>;
  milestones: NonNullable<SanityOurStoryPage["milestones"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityOurStoryPage | null>({
    query: ourStoryPageQuery,
    tags: [OUR_STORY_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    image: page?.image,
    homeTeaser: page?.homeTeaser?.heading ? page.homeTeaser : FALLBACK_HOME_TEASER,
    milestones: page?.milestones?.length ? page.milestones : FALLBACK_MILESTONES,
    seo: page?.seo,
  };
}
