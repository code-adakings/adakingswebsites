import "server-only";
import { randomUUID } from "node:crypto";
import { writeClient } from "@/sanity/lib/write-client";
import { siteConfig } from "@/lib/site-config";
import { DEFAULT_AGREEMENT_CLAUSES } from "@/lib/lending/default-clauses";
import {
  LENDING_SETTINGS_ID,
  formatCedis,
  formatDate,
  formatPercent,
  interpolateClause,
  toParagraphs,
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
  maturityDate?: string;
  agreementNumber?: string;
  paymentMethod?: "bank" | "momo";
  consentAccepted?: boolean;
  consentName?: string;
  consentAt?: string;
  appliedAt: string;
  approvedAt?: string;
  fundedAt?: string;
  completedAt?: string;
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
  borrowerCompany: "Adakings Foods & Beverages Company",
  borrowerSignatory: "Kingsley K. Adase",
  borrowerSignatoryTitle: "Founder & Chief Visionary",
  defaultInterestRate: 17.5,
  defaultTermMonths: 4,
  paymentNote:
    "After payment, our finance team will verify the transaction and activate your final agreement.",
  clauses: DEFAULT_AGREEMENT_CLAUSES,
};

const TOKEN_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function requireClient() {
  if (!writeClient) throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  return writeClient;
}

export function lendingUrl(token: string, suffix = ""): string {
  const base = (process.env.SITE_URL || siteConfig.url).replace(/\/$/, "");
  return `${base}/new-frontiers/d/${token}${suffix}`;
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
  negotiatedAmount, interestRate, termMonths, repaymentAmount, interestAmount, maturityDate,
  agreementNumber, paymentMethod, consentAccepted, consentName, consentAt,
  appliedAt, approvedAt, fundedAt, completedAt, notifications[]{ kind, sentAt }
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
 * Records the lender's electronic signature. Guarded by the revision we read,
 * so it can't race an admin transition, and only valid from PAYMENT_RECEIVED.
 */
export async function recordConsent(
  application: LendingApplication,
  consent: { name: string; ip?: string; userAgent?: string },
): Promise<void> {
  const now = new Date().toISOString();
  await requireClient()
    .patch(application._id)
    .ifRevisionId(application._rev)
    .set({
      status: "CONSENT_SIGNED",
      consentAccepted: true,
      consentName: consent.name,
      consentAt: now,
      consentIp: consent.ip,
      consentUserAgent: consent.userAgent?.slice(0, 300),
    })
    .setIfMissing({ statusHistory: [] })
    .append("statusHistory", [
      { _type: "statusChange", _key: randomUUID(), status: "CONSENT_SIGNED", at: now, by: `Lender (${consent.name})` },
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

/** Values for {{placeholders}} in the CMS clauses. Unknown-yet dates read as their rule. */
export function clauseValues(app: LendingApplication, settings: LendingSettings): ClauseValues {
  return {
    agreementNumber: app.agreementNumber ?? "(assigned on approval)",
    lenderName: app.fullName,
    lenderEmail: app.email,
    lenderPhone: app.phone,
    lenderAddress: app.address || "(address on file)",
    borrowerCompany: settings.borrowerCompany,
    borrowerSignatory: settings.borrowerSignatory,
    borrowerSignatoryTitle: settings.borrowerSignatoryTitle ?? "",
    principal: formatCedis(app.negotiatedAmount),
    interestRate: formatPercent(app.interestRate),
    interestAmount: formatCedis(app.interestAmount),
    repayment: formatCedis(app.repaymentAmount),
    termMonths: String(app.termMonths ?? ""),
    fundedDate: app.fundedAt ? formatDate(app.fundedAt) : "the date funds are received",
    maturityDate: app.maturityDate
      ? formatDate(app.maturityDate)
      : `${app.termMonths ?? ""} months from the date funds are received`,
    paymentReference: app.agreementNumber ?? "(assigned on approval)",
  };
}

export function renderClauses(app: LendingApplication, settings: LendingSettings) {
  const values = clauseValues(app, settings);
  return settings.clauses.map((clause) => ({
    heading: interpolateClause(clause.heading, values),
    paragraphs: toParagraphs(interpolateClause(clause.body, values)),
  }));
}
