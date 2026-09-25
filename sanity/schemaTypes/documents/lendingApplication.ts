import { defineArrayMember, defineField, defineType, type ConditionalPropertyCallbackContext } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  formatCedis,
  isAtLeast,
  type LendingStatus,
} from "../../../lib/lending/shared";
import { RepaymentInput } from "../../lending/repayment-input";

type Ctx = ConditionalPropertyCallbackContext;
const statusOf = (document: Ctx["document"]) => document?.status as string | undefined;

// Fields lock as the deal progresses, so nothing is edited once the lender
// has been sent terms — and so no stray draft can later overwrite the
// lender's consent (which the site writes straight to the published doc).
const lockedFrom = (status: LendingStatus) => ({ document }: Ctx) =>
  isAtLeast(statusOf(document), status);
const editableOnlyAt = (status: LendingStatus) => ({ document }: Ctx) =>
  (statusOf(document) ?? "APPLIED") !== status;
const hiddenBefore = (status: LendingStatus) => ({ document }: Ctx) =>
  !isAtLeast(statusOf(document), status);

/**
 * One document per lender application — the whole deal lives here, from
 * interest form to executed agreement. Created only by the site's form
 * (lib/lending/server.ts) with a `lending.` id prefix, which keeps these
 * financial records out of the dataset's public API. Status changes happen
 * only through the document actions in sanity/lending/actions.tsx.
 */
