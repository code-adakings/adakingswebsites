import type { DayHours, SanityBranch } from "@/types/sanity";

/**
 * Pure branch helpers with no Sanity client / server-only dependency, so
 * client components (the map, the interactive grid) can import them
 * directly without pulling `sanityFetch` into the client bundle.
 */

const DAY_ABBREVIATIONS: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function formatOpeningHours(hours?: DayHours[]): string {
  if (!hours || hours.length === 0) return "";

  const open = hours.filter((day) => !day.closed && day.opens && day.closes);
  if (open.length === 0) return "Closed";

  const allSame = open.every(
    (day) => day.opens === open[0].opens && day.closes === open[0].closes,
  );
  const allDaysOpen = open.length === 7;

  if (allSame && allDaysOpen) {
    return `${open[0].opens} – ${open[0].closes} daily`;
  }

  return open
    .map((day) => `${DAY_ABBREVIATIONS[day.day] ?? day.day} ${day.opens}–${day.closes}`)
    .join(", ");
}

/**
 * Prefers an editor-supplied Maps link, then falls back to the stored GPS
 * coordinates, then to a text search — so "Get Directions" always resolves
 * to somewhere useful even before a branch has full data entered.
 */
export function getBranchMapsUrl(
  branch: Pick<SanityBranch, "googleMapsUrl" | "location" | "name" | "address" | "city">,
): string {
  if (branch.googleMapsUrl) return branch.googleMapsUrl;
  if (branch.location) {
    return `https://www.google.com/maps?q=${branch.location.lat},${branch.location.lng}`;
  }
  const query = [branch.name, branch.address, branch.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Builds a static (no client JS) Google Maps embed centered on the average
 * of every branch's GPS coordinates — same `output=embed` pattern already
 * used by the homepage branches preview, just aggregated across branches
 * instead of a single site-wide address.
 */
export function getBranchesMapEmbedUrl(
  branches: Pick<SanityBranch, "location">[],
): string | undefined {
  const points = branches
    .map((branch) => branch.location)
    .filter((location): location is { lat: number; lng: number } => Boolean(location));

  if (points.length === 0) return undefined;

  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
  const zoom = points.length === 1 ? 14 : 11;

  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}
