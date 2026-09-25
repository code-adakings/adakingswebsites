import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Call to action",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path (e.g. /branches) or full URL (e.g. https://...)",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
