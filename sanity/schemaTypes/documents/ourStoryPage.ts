import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export const ourStoryPage = defineType({
  name: "ourStoryPage",
  title: "Our Story Page",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "teaser", title: "Homepage teaser" },
    { name: "milestones", title: "Milestones" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Our Story Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "image",
      title: "Story image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Shown at the bottom of the Our Story page and on the homepage teaser.",
    }),
    defineField({
      name: "homeTeaser",
      title: "Homepage teaser copy",
      type: "object",
      group: "teaser",
      description: "Shown in the \"Our Story\" section on the homepage.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      group: "milestones",
      of: [
        {
          type: "object",
          name: "milestone",
          fields: [
            defineField({ name: "year", title: "Year / label", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "title", subtitle: "year" },
          },
        },
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
      return { title: "Our Story Page" };
    },
  },
});
