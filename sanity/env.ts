export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const useCdn = process.env.NODE_ENV === "production";

/**
 * Origin the Presentation tool's preview iframe points at. Falls back to
 * `location.origin` (i.e. wherever /studio itself is hosted) when unset,
 * which is correct for this project since Studio is embedded in the same
 * Next.js app as the frontend.
 */
export const studioPreviewOrigin = process.env.NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
