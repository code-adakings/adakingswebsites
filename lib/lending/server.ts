import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { writeClient } from "@/sanity/lib/write-client";
import { siteConfig } from "@/lib/site-config";
import { DEFAULT_AGREEMENT_CLAUSES, DEFAULT_BORROWER } from "@/lib/lending/default-clauses";
import {
  AGREEMENT_NUMBER_PATTERN,
  CONSENT_STATEMENT,
  CONSENT_VERSION,
  LENDING_SETTINGS_ID,
  formatCedis,
  formatDate,
  formatPercent,
  interpolateClause,
  normalizeVerificationCode,
  toParagraphs,
  verificationPath,
  type AgreementSnapshot,
  type ClauseValues,
  type LendingEmailKind,
  type LendingStatus,
} from "@/lib/lending/shared";

/**
 * Server-side data access for the lending workflow. Lending documents use
 * `lending.`-prefixed ids, which Sanity never serves to unauthenticated
 * requests — so every read here goes through the token-bearing writeClient.
 */

export interface LendingApplication {
  _id: string;
  _rev: string;
  publicToken: string;
  status: LendingStatus;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  requestedAmount?: string;
  message?: string;
  negotiatedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  repaymentAmount?: number;
  interestAmount?: number;
  fundedDate?: string;
  maturityDate?: string;
  agreementNumber?: string;
  verificationCode?: string;
  paymentReference?: string;
  paymentMethod?: "bank" | "momo";
  agreementSnapshot?: AgreementSnapshot;
  consentAccepted?: boolean;
  consentName?: string;
  consentAt?: string;
  consentIp?: string;
  consentUserAgent?: string;
  consentVersion?: string;
  consentStatement?: string;
  agreementHash?: string;
  appliedAt: string;
  approvedAt?: string;
  fundedAt?: string;
  completedAt?: string;
  statusHistory?: { status: LendingStatus; at: string; by?: string; note?: string; event?: "consent" | "override" }[];
  notifications?: { kind: LendingEmailKind; sentAt: string }[];
}

export interface LendingSettings {
  borrowerCompany: string;
  borrowerSignatory: string;
  borrowerSignatoryTitle?: string;
  defaultInterestRate: number;
  defaultTermMonths: number;
  bank?: { bankName?: string; branch?: string; accountName?: string; accountNumber?: string };
  momo?: { network?: string; number?: string; accountName?: string };
  paymentNote?: string;
  clauses: { heading: string; body: string }[];
}

const SETTINGS_FALLBACK: LendingSettings = {
  ...DEFAULT_BORROWER,
  defaultInterestRate: 17.5,
  defaultTermMonths: 4,
  paymentNote:
    "After payment, our finance team will verify the transaction against our statement and activate your final agreement.",
  clauses: DEFAULT_AGREEMENT_CLAUSES,
};

const TOKEN_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function requireClient() {
  if (!writeClient) throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  return writeClient;
}

function siteOrigin() {
  return (process.env.SITE_URL || siteConfig.url).replace(/\/$/, "");
}

export function lendingUrl(token: string, suffix = ""): string {
  return `${siteOrigin()}/new-frontiers/d/${token}${suffix}`;
}

/** Absolute public verification URL (for the PDF's QR code), or null before approval. */
export function verificationUrl(app: LendingApplication): string | null {
  if (!app.agreementNumber || !app.verificationCode) return null;
  return `${siteOrigin()}${verificationPath(app.agreementNumber, app.verificationCode)}`;
}

export async function getLendingSettings(): Promise<LendingSettings> {
  const stored = await requireClient().fetch<Partial<LendingSettings> | null>(
    `*[_id == $id][0]{ borrowerCompany, borrowerSignatory, borrowerSignatoryTitle, defaultInterestRate, defaultTermMonths, bank, momo, paymentNote, clauses[]{ heading, body } }`,
    { id: LENDING_SETTINGS_ID },
    { cache: "no-store" },
  );
  const defined = Object.fromEntries(
    Object.entries(stored ?? {}).filter(([, value]) => value != null),
  ) as Partial<LendingSettings>;
  return {
    ...SETTINGS_FALLBACK,
    ...defined,
    clauses: stored?.clauses?.length ? stored.clauses : SETTINGS_FALLBACK.clauses,
  };
}