export const lendingApplication = defineType({
  name: "lendingApplication",
  title: "Lending Application",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "deal", title: "Deal", default: true },
    { name: "applicant", title: "Applicant" },
    { name: "payment", title: "Payment" },
    { name: "execution", title: "Execution" },
    { name: "timeline", title: "Timeline" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: STATUS_OPTIONS },
      initialValue: "APPLIED",
      readOnly: true,
      description:
        "Moves one step at a time using the action buttons at the bottom of this document — it can't be edited directly.",
      group: ["deal", "applicant"],
    }),
    defineField({
      name: "agreementNumber",
      title: "Agreement number",
      type: "string",
      readOnly: true,
      description: "Assigned automatically on approval. Also the lender's payment reference.",
      group: "deal",
    }),

    // Negotiated terms — editable until the agreement is approved.
    defineField({
      name: "negotiatedAmount",
      title: "Approved principal (GHS)",
      type: "number",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.min(1),
      group: "deal",
    }),
    defineField({
      name: "interestRate",
      title: "Interest rate (%)",
      type: "number",
      description: "Fixed return for the full term, e.g. 17.5.",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.min(0).max(100),
      group: "deal",
    }),
    defineField({
      name: "termMonths",
      title: "Term (months)",
      type: "number",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.integer().min(1),
      group: "deal",
    }),
    defineField({
      name: "repaymentAmount",
      title: "Repayment (GHS)",
      type: "number",
      readOnly: true,
      description: "Principal × (1 + interest ÷ 100). Calculated automatically.",
      components: { input: RepaymentInput },
      group: "deal",
    }),
    defineField({
      name: "interestAmount",
      title: "Interest amount (GHS)",
      type: "number",
      readOnly: true,
      hidden: ({ value }) => value == null,
      group: "deal",
    }),
    defineField({
      name: "maturityDate",
      title: "Maturity date",
      type: "date",
      description:
        "Leave empty to set it automatically to the term length after the payment is confirmed.",
      readOnly: lockedFrom("PAYMENT_RECEIVED"),
      group: "deal",
    }),
    defineField({
      name: "adminNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      description: "Never shown to the lender.",
      readOnly: lockedFrom("PAYMENT_RECEIVED"),
      group: "deal",
    }),

    // Applicant — as submitted on the form. Correctable until approval.
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.required(),
      group: "applicant",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.required().email(),
      group: "applicant",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      readOnly: lockedFrom("APPROVED"),
      validation: (rule) => rule.required(),
      group: "applicant",
    }),
    defineField({
      name: "address",
      title: "Residential address",
      type: "text",
      rows: 2,
      readOnly: lockedFrom("APPROVED"),
      group: "applicant",
    }),
    defineField({
      name: "requestedAmount",
      title: "Requested amount",
      type: "string",
      readOnly: true,
      group: "applicant",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      readOnly: true,
      group: "applicant",
    }),
    defineField({
      name: "acknowledged",
      title: "Acknowledged private-lending (not equity) terms",
      type: "boolean",
      readOnly: true,
      group: "applicant",
    }),
    defineField({
      name: "publicToken",
      title: "Private link token",
      type: "string",
      readOnly: true,
      description: "The lender's private URL is /new-frontiers/d/<token>. Never share it with anyone else.",
      group: "applicant",
    }),

    // Payment — recorded when confirming receipt of funds.
    defineField({
      name: "paymentMethod",
      title: "Payment method",
      type: "string",
      options: {
        list: [
          { title: "Bank transfer", value: "bank" },
          { title: "Mobile Money", value: "momo" },
        ],
        layout: "radio",
      },
      readOnly: editableOnlyAt("PAYMENT_PENDING"),
      hidden: hiddenBefore("PAYMENT_PENDING"),
      group: "payment",
    }),
    defineField({
      name: "paymentNotes",
      title: "Payment notes",
      type: "text",
      rows: 2,
      description: "e.g. bank transaction ID or MoMo transaction ID.",
      readOnly: editableOnlyAt("PAYMENT_PENDING"),
      hidden: hiddenBefore("PAYMENT_PENDING"),
      group: "payment",
    }),

    // Execution — written by the site when the lender signs.
    defineField({
      name: "consentAccepted",
      title: "Consent accepted",
      type: "boolean",
      readOnly: true,
      group: "execution",
    }),
    defineField({ name: "consentName", title: "Name typed as signature", type: "string", readOnly: true, group: "execution" }),
    defineField({ name: "consentAt", title: "Consent timestamp", type: "datetime", readOnly: true, group: "execution" }),
    defineField({ name: "consentIp", title: "Consent IP address", type: "string", readOnly: true, group: "execution" }),
    defineField({ name: "consentUserAgent", title: "Consent browser", type: "string", readOnly: true, group: "execution" }),

    defineField({ name: "appliedAt", title: "Applied", type: "datetime", readOnly: true, group: "timeline" }),
    defineField({ name: "approvedAt", title: "Approved", type: "datetime", readOnly: true, group: "timeline" }),
    defineField({ name: "fundedAt", title: "Funds received", type: "datetime", readOnly: true, group: "timeline" }),
    defineField({ name: "completedAt", title: "Completed", type: "datetime", readOnly: true, group: "timeline" }),
    defineField({
      name: "statusHistory",
      title: "Status history",
      type: "array",
      readOnly: true,
      group: "timeline",
      of: [
        defineArrayMember({
          type: "object",
          name: "statusChange",
          fields: [
            defineField({ name: "status", type: "string", options: { list: STATUS_OPTIONS } }),
            defineField({ name: "at", type: "datetime" }),
            defineField({ name: "by", type: "string" }),
          ],
          preview: {
            select: { status: "status", at: "at", by: "by" },
            prepare: ({ status, at, by }) => ({
              title: STATUS_LABELS[status as LendingStatus] ?? status,
              subtitle: [at && new Date(at).toLocaleString("en-GB"), by].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "notifications",
      title: "Emails sent to lender",
      type: "array",
      readOnly: true,
      group: "timeline",
      of: [
        defineArrayMember({
          type: "object",
          name: "notification",
          fields: [
            defineField({ name: "kind", type: "string" }),
            defineField({ name: "sentAt", type: "datetime" }),
          ],
          preview: {
            select: { title: "kind", at: "sentAt" },
            prepare: ({ title, at }) => ({
              title,
              subtitle: at && new Date(at).toLocaleString("en-GB"),
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    { title: "Applied, newest first", name: "appliedAtDesc", by: [{ field: "appliedAt", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "fullName",
      status: "status",
      principal: "negotiatedAmount",
      requested: "requestedAmount",
      agreementNumber: "agreementNumber",
    },
    prepare: ({ title, status, principal, requested, agreementNumber }) => ({
      title,
      subtitle: [
        STATUS_LABELS[status as LendingStatus] ?? status,
        principal != null ? formatCedis(principal) : requested,
        agreementNumber,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
