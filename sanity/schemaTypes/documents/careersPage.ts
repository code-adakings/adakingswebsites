import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

const WHY_WORK_HERE_ICONS = [
  { title: "Growth", value: "trending-up" },
  { title: "Teamwork", value: "users" },
  { title: "Benefits", value: "heart-handshake" },
  { title: "Training", value: "graduation-cap" },
];

const HIRING_PROCESS_ICONS = [
  { title: "Apply", value: "file-text" },
  { title: "Screening", value: "phone-call" },
  { title: "Interview", value: "users" },
  { title: "Offer", value: "clipboard-check" },
  { title: "Onboarding", value: "rocket" },
];

const BENEFIT_ICONS = [
  { title: "Wallet (pay)", value: "wallet" },
  { title: "Utensils (staff meals)", value: "utensils" },
  { title: "Graduation cap (training)", value: "graduation-cap" },
  { title: "Trending up (promotion)", value: "trending-up" },
  { title: "Shield (health & safety)", value: "shield-check" },
  { title: "Calendar (flexible shifts)", value: "calendar-clock" },
];

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers Page",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "whyWorkHere", title: "Why Work Here" },
    { name: "culture", title: "Culture Gallery" },
    { name: "hiringProcess", title: "Hiring Process" },
    { name: "benefits", title: "Benefits" },
    { name: "faq", title: "FAQ" },
    { name: "talentPool", title: "Talent Pool CTA" },
    { name: "homeCta", title: "Homepage promo" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Careers Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "image",
      title: "Team at work image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Shown in the Careers hero and used as the Careers social share image.",
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "whyWorkHere",
      title: "Why Work Here",
      type: "object",
      group: "whyWorkHere",
      description: "Four reason cards, e.g. growth, teamwork, benefits, training.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          validation: (rule) => rule.max(4),
          of: [
            {
              type: "object",
              name: "whyWorkHereCard",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: WHY_WORK_HERE_ICONS },
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
      name: "lifeAtAdakings",
      title: "Culture gallery",
      type: "object",
      group: "culture",
      description:
        "Photo gallery and an optional employee quote. Departments listed under it come from Careers → Departments.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "gallery",
          title: "Gallery",
          type: "array",
          validation: (rule) => rule.max(6),
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
            },
          ],
        }),
        defineField({
          name: "quote",
          title: "Employee quote",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Quote", type: "text", rows: 2 }),
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "hiringProcess",
      title: "Hiring Process",
      type: "object",
      group: "hiringProcess",
      description: "Steps candidates go through, e.g. Apply, Screening, Interview, Offer, Onboarding.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          validation: (rule) => rule.max(5),
          of: [
            {
              type: "object",
              name: "hiringProcessStep",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: HIRING_PROCESS_ICONS },
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
      name: "benefits",
      title: "Benefits",
      type: "object",
      group: "benefits",
      description: "Company-wide perks. Role-specific benefits live on each job posting.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "items",
          title: "Benefits",
          type: "array",
          validation: (rule) => rule.max(6),
          of: [
            {
              type: "object",
              name: "careersBenefit",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: BENEFIT_ICONS },
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
              name: "careersFaqItem",
              fields: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "question", subtitle: "answer" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "talentPool",
      title: "Talent Pool CTA",
      type: "object",
      group: "talentPool",
      description:
        "Closing call-to-action for candidates who don't see a matching role. Leave the CTA link empty to email the site contact address.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "cta", title: "CTA", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "homeCta",
      title: "Homepage promo card",
      type: "object",
      group: "homeCta",
      description: 'Shown in the "We\'re Hiring" section on the homepage.',
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
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
      return { title: "Careers Page" };
    },
  },
});
