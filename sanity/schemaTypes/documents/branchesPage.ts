import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

const SERVICE_ICONS = ["delivery", "pickup", "catering"] as const;

export const branchesPage = defineType({
  name: "branchesPage",
  title: "Branches Page",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Branches Page",
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
          description: "Large, immersive photography used as the hero background.",
        }),
        defineField({
          name: "cta",
          title: "CTA",
          type: "ctaLink",
          description: "E.g. \"View Locations\" linking to #locations on this page.",
        }),
      ],
    }),
    defineField({
      name: "mapSection",
      title: "Map & locations heading",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "servicesSection",
      title: "Services section",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "items",
          title: "Services",
          type: "array",
          description: "Exactly three: Delivery, Pickup, Catering.",
          of: [
            {
              type: "object",
              name: "service",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: { list: [...SERVICE_ICONS] },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 2,
                }),
              ],
              preview: { select: { title: "title", subtitle: "icon" } },
            },
          ],
          validation: (rule) => rule.max(3),
        }),
      ],
    }),
    defineField({
      name: "growth",
      title: "Growth & expansion",
      type: "object",
      group: "content",
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
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA",
      type: "object",
      group: "content",
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
      return { title: "Branches Page" };
    },
  },
});
