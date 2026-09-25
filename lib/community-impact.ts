import { sanityFetch } from "@/sanity/lib/fetch";
import { communityImpactQuery } from "@/sanity/lib/queries";
import type { SanityCommunityImpact } from "@/types/sanity";

const COMMUNITY_IMPACT_TAG = "communityImpact";

const FALLBACK: Required<Pick<SanityCommunityImpact, "eyebrow" | "heading" | "description" | "initiatives">> = {
  eyebrow: "Community Impact",
  heading: "Investing in the communities we serve",
  description:
    "Being black-owned and Ghanaian isn't just our identity — it's a responsibility we take seriously.",
  initiatives: [
    { title: "Local sourcing", description: "We partner with Ghanaian farmers and suppliers wherever possible." },
    { title: "Youth training programs", description: "Hands-on culinary and hospitality training for young people." },
    { title: "Community giving", description: "Supporting local causes in every community we operate in." },
  ],
};

export async function getCommunityImpact(): Promise<{
  eyebrow: string;
  heading: string;
  description: string;
  initiatives: NonNullable<SanityCommunityImpact["initiatives"]>;
  image?: SanityCommunityImpact["image"];
}> {
  const doc = await sanityFetch<SanityCommunityImpact | null>({
    query: communityImpactQuery,
    tags: [COMMUNITY_IMPACT_TAG],
  });

  return {
    eyebrow: doc?.eyebrow || FALLBACK.eyebrow,
    heading: doc?.heading || FALLBACK.heading,
    description: doc?.description || FALLBACK.description,
    initiatives: doc?.initiatives?.length ? doc.initiatives : FALLBACK.initiatives,
    image: doc?.image,
  };
}
