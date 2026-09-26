/**
 * One-off migration to the Phase 2.1 lending lifecycle.
 *
 *   node scripts/migrate-lending-phase-2-1.mjs          # dry run: prints the plan
 *   node scripts/migrate-lending-phase-2-1.mjs --apply  # writes it
 *
 * - CONSENT_SIGNED is no longer a status: those move to PAYMENT_RECEIVED (the
 *   consent itself is kept), tagged with the wording they actually agreed to.
 * - Approved applications get a verification code (for the PDF QR code), a
 *   payment reference and a funding date if missing.
 * - Seeds each year's agreement counter from the highest number issued.
 *
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_WRITE_TOKEN from .env.local. Safe to re-run.
 */
import { randomInt } from "node:crypto";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;
const apply = process.argv.includes("--apply");
if (!projectId || !token) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");

const api = `https://${projectId}.api.sanity.io/v2025-01-01/data`;
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

// Wording shown on the consent checkbox before ONF-CONSENT-1.0.
const LEGACY_CONSENT = {
  consentVersion: "ONF-CONSENT-0.9",
  consentStatement:
    "I have read and agree to the terms of this Lending Agreement. I understand this constitutes my electronic signature.",
};

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const verificationCode = () => {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8).join("")}`;
};

const query = encodeURIComponent(
  `*[_type == "lendingApplication" && !(_id in path("drafts.**"))]{ _id, _rev, status, agreementNumber, verificationCode, paymentReference, fundedAt, fundedDate, consentAt, consentVersion }`,
);
const { result: docs } = await (await fetch(`${api}/query/${dataset}?query=${query}`, { headers })).json();

const mutations = [];
const maxByYear = {};

for (const doc of docs) {
  const set = {};
  if (doc.status === "CONSENT_SIGNED") set.status = "PAYMENT_RECEIVED";
  if (doc.consentAt && !doc.consentVersion) Object.assign(set, LEGACY_CONSENT);
  if (doc.agreementNumber) {
    if (!doc.verificationCode) set.verificationCode = verificationCode();
    if (!doc.paymentReference) set.paymentReference = doc.agreementNumber;
    const [, year, sequence] = doc.agreementNumber.match(/^ONF-(\d{4})-(\d+)$/) ?? [];
    if (year) maxByYear[year] = Math.max(maxByYear[year] ?? 0, Number(sequence));
  }
  if (doc.fundedAt && !doc.fundedDate) set.fundedDate = doc.fundedAt.slice(0, 10);

  if (Object.keys(set).length) {
    console.log(`${doc._id} (${doc.agreementNumber ?? "no number"}):`, set);
    mutations.push({ patch: { id: doc._id, ifRevisionID: doc._rev, set } });
  }
}

for (const [year, last] of Object.entries(maxByYear)) {
  const id = `lending.counter.${year}`;
  console.log(`${id}: last >= ${last}`);
  mutations.push({ createIfNotExists: { _id: id, _type: "lendingCounter", year: Number(year), last } });
}

if (!mutations.length) {
  console.log("Nothing to migrate.");
} else if (!apply) {
  console.log(`\nDry run — ${mutations.length} mutation(s). Re-run with --apply to write them.`);
} else {
  const response = await fetch(`${api}/mutate/${dataset}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ mutations }),
  });
  console.log(response.ok ? "Applied." : `Failed: ${response.status} ${await response.text()}`);
}
