import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";
import { CLAUSE_PLACEHOLDERS } from "../../../lib/lending/shared";

export { LENDING_SETTINGS_ID } from "../../../lib/lending/shared";
import { DEFAULT_AGREEMENT_CLAUSES } from "../../../lib/lending/default-clauses";

/**
 * Operation New Frontiers deal settings: who signs for the borrower, where
 * lenders pay, defaults for new applications, and the agreement wording
 * every lender's agreement is generated from.
 */
export const lendingSettings = defineType({
  name: "lendingSettings",
  title: "Lending Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "borrower", title: "Borrower", default: true },
    { name: "payment", title: "Payment details" },
    { name: "agreement", title: "Agreement" },
  ],
  fields: [
    defineField({
      name: "borrowerCompany",
      title: "Borrower (company)",
      type: "string",
      initialValue: "Adakings Foods & Beverages Company (Adakings Franchise Corporation LTD)",
      validation: (rule) => rule.required(),
      group: "borrower",
    }),
    defineField({
      name: "borrowerSignatory",
      title: "Signatory name",
      type: "string",
      initialValue: "Kingsley K. Adase",
      validation: (rule) => rule.required(),
      group: "borrower",
    }),
    defineField({
      name: "borrowerSignatoryTitle",
      title: "Signatory title",
      type: "string",
      initialValue: "Founder & Chief Visionary",
      group: "borrower",
    }),
    defineField({
      name: "defaultInterestRate",
      title: "Default interest rate (%)",
      type: "number",
      initialValue: 17.5,
      description: "Pre-filled on each new application; negotiate per lender from there.",
      group: "borrower",
    }),
    defineField({
      name: "defaultTermMonths",
      title: "Default term (months)",
      type: "number",
      initialValue: 4,
      group: "borrower",
    }),

    defineField({
      name: "bank",
      title: "Bank transfer",
      type: "object",
      description: "Only shown to a lender after you send them payment instructions.",
      group: "payment",
      fields: [
        defineField({ name: "bankName", title: "Bank", type: "string" }),
        defineField({ name: "branch", title: "Branch", type: "string" }),
        defineField({ name: "accountName", title: "Account name", type: "string" }),
        defineField({ name: "accountNumber", title: "Account number", type: "string" }),
      ],
    }),
    defineField({
      name: "momo",
      title: "Mobile Money",
      type: "object",
      group: "payment",
      fields: [
        defineField({ name: "network", title: "Network", type: "string" }),
        defineField({ name: "number", title: "Number", type: "string" }),
        defineField({ name: "accountName", title: "Registered name", type: "string" }),
      ],
    }),
    defineField({
      name: "paymentNote",
      title: "Note under payment details",
      type: "text",
      rows: 2,
      initialValue:
        "After payment, our finance team will verify the transaction and activate your final agreement.",
      group: "payment",
    }),

    defineField({
      name: "clauses",
      title: "Agreement clauses",
      type: "array",
      group: "agreement",
      description: `Rendered in order on every agreement and PDF. Separate paragraphs with a blank line. Placeholders filled from each deal: ${CLAUSE_PLACEHOLDERS.map((p) => `{{${p}}}`).join(", ")}.`,
      initialValue: DEFAULT_AGREEMENT_CLAUSES.map((clause, index) => ({
        _key: `clause${index}`,
        _type: "clause",
        ...clause,
      })),
      of: [
        defineArrayMember({
          type: "object",
          name: "clause",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Text", type: "text", rows: 6, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "heading", subtitle: "body" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Lending Settings" }) },
});
