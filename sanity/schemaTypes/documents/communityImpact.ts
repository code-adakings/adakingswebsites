import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons";

export const communityImpact = defineType({
  name: "communityImpact",
  title: "Community Impact",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Community Impact",
      readOnly: true,
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "initiatives",
      title: "Initiatives",
      type: "array",
      of: [
        {
          type: "object",
          name: "initiative",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Community Impact" };
    },
  },
});
