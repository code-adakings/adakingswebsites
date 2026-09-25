import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "../env";
import { readToken } from "./token";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: false,
});

/**
 * Authenticated, uncached client used only when Draft Mode is enabled, so
 * editors see unpublished content (perspective: "drafts") with stega-encoded
 * source paths for future visual editing.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
  perspective: "drafts",
  stega: {
    studioUrl: "/studio",
  },
});
