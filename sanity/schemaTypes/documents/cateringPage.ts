import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const cateringPage = defineType({
  name: "cateringPage",
  title: "Catering Page",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "homeCta", title: "Homepage promo" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Catering Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "highlights",
      title: "What we offer",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Catering image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({ name: "cta", title: "CTA", type: "ctaLink", group: "hero" }),
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
      return { title: "Catering Page" };
    },
  },
});
