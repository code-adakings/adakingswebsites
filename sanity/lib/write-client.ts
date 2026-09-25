import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

/**
 * Authenticated client for server-side mutations (e.g. saving form leads as
 * documents). Requires an Editor/Write-role token — separate from the
 * read-only token used for Draft Mode. `null` when the token isn't
 * configured yet, so callers can fail that one write path without crashing.
 */
export const writeClient = writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
      perspective: "published",
    })
  : null;
