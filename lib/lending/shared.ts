/**
 * Operation New Frontiers lending workflow — shared between the Next.js site
 * and Sanity Studio (so no server-only imports here).
 *
 * The lifecycle is forward-only, one step at a time:
 *
 *   Status            Moved there by                            Lender sees
 *   APPLIED           lender submits the form                   thank-you / received
 *   UNDER_REVIEW      automatically, when an admin opens it     waiting message
 *   APPROVED          finance: "Approve Terms"                  provisional agreement
 *   PAYMENT_PENDING   lender: "Proceed to payment"              bank & MoMo details
 *   PAYMENT_RECEIVED  finance: "Confirm Payment" (manual check) final agreement + consent
 *   COMPLETED         finance: "Mark Completed" (needs consent) executed agreement (archived)
 *
 * The lender's digital consent is an event recorded on PAYMENT_RECEIVED, not
 * a status of its own; the executed PDF exists only once both payment is
 * confirmed and consent is recorded (see isExecuted). Moving backwards needs
 * the administrator-only override in Studio, and is impossible once the
 * lender has consented — an executed agreement is never rewritten.
 */

export const STATUSES = [
  "APPLIED",
  "UNDER_REVIEW",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAYMENT_RECEIVED",
  "COMPLETED",
] as const;

export type LendingStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<LendingStatus, string> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_RECEIVED: "Payment Received",
  COMPLETED: "Completed",
};

export const STATUS_DESCRIPTIONS: Record<LendingStatus, string> = {
  APPLIED: "New — opens into review automatically",
  UNDER_REVIEW: "Negotiating terms",
  APPROVED: "Provisional agreement sent",
  PAYMENT_PENDING: "Waiting for funds — verify against statement",
  PAYMENT_RECEIVED: "Awaiting lender consent, then archive",
  COMPLETED: "Executed and archived",
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

/** Executed = funds verified by finance AND the lender's consent recorded. Gates the PDF. */
export function isExecuted(app: { status?: string; consentAt?: string | null }): boolean {
  return isAtLeast(app.status, "PAYMENT_RECEIVED") && Boolean(app.consentAt);
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

/** Guide rails for the negotiated rate; outside them Studio warns but still allows. */
export const INTEREST_RATE_RANGE = { min: 12, max: 22.5 } as const;

/**
 * Agreement numbers are the public reference (ONF-2026-0017); the UUID token
 * stays private. They're issued from a per-year counter document, bumped in
 * the same transaction as the approval so two approvals can never share one.
 */
export const AGREEMENT_NUMBER_PREFIX = "ONF";

export function agreementNumberPrefix(year: number) {
  return `${AGREEMENT_NUMBER_PREFIX}-${year}-`;
}

export function agreementCounterId(year: number) {
  return `lending.counter.${year}`;
}

export function formatAgreementNumber(year: number, sequence: number): string {
  return `${agreementNumberPrefix(year)}${String(sequence).padStart(4, "0")}`;
}

export function agreementSequence(agreementNumber: string | null | undefined, year: number): number {
  const prefix = agreementNumberPrefix(year);
  if (!agreementNumber?.startsWith(prefix)) return 0;
  const sequence = Number.parseInt(agreementNumber.slice(prefix.length), 10);
  return Number.isFinite(sequence) ? sequence : 0;
}

export const AGREEMENT_NUMBER_PATTERN = /^ONF-\d{4}-\d{4,}$/;

/**
 * Electronic signature. The statement is shown verbatim beside the "I Agree"
 * control and stored verbatim with each consent, so bump the version
 * whenever the wording changes — past agreements keep the text they signed.
 */
export const CONSENT_VERSION = "ONF-CONSENT-1.0";
export const CONSENT_STATEMENT =
  'I confirm that I have read and understood this Lending Agreement and I agree to be legally bound by its terms. I understand that selecting "I Agree" constitutes my electronic signature.';

/** Unambiguous alphabet (no 0/O, 1/I/L) for the code printed on the PDF. */
const VERIFICATION_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** 12 random characters as XXXX-XXXX-XXXX (~59 bits). Uses Web Crypto, so it runs in Studio too. */
export function generateVerificationCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = Array.from(bytes, (byte) => VERIFICATION_ALPHABET[byte % VERIFICATION_ALPHABET.length]);
  return [chars.slice(0, 4), chars.slice(4, 8), chars.slice(8)].map((group) => group.join("")).join("-");
}

export function normalizeVerificationCode(code: string): string {
  const compact = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return compact.length === 12 ? `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8)}` : compact;
}

/** Public path anyone can open (e.g. from the PDF's QR code) to check an agreement is genuine. */
export function verificationPath(agreementNumber: string, code: string): string {
  return `/new-frontiers/verify?ref=${encodeURIComponent(agreementNumber)}&code=${encodeURIComponent(code)}`;
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

/**
 * The borrower details and clause wording frozen onto an application when
 * finance approves it. The lender reviews, consents to, and downloads exactly
 * this text — later edits to Lending Settings only affect future approvals.
 */
export interface AgreementSnapshot {
  borrowerCompany: string;
  borrowerSignatory: string;
  borrowerSignatoryTitle?: string;
  clauses: { heading: string; body: string }[];
  takenAt: string;
}

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
