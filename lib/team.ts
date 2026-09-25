import { sanityFetch } from "@/sanity/lib/fetch";
import { founderQuery, leadershipQuery } from "@/sanity/lib/queries";
import type { SanityLeadership } from "@/types/sanity";

const LEADERSHIP_TAG = "leadership";

export async function getTeamMembers(): Promise<SanityLeadership[]> {
  return sanityFetch<SanityLeadership[]>({
    query: leadershipQuery,
    tags: [LEADERSHIP_TAG],
  });
}

export async function getFounder(): Promise<SanityLeadership | null> {
  return sanityFetch<SanityLeadership | null>({
    query: founderQuery,
    tags: [LEADERSHIP_TAG],
  });
}
