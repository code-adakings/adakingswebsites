import { defineField, defineType } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "price",
      title: "Price (GHS)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show this item in signature/featured menu slots.",
      initialValue: false,
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      description: "Turn off to hide this item without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first within its category.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "category.title", media: "image" },
  },
});
