import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

export const career = defineType({
  name: "career",
  title: "Career",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Job title",
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
      type: "string",
      options: {
        list: [
          "Kitchen & Culinary",
          "Branch Operations",
          "Delivery & Logistics",
          "Corporate & Support",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "East Legon, Accra" or "Remote"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment type",
      type: "string",
      options: { list: [...EMPLOYMENT_TYPES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "salary",
      title: "Salary",
      type: "string",
      description: 'e.g. "GHS 2,500 – 3,500 / month" — leave empty to omit.',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richTextBlock",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      description: "One requirement per line.",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "string" }],
      description: "One benefit per line.",
    }),
    defineField({
      name: "deadline",
      title: "Application deadline",
      type: "date",
      description: "Optional. Leave empty if the role stays open until filled.",
      validation: (rule) =>
        rule
          .min(new Date().toISOString().split("T")[0])
          .warning("Deadline is in the past."),
    }),
    defineField({
      name: "applicationUrl",
      title: "Application URL",
      type: "url",
      description: "Where candidates apply — an external ATS link or a mailto: link.",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Open", "Closed"] },
      initialValue: "Open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postedAt",
      title: "Posted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Posted date, new first",
      name: "postedAtDesc",
      by: [{ field: "postedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", department: "department", status: "status" },
    prepare({ title, department, status }) {
      return { title, subtitle: [department, status].filter(Boolean).join(" · ") };
    },
  },
});
