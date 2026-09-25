import { defineField, defineType } from "sanity";
import { LockIcon } from "@sanity/icons";

const WHY_NOW_ICONS = [
  { title: "People", value: "users" },
  { title: "Technology", value: "cpu" },
  { title: "Marketing", value: "megaphone" },
  { title: "Cash Flow", value: "wallet" },
  { title: "Growth", value: "trending-up" },
  { title: "Trust", value: "shield-check" },
  { title: "Operations", value: "building" },
];

export const privateLandingPage = defineType({
  name: "privateLandingPage",
  title: "Private Landing Page",
  type: "document",
  icon: LockIcon,
  groups: [
    { name: "internal", title: "Internal", default: true },
    { name: "hero", title: "Hero" },
    { name: "foundersLetter", title: "Founder's Letter" },
    { name: "whyNow", title: "Why Now" },
    { name: "businessToday", title: "Business Today" },
    { name: "roadmap", title: "Roadmap" },
    { name: "investmentTerms", title: "Investment Terms" },
    { name: "cta", title: "Call to Action" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal title",
      type: "string",
      description: "For your reference in Studio only — never shown on the page.",
      group: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description:
        "Controls the page's web address, e.g. \"new-frontiers\" publishes at adakings.com/new-frontiers. This page is never linked from site navigation — only people with the direct link can find it.",
      options: { source: "internalTitle", maxLength: 96 },
      group: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2 }),
        defineField({ name: "description", title: "Supporting description", type: "text", rows: 3 }),
        defineField({ name: "primaryCtaLabel", title: "Primary button label", type: "string" }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary button label", type: "string" }),
        defineField({
          name: "heroImage",
          title: "Hero image",
          type: "image",
          description: "Shown as a full-width photo beneath the headline and CTAs.",
          options: { hotspot: true },
        }),
        defineField({
          name: "metrics",
          title: "Metrics",
          type: "array",
          validation: (rule) => rule.max(4),
          of: [
            {
              type: "object",
              name: "heroMetric",
              fields: [
                defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "foundersLetter",
      title: "Founder's Letter",
      type: "object",
      group: "foundersLetter",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Founder's Letter" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          description: "One entry per paragraph, in order.",
          type: "array",
          of: [{ type: "text", rows: 3 }],
        }),
        defineField({ name: "signatureName", title: "Signature name", type: "string" }),
        defineField({ name: "signatureRole", title: "Signature role", type: "string" }),
      ],
    }),
    defineField({
      name: "whyNow",
      title: "Why Now",
      type: "object",
      group: "whyNow",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "body",
          title: "Body",
          description: "One entry per paragraph.",
          type: "array",
          of: [{ type: "text", rows: 3 }],
        }),
        defineField({
          name: "features",
          title: "Feature cards",
          type: "array",
          validation: (rule) => rule.max(4),
          of: [
            {
              type: "object",
              name: "whyNowFeature",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: WHY_NOW_ICONS },
                  validation: (rule) => rule.required(),
                }),
                defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "title", subtitle: "icon" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "businessToday",
      title: "Business Today",
      type: "object",
      group: "businessToday",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
        defineField({
          name: "serviceAreas",
          title: "Service areas",
          description: "Shown as pills, one per entry.",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "metrics",
          title: "Metrics",
          type: "array",
          validation: (rule) => rule.max(2),
          of: [
            {
              type: "object",
              name: "businessMetric",
              fields: [
                defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "roadmap",
      title: "Roadmap",
      type: "object",
      group: "roadmap",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "phases",
          title: "Phases",
          type: "array",
          of: [
            {
              type: "object",
              name: "roadmapPhase",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", description: "e.g. Phase 1", validation: (rule) => rule.required() }),
                defineField({ name: "amount", title: "Amount", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Description", type: "string" }),
                defineField({ name: "status", title: "Status badge", type: "string", description: "e.g. Current Round, Coming Next" }),
                defineField({
                  name: "isCurrent",
                  title: "Highlight as current round?",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
              preview: { select: { title: "label", subtitle: "amount" } },
            },
          ],
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({
      name: "investmentTerms",
      title: "Investment Terms",
      type: "object",
      group: "investmentTerms",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Investment Terms" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "headlineRate", title: "Headline rate", type: "string", description: "e.g. 17.5%" }),
        defineField({ name: "rateCaption", title: "Rate caption", type: "string" }),
        defineField({
          name: "repaymentRows",
          title: "Repayment table rows",
          type: "array",
          of: [
            {
              type: "object",
              name: "repaymentRow",
              fields: [
                defineField({ name: "investment", title: "Investment", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "interest", title: "Interest", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "total", title: "Total repayment", type: "string", validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "investment", subtitle: "total" } },
            },
          ],
        }),
        defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      group: "cta",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
        defineField({
          name: "investmentAmountOptions",
          title: "Investment amount options",
          description: "Shown in the form's amount dropdown, in order.",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "acknowledgementText", title: "Acknowledgement checkbox text", type: "string" }),
        defineField({ name: "submitLabel", title: "Submit button label", type: "string" }),
        defineField({ name: "disclaimer", title: "Footer disclaimer", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "internalTitle", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `/${slug}` : "No slug set yet" };
    },
  },
});
