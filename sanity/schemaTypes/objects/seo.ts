import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Overrides the default title tag for search engines and browser tabs.",
      validation: (rule) => rule.max(60).warning("Longer titles may be truncated by search engines."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Longer descriptions may be truncated by search engines."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Used for social previews (Open Graph / Twitter cards). Falls back to the page's hero image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
