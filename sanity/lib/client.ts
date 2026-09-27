import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "../env";
import { readToken } from "./token";

/**
 * Published-content client for the public site. It sends the read token so
 * the site keeps working when the dataset is private (it must be: job
 * applications and their CV assets live in it). Server-only: the token
 * module throws if this is ever imported into browser code.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: readToken,
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
