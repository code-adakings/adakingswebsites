import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

const ADVANTAGE_ICONS = [
  { title: "Shield", value: "shield-check" },
  { title: "Award", value: "award" },
  { title: "Technology", value: "cpu" },
  { title: "Support", value: "headset" },
];

const PROCESS_ICONS = [
  { title: "Apply", value: "file-text" },
  { title: "Meet the team", value: "users" },
  { title: "Training & setup", value: "graduation-cap" },
  { title: "Launch", value: "rocket" },
];

export const franchisePage = defineType({
  name: "franchisePage",
  title: "Franchise Page",
  type: "document",
  icon: RocketIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "founderVision", title: "Founder's Vision" },
    { name: "advantages", title: "Why Adakings" },
    { name: "howItWorks", title: "How It Works" },
    { name: "trainingSupport", title: "Training & Support" },
    { name: "idealPartners", title: "Ideal Partners" },
    { name: "faq", title: "FAQ" },
    { name: "enquiry", title: "Enquiry form" },
    { name: "prospectus", title: "Prospectus CTA" },
    { name: "homeCta", title: "Homepage promo" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Franchise Page",
      readOnly: true,
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "heroImage",
          title: "Hero image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "primaryCta", title: "Primary CTA", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Secondary CTA", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "image",
      title: "Franchise image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Reused by the Franchise & Catering promo section on the homepage.",
    }),
    defineField({
      name: "whyFranchise",
      title: "Why Franchise With Us",
      type: "object",
      group: "hero",
      description: "Shown in the Franchise & Catering promo section on the homepage.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "founderVision",
      title: "Founder's Vision",
      type: "object",
      group: "founderVision",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 6 }),
        defineField({
          name: "image",
          title: "Photography",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "advantages",
      title: "Why Adakings",
      type: "object",
      group: "advantages",
      description: "Four advantage cards, e.g. proven systems, brand, technology, support.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          validation: (rule) => rule.max(4),
          of: [
            {
              type: "object",
              name: "advantageCard",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: ADVANTAGE_ICONS },
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
      name: "howItWorks",
      title: "How It Works",
      type: "object",
      group: "howItWorks",
      description: "Four-step franchise process: Apply, Meet the team, Training & setup, Launch.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          validation: (rule) => rule.max(4),
          of: [
            {
              type: "object",
              name: "franchiseProcessStep",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: PROCESS_ICONS },
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
      name: "trainingSupport",
      title: "Training & Support",
      type: "object",
      group: "trainingSupport",
      description: "Three editorial columns, e.g. Operations, Marketing, Technology.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "columns",
          title: "Columns",
          type: "array",
          validation: (rule) => rule.max(3),
          of: [
            {
              type: "object",
              name: "trainingColumn",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "idealPartners",
      title: "Ideal Partners",
      type: "object",
      group: "idealPartners",
      description: "Editorial section describing who Adakings wants to franchise with.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "bullets",
          title: "Bullets",
          type: "array",
          of: [{ type: "string" }],
          description: "One trait per line.",
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            {
              type: "object",
              name: "faqItem",
              fields: [
                defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "question", subtitle: "answer" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "enquiry",
      title: "Franchise Enquiry",
      type: "object",
      group: "enquiry",
      description: "Heading shown above the franchise enquiry form. Form fields are fixed in code.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "prospectus",
      title: "Prospectus CTA",
      type: "object",
      group: "prospectus",
      description: "Premium closing section. Do not include financial figures here.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "prospectusFile",
          title: "Prospectus file (PDF)",
          type: "file",
          options: { accept: ".pdf" },
        }),
        defineField({
          name: "primaryCtaLabel",
          title: '"Download Prospectus" button label',
          type: "string",
          initialValue: "Download Prospectus",
        }),
        defineField({
          name: "secondaryCta",
          title: '"Speak with Our Team" CTA',
          type: "ctaLink",
        }),
      ],
    }),
    defineField({
      name: "homeCta",
      title: "Homepage promo card",
      type: "object",
      group: "homeCta",
      description: "Shown in the Franchise & Catering promo section on the homepage.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "cta", title: "CTA", type: "ctaLink" }),
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
    prepare() {
      return { title: "Franchise Page" };
    },
  },
});
