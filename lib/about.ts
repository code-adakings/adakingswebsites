import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutPageQuery } from "@/sanity/lib/queries";
import type { SanityAboutPage, Seo } from "@/types/sanity";

const ABOUT_PAGE_TAG = "aboutPage";

const FALLBACK_HERO: NonNullable<SanityAboutPage["hero"]> = {
  eyebrow: "About Adakings",
  title: "Ghanaian pride, on every plate",
  description:
    "We're a black-owned fast food and hospitality company built to bring bold, authentic Ghanaian flavor to more communities — without compromise.",
};

const FALLBACK_MISSION: NonNullable<SanityAboutPage["mission"]> = {
  eyebrow: "Our Mission",
  heading: "Serving food that makes Ghana proud",
  description:
    "Every branch, every recipe, and every hire is guided by one standard: would we be proud to serve this to our own family? That's the bar we hold ourselves to.",
};

const FALLBACK_TEAM_SECTION: NonNullable<SanityAboutPage["teamSection"]> = {
  eyebrow: "Leadership",
  heading: "The people behind Adakings",
};

export async function getAboutPage(): Promise<{
  hero: NonNullable<SanityAboutPage["hero"]>;
  mission: NonNullable<SanityAboutPage["mission"]>;
  teamSection: NonNullable<SanityAboutPage["teamSection"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityAboutPage | null>({
    query: aboutPageQuery,
    tags: [ABOUT_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    mission: page?.mission?.heading ? page.mission : FALLBACK_MISSION,
    teamSection: page?.teamSection?.heading ? page.teamSection : FALLBACK_TEAM_SECTION,
    seo: page?.seo,
  };
}