const APPLICATION_PROJECTION = `{
  _id, _rev, publicToken, status, fullName, email, phone, address, requestedAmount, message,
  negotiatedAmount, interestRate, termMonths, repaymentAmount, interestAmount, fundedDate, maturityDate,
  agreementNumber, verificationCode, paymentReference, paymentMethod,
  agreementSnapshot{ borrowerCompany, borrowerSignatory, borrowerSignatoryTitle, clauses[]{ heading, body }, takenAt },
  consentAccepted, consentName, consentAt, consentIp, consentUserAgent, consentVersion, consentStatement, agreementHash,
  appliedAt, approvedAt, fundedAt, completedAt,
  statusHistory[]{ status, at, by, note, event }, notifications[]{ kind, sentAt }
}`;

export async function getApplicationByToken(token: string): Promise<LendingApplication | null> {
  if (!TOKEN_PATTERN.test(token)) return null;
  return requireClient().fetch<LendingApplication | null>(
    `*[_type == "lendingApplication" && publicToken == $publicToken && !(_id in path("drafts.**"))][0]${APPLICATION_PROJECTION}`,
    { publicToken: token },
    { cache: "no-store" },
  );
}

export async function getApplicationById(id: string): Promise<LendingApplication | null> {
  return requireClient().fetch<LendingApplication | null>(
    `*[_type == "lendingApplication" && _id == $id][0]${APPLICATION_PROJECTION}`,
    { id },
    { cache: "no-store" },
  );
}

/**
 * Public verification lookup: needs both the agreement number and the secret
 * code printed on the PDF, and returns null for any mismatch — so it can't be
 * used to enumerate agreements or confirm that a number exists.
 */
export async function getApplicationForVerification(
  agreementNumber: string,
  code: string,
): Promise<LendingApplication | null> {
  const ref = agreementNumber.trim().toUpperCase();
  const normalized = normalizeVerificationCode(code);
  if (!AGREEMENT_NUMBER_PATTERN.test(ref) || normalized.length !== 14) return null;
  return requireClient().fetch<LendingApplication | null>(
    `*[_type == "lendingApplication" && agreementNumber == $ref && verificationCode == $code && !(_id in path("drafts.**"))][0]${APPLICATION_PROJECTION}`,
    { ref, code: normalized },
    { cache: "no-store" },
  );
}

export async function createApplication(input: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  requestedAmount: string;
  message: string;
  acknowledged: boolean;
}): Promise<LendingApplication> {
  const client = requireClient();
  const settings = await getLendingSettings();
  const now = new Date().toISOString();
  const publicToken = randomUUID();

  const created = await client.create({
    _id: `lending.${randomUUID()}`,
    _type: "lendingApplication",
    ...input,
    publicToken,
    status: "APPLIED",
    appliedAt: now,
    interestRate: settings.defaultInterestRate,
    termMonths: settings.defaultTermMonths,
    negotiatedAmount: parseRequestedAmount(input.requestedAmount),
    statusHistory: [{ _type: "statusChange", _key: randomUUID(), status: "APPLIED", at: now, by: "Lender (website)" }],
  });
  return created as unknown as LendingApplication;
}

