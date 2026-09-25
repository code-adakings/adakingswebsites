import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const journalPage = defineType({
  name: "journalPage",
  title: "Journal Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "newsletter", title: "Newsletter" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Journal Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "newsletter",
      title: "Newsletter signup",
      type: "object",
      group: "newsletter",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
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
      return { title: "Journal Page" };
    },
  },
});
