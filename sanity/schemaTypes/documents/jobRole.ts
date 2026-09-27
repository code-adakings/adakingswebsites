import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const jobRole = defineType({
  name: "jobRole",
  title: "Job Role",
  type: "document",
  icon: UserIcon,
  description: "A reusable role (e.g. Line Cook). Each job posting advertises one role.",
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
      name: "department",
      title: "Department",
      type: "reference",
      to: [{ type: "department" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences. Shown on job cards and as the default meta description.",
      validation: (rule) => rule.max(240).warning("Keep summaries short so they fit on job cards."),
    }),
  ],
  preview: {
    select: { title: "title", department: "department.title" },
    prepare({ title, department }) {
      return { title, subtitle: department };
    },
  },
});
