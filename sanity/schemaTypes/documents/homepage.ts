import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "metrics", title: "Trust metrics" },
    { name: "sections", title: "Homepage sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Homepage",
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
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "backgroundImage",
          title: "Background / product image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "primaryCta", title: "Primary CTA", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Secondary CTA", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "trustMetrics",
      title: "Trust metrics",
      type: "array",
      group: "metrics",
      description: 'Shown as the stat strip below the hero, e.g. "200,000+ / Meals Sold".',
      of: [
        {
          type: "object",
          name: "metric",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "branchesPreview",
      title: '"Branches across Ghana" section',
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "howOrderingWorks",
      title: '"How It Works" section',
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          validation: (rule) => rule.max(3),
          of: [
            {
              type: "object",
              name: "orderingStep",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "Smartphone", value: "smartphone" },
                      { title: "Chef hat", value: "chef-hat" },
                      { title: "Truck", value: "truck" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "title", subtitle: "icon" } },
            },
          ],
        }),
        defineField({ name: "cta", title: "CTA", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "testimonialsHeading",
      title: "Testimonials section heading",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "primaryCta", title: "Primary CTA", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Secondary CTA", type: "ctaLink" }),
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
      return { title: "Homepage" };
    },
  },
});
