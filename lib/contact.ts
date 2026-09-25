import { sanityFetch } from "@/sanity/lib/fetch";
import { contactPageQuery } from "@/sanity/lib/queries";
import type { SanityContactPage, Seo } from "@/types/sanity";

const CONTACT_PAGE_TAG = "contactPage";

const FALLBACK_HERO: NonNullable<SanityContactPage["hero"]> = {
  eyebrow: "Contact",
  title: "We'd love to hear from you",
  description: "Questions about catering, franchising, or anything else? Reach out.",
};

const FALLBACK_BRANCHES_BLOCK: NonNullable<SanityContactPage["branchesBlock"]> = {
  heading: "Branches",
  linkLabel: "Find your nearest Adakings",
};

export async function getContactPage(): Promise<{
  hero: NonNullable<SanityContactPage["hero"]>;
  branchesBlock: NonNullable<SanityContactPage["branchesBlock"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityContactPage | null>({
    query: contactPageQuery,
    tags: [CONTACT_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    branchesBlock: page?.branchesBlock?.heading ? page.branchesBlock : FALLBACK_BRANCHES_BLOCK,
    seo: page?.seo,
  };
}
