import "server-only";
import { draftMode } from "next/headers";
import { client, previewClient } from "./client";

/**
 * Default ISR window for content fetched from Sanity. Pages/sections that
 * need fresher data can pass a shorter `revalidate`; the /api/revalidate
 * webhook (triggered by Sanity on publish) invalidates by tag immediately.
 */
const DEFAULT_REVALIDATE_SECONDS = 60;

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  revalidate?: number | false;
}): Promise<QueryResponse> {
  if (await isDraftModeEnabled()) {
    return previewClient.fetch<QueryResponse>(query, params, {
      cache: "no-store",
    });
  }

  return client.fetch<QueryResponse>(query, params, {
    next:
      revalidate === false
        ? { tags }
        : { revalidate, tags },
  });
}

/**
 * draftMode() throws when called outside a request scope (e.g. during
 * generateStaticParams at build time), which can never be a draft request.
 */
async function isDraftModeEnabled(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}
