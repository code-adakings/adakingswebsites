import { defineField, defineType } from "sanity";
import { UlistIcon } from "@sanity/icons";

export const menuPage = defineType({
  name: "menuPage",
  title: "Menu Page",
  type: "document",
  icon: UlistIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "signature", title: "Signature meals" },
    { name: "categories", title: "Menu categories" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Menu Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "signatureMealsHeading",
      title: "Signature meals section heading",
      type: "object",
      group: "signature",
      description: "Shown above the signature meals on this page and on the homepage.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "signatureMeals",
      title: "Signature meals",
      type: "array",
      group: "signature",
      description: "Shown on this page and reused on the homepage.",
      of: [
        {
          type: "object",
          name: "signatureMeal",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "badge", title: "Badge", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "badge", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Menu categories",
      type: "array",
      group: "categories",
      of: [
        {
          type: "object",
          name: "menuCategory",
          fields: [
            defineField({ name: "name", title: "Category name", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "menuItem",
                  fields: [
                    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
                  ],
                  preview: { select: { title: "name", subtitle: "description" } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "name" },
            prepare({ title }: { title?: string }) {
              return { title };
            },
          },
        },
      ],
    }),
    defineField({
      name: "cta",
      title: "Order CTA",
      type: "ctaLink",
      group: "hero",
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
      return { title: "Menu Page" };
    },
  },
});
