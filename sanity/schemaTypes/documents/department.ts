import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const DEPARTMENT_ICONS = [
  { title: "Kitchen (chef hat)", value: "chef-hat" },
  { title: "Customer service (headset)", value: "headset" },
  { title: "Delivery (bike)", value: "bike" },
  { title: "Marketing (megaphone)", value: "megaphone" },
  { title: "Operations (store)", value: "store" },
  { title: "Corporate (briefcase)", value: "briefcase" },
];

export const department = defineType({
  name: "department",
  title: "Department",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: DEPARTMENT_ICONS },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
