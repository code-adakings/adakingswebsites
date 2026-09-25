import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Contact Page",
      readOnly: true,
    }),
    defineField({ name: "hero", title: "Hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "branchesBlock",
      title: "Branches block",
      type: "object",
      group: "hero",
      description: 'The "Find your nearest Adakings" contact block.',
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "linkLabel", title: "Link label", type: "string" }),
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
      return { title: "Contact Page" };
    },
  },
});
