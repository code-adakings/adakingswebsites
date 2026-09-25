/**
 * Operation New Frontiers lending workflow — shared between the Next.js site
 * and Sanity Studio (so no server-only imports here).
 *
 * Every application moves strictly one step at a time through STATUSES.
 * Studio document actions (sanity/lending/actions.tsx) drive the admin steps;
 * the lender drives PAYMENT_RECEIVED → CONSENT_SIGNED from their private page.
 */

export const STATUSES = [
  "APPLIED",
  "UNDER_REVIEW",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAYMENT_RECEIVED",
  "CONSENT_SIGNED",
  "COMPLETED",
] as const;

export type LendingStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<LendingStatus, string> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_RECEIVED: "Payment Received",
  CONSENT_SIGNED: "Consent Signed",
  COMPLETED: "Completed",
};

export const STATUS_DESCRIPTIONS: Record<LendingStatus, string> = {
  APPLIED: "New applications awaiting review",
  UNDER_REVIEW: "Negotiating terms",
  APPROVED: "Provisional agreement sent",
  PAYMENT_PENDING: "Waiting for funds",
  PAYMENT_RECEIVED: "Awaiting lender's digital consent",
  CONSENT_SIGNED: "Agreement executed and active",
  COMPLETED: "Repaid and closed",
};

/** Studio `options.list` for the status field. */
export const STATUS_OPTIONS = STATUSES.map((value) => ({ title: STATUS_LABELS[value], value }));

export function statusIndex(status: string | undefined): number {
  return STATUSES.indexOf((status ?? "APPLIED") as LendingStatus);
}

export function nextStatus(status: string | undefined): LendingStatus | null {
  const index = statusIndex(status);
  return index >= 0 && index < STATUSES.length - 1 ? STATUSES[index + 1] : null;
}

export function isAtLeast(status: string | undefined, target: LendingStatus): boolean {
  return statusIndex(status) >= statusIndex(target);
}

/** Lender emails keyed by the status that triggers them (see lib/lending/emails.ts). */
export type LendingEmailKind = "provisional" | "paymentInstructions" | "paymentConfirmed";

export const EMAIL_FOR_STATUS: Partial<Record<LendingStatus, LendingEmailKind>> = {
  APPROVED: "provisional",
  PAYMENT_PENDING: "paymentInstructions",
  PAYMENT_RECEIVED: "paymentConfirmed",
};

/** Settings singleton id; the `lending.` prefix keeps bank details out of the public API. */
export const LENDING_SETTINGS_ID = "lending.settings";

export const AGREEMENT_NUMBER_PREFIX = "ONF";

export function agreementNumberPrefix(year: number) {
  return `${AGREEMENT_NUMBER_PREFIX}-${year}-`;
}

/** e.g. ("ONF-2026-0017", 2026) → "ONF-2026-0018"; (null, 2026) → "ONF-2026-0001". */
export function nextAgreementNumber(latest: string | null | undefined, year: number): string {
  const prefix = agreementNumberPrefix(year);
  const last = latest?.startsWith(prefix) ? Number.parseInt(latest.slice(prefix.length), 10) : 0;
  const next = (Number.isFinite(last) ? last : 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

/** Repayment = Principal × (1 + Interest / 100), rounded to the pesewa. */
export function calculateRepayment(principal: number, interestRate: number): number {
  return Math.round(principal * (1 + interestRate / 100) * 100) / 100;
}

export function calculateInterest(principal: number, interestRate: number): number {
  return Math.round(principal * (interestRate / 100) * 100) / 100;
}

/** Adds whole calendar months to an ISO date/datetime, returning YYYY-MM-DD. */
export function addMonths(isoDate: string, months: number): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export function formatCedis(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  const hasPesewas = Math.round(amount * 100) % 100 !== 0;
  return `GHS ${amount.toLocaleString("en-GB", {
    minimumFractionDigits: hasPesewas ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(rate: number | null | undefined): string {
  if (rate == null || !Number.isFinite(rate)) return "—";
  return `${rate.toLocaleString("en-GB", { maximumFractionDigits: 2 })}%`;
}

/** "25 Sept 2026" — Ghana is UTC year-round, so format in UTC. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return `${new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })} GMT`;
}

/**
 * Placeholders available inside CMS-edited agreement clauses, written as
 * {{name}}. Kept in one list so the Studio field description and the
 * interpolation below never drift apart.
 */
export const CLAUSE_PLACEHOLDERS = [
  "agreementNumber",
  "lenderName",
  "lenderEmail",
  "lenderPhone",
  "lenderAddress",
  "borrowerCompany",
  "borrowerSignatory",
  "borrowerSignatoryTitle",
  "principal",
  "interestRate",
  "interestAmount",
  "repayment",
  "termMonths",
  "fundedDate",
  "maturityDate",
  "paymentReference",
] as const;

export type ClauseValues = Record<(typeof CLAUSE_PLACEHOLDERS)[number], string>;

export function interpolateClause(text: string, values: ClauseValues): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? values[key as keyof ClauseValues] : match,
  );
}

/** Blank-line separated paragraphs, as authored in the Studio text field. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
