// Server-only so "today" always comes from the server clock (UTC, which is
// Ghana time), never a visitor's browser, when deciding which jobs are open.
import "server-only";
import type { JobPostingCard } from "@/types/career";

/** Today's date as YYYY-MM-DD. Ghana is on UTC year-round, so UTC is correct. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isDeadlinePassed(deadline?: string): boolean {
  return Boolean(deadline && deadline < todayIso());
}

/** Whether a posting should accept applications right now. */
export function isAcceptingApplications(job: Pick<JobPostingCard, "status" | "deadline">): boolean {
  return job.status === "Open" && !isDeadlinePassed(job.deadline);
}

export function formatDeadline(deadline: string): string {
  // Parse as a calendar date (not UTC midnight shifted into the viewer's zone).
  const [year, month, day] = deadline.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Branch names are stored as "Adakings — TF Hostel"; job UI only needs "TF Hostel". */
export function branchShortName(branch: JobPostingCard["branch"]): string | undefined {
  return branch?.name.replace(/^Adakings\s*[—–-]\s*/, "") || undefined;
}

/** "TF Hostel · Legon, Accra" style label, skipping missing parts. */
export function jobLocationLabel(job: Pick<JobPostingCard, "branch" | "location">): string {
  return [branchShortName(job.branch), job.location].filter(Boolean).join(" · ");
}