/** Pre-fills the negotiable principal from the form's "GHS 10,000" option (not "50,000+"). */
function parseRequestedAmount(amount: string): number | undefined {
  if (amount.includes("+")) return undefined;
  const value = Number(amount.replace(/[^\d.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * The lender's "Proceed to payment" step (APPROVED → PAYMENT_PENDING), which
 * reveals the bank and MoMo details. Guarded by the revision we read, so it
 * can't race an admin edit or override.
 */
export async function advanceToPaymentPending(application: LendingApplication): Promise<void> {
  const now = new Date().toISOString();
  await requireClient()
    .patch(application._id)
    .ifRevisionId(application._rev)
    .set({ status: "PAYMENT_PENDING" })
    .setIfMissing({ statusHistory: [] })
    .append("statusHistory", [
      { _type: "statusChange", _key: randomUUID(), status: "PAYMENT_PENDING", at: now, by: `Lender (${application.fullName})` },
    ])
    .commit();
}

/**
 * Records the lender's electronic signature — permanently, alongside a
 * fingerprint of the exact agreement they consented to. The status stays
 * PAYMENT_RECEIVED (finance archives it to COMPLETED). Guarded by the
 * revision we read, so it can't race an admin transition.
 */
export async function recordConsent(
  application: LendingApplication,
  settings: LendingSettings,
  consent: { name: string; ip?: string; userAgent?: string },
): Promise<void> {
  const now = new Date().toISOString();
  await requireClient()
    .patch(application._id)
    .ifRevisionId(application._rev)
    .set({
      consentAccepted: true,
      consentName: consent.name,
      consentAt: now,
      consentIp: consent.ip,
      consentUserAgent: consent.userAgent?.slice(0, 500),
      consentVersion: CONSENT_VERSION,
      consentStatement: CONSENT_STATEMENT,
      agreementHash: agreementFingerprint(application, settings),
    })
    .setIfMissing({ statusHistory: [] })
    .append("statusHistory", [
      {
        _type: "statusChange",
        _key: randomUUID(),
        status: application.status,
        at: now,
        by: `Lender (${consent.name})`,
        event: "consent",
        note: `Digital consent given (${CONSENT_VERSION})`,
      },
    ])
    .commit();
}

export async function recordNotification(application: LendingApplication, kind: LendingEmailKind) {
  await requireClient()
    .patch(application._id)
    .setIfMissing({ notifications: [] })
    .append("notifications", [{ _key: randomUUID(), kind, sentAt: new Date().toISOString() }])
    .commit();
}

/** When the application most recently entered its current status (an override can re-enter one). */
export function enteredCurrentStatusAt(app: LendingApplication): string {
  const entries = (app.statusHistory ?? []).filter(
    (entry) => entry.status === app.status && entry.event !== "consent",
  );
  return entries.at(-1)?.at ?? app.appliedAt;
}

/**
 * The borrower and clause wording this agreement is bound to: the snapshot
 * frozen at approval, or — for agreements approved before snapshots existed
 * and for applications not yet approved — the live settings.
 */
export function agreementTerms(app: LendingApplication, settings: LendingSettings) {
  const snapshot = app.agreementSnapshot;
  return snapshot?.clauses?.length
    ? {
        borrowerCompany: snapshot.borrowerCompany,
        borrowerSignatory: snapshot.borrowerSignatory,
        borrowerSignatoryTitle: snapshot.borrowerSignatoryTitle,
        clauses: snapshot.clauses,
      }
    : {
        borrowerCompany: settings.borrowerCompany,
        borrowerSignatory: settings.borrowerSignatory,
        borrowerSignatoryTitle: settings.borrowerSignatoryTitle,
        clauses: settings.clauses,
      };
}

export type AgreementParties = ReturnType<typeof agreementTerms>;

/** Values for {{placeholders}} in the clauses. Unknown-yet dates read as their rule. */
export function clauseValues(app: LendingApplication, terms: AgreementParties): ClauseValues {
  return {
    agreementNumber: app.agreementNumber ?? "(assigned on approval)",
    lenderName: app.fullName,
    lenderEmail: app.email,
    lenderPhone: app.phone,
    lenderAddress: app.address || "(address on file)",
    borrowerCompany: terms.borrowerCompany,
    borrowerSignatory: terms.borrowerSignatory,
    borrowerSignatoryTitle: terms.borrowerSignatoryTitle ?? "",
    principal: formatCedis(app.negotiatedAmount),
    interestRate: formatPercent(app.interestRate),
    interestAmount: formatCedis(app.interestAmount),
    repayment: formatCedis(app.repaymentAmount),
    termMonths: String(app.termMonths ?? ""),
    fundedDate: app.fundedDate ? formatDate(app.fundedDate) : "the date funds are received",
    maturityDate: app.maturityDate
      ? formatDate(app.maturityDate)
      : `${app.termMonths ?? ""} months from the date funds are received`,
    paymentReference: app.paymentReference ?? app.agreementNumber ?? "(assigned on approval)",
  };
}

export function renderClauses(app: LendingApplication, settings: LendingSettings) {
  const terms = agreementTerms(app, settings);
  const values = clauseValues(app, terms);
  return terms.clauses.map((clause) => ({
    heading: interpolateClause(clause.heading, values),
    paragraphs: toParagraphs(interpolateClause(clause.body, values)),
  }));
}

/**
 * SHA-256 over the raw legal content of the agreement — parties, terms, dates
 * and clause wording — in a fixed field order. Stored at consent time, then
 * recomputed on the verification page: a match proves nothing the lender
 * agreed to has been altered since.
 */
export function agreementFingerprint(app: LendingApplication, settings: LendingSettings): string {
  const terms = agreementTerms(app, settings);
  const canonical = JSON.stringify([
    app.agreementNumber ?? null,
    [app.fullName, app.email, app.phone, app.address ?? null],
    [terms.borrowerCompany, terms.borrowerSignatory, terms.borrowerSignatoryTitle ?? null],
    [
      app.negotiatedAmount ?? null,
      app.interestRate ?? null,
      app.interestAmount ?? null,
      app.repaymentAmount ?? null,
      app.termMonths ?? null,
    ],
    [app.fundedDate ?? null, app.maturityDate ?? null, app.paymentReference ?? null],
    terms.clauses.map((clause) => [clause.heading, clause.body]),
  ]);
  return createHash("sha256").update(canonical).digest("hex");
}
