import { sanityFetch } from "@/sanity/lib/fetch";
import { whyAdakingsQuery } from "@/sanity/lib/queries";
import type { SanityWhyAdakings } from "@/types/sanity";

const WHY_ADAKINGS_TAG = "whyAdakings";

const FALLBACK: Required<Pick<SanityWhyAdakings, "eyebrow" | "heading" | "reasons">> = {
  eyebrow: "Why Adakings",
  heading: "Food made with pride, served with purpose",
  reasons: [
    { icon: "flame", title: "Bold, authentic flavor", description: "Recipes rooted in Ghanaian tradition, perfected over years." },
    { icon: "leaf", title: "Fresh, every day", description: "No shortcuts — ingredients sourced and prepared daily." },
    { icon: "timer", title: "Fast without compromise", description: "Quick service that never sacrifices quality or care." },
    { icon: "heart", title: "Community-first", description: "Black-owned and proud, reinvesting in the communities we serve." },
  ],
};

export async function getWhyAdakings(): Promise<{
  eyebrow: string;
  heading: string;
  reasons: NonNullable<SanityWhyAdakings["reasons"]>;
}> {
  const doc = await sanityFetch<SanityWhyAdakings | null>({
    query: whyAdakingsQuery,
    tags: [WHY_ADAKINGS_TAG],
  });

  return {
    eyebrow: doc?.eyebrow || FALLBACK.eyebrow,
    heading: doc?.heading || FALLBACK.heading,
    reasons: doc?.reasons?.length ? doc.reasons : FALLBACK.reasons,
  };
}
