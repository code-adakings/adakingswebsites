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

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers Page",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "whyWorkHere", title: "Why Work Here" },
    { name: "lifeAtAdakings", title: "Life at Adakings" },
    { name: "departments", title: "Departments" },
    { name: "hiringProcess", title: "Hiring Process" },
    { name: "employeeValues", title: "Employee Values" },
    { name: "finalCta", title: "Final CTA" },
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
      description: "Shown on the Careers page and reused on the homepage careers promo.",
    }),
    defineField({
      name: "cvCtaLabel",
      title: '"Send us your CV" button label',
      type: "string",
      group: "hero",
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
      title: "Life at Adakings",
      type: "object",
      group: "lifeAtAdakings",
      description: "Editorial section with a photo gallery and an optional employee quote.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "gallery",
          title: "Gallery",
          type: "array",
          validation: (rule) => rule.max(6),
          of: [{ type: "image", options: { hotspot: true } }],
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
      name: "departments",
      title: "Departments",
      type: "array",
      group: "departments",
      description: "Shown as \"Where you could work\" within the Life at Adakings section.",
      of: [
        {
          type: "object",
          name: "department",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "name", subtitle: "description" } },
        },
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
      name: "employeeValues",
      title: "Employee Values",
      type: "object",
      group: "employeeValues",
      description: "Core values that guide how the team works, e.g. Integrity, Hustle, Hospitality.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "values",
          title: "Values",
          type: "array",
          validation: (rule) => rule.max(6),
          of: [
            {
              type: "object",
              name: "employeeValue",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA",
      type: "object",
      group: "finalCta",
      description: "Closing call-to-action shown at the bottom of the Careers page.",
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
