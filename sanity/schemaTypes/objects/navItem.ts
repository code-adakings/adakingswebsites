import { defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

export const navItem = defineType({
  name: "navItem",
  title: "Navigation item",
  type: "object",
  icon: MenuIcon,
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

export const footerNavGroup = defineType({
  name: "footerNavGroup",
  title: "Footer link group",
  type: "object",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "title",
      title: "Group title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Links",
      type: "array",
      of: [{ type: "navItem" }],
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare({ title, items }) {
      return { title, subtitle: `${items?.length ?? 0} link(s)` };
    },
  },
});
