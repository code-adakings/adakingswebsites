import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";
import { EMPLOYMENT_TYPES, JOB_STATUSES } from "../../../types/career";

export const jobPosting = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Job title",
      type: "string",
      group: "details",
      description: 'Public title, e.g. "Line Cook — TF Hostel".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      description: "Becomes the page URL: /careers/<slug>.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "reference",
      group: "details",
      to: [{ type: "jobRole" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "reference",
      group: "details",
      to: [{ type: "department" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "branch",
      title: "Branch",
      type: "reference",
      group: "details",
      to: [{ type: "branch" }],
      description: "Leave empty for roles not tied to one branch (e.g. head office).",
    }),
    defineField({
      name: "employmentType",
      title: "Employment type",
      type: "string",
      group: "details",
      options: { list: [...EMPLOYMENT_TYPES], layout: "radio", direction: "horizontal" },
      initialValue: "Full-time",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "salary",
      title: "Salary",
      type: "string",
      group: "details",
      description: 'e.g. "GHS 2,500 – 3,500 / month". Leave empty to hide.',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "details",
      description: 'e.g. "Legon, Accra".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      options: { list: [...JOB_STATUSES], layout: "radio", direction: "horizontal" },
      initialValue: "Open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deadline",
      title: "Application deadline",
      type: "date",
      group: "details",
      description: "Optional. Leave empty if the role stays open until filled.",
    }),
    defineField({
      name: "postedAt",
      title: "Posted at",
      type: "datetime",
      group: "details",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richTextBlock",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "richTextBlock",
      group: "content",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "richTextBlock",
      group: "content",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "richTextBlock",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
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
    select: {
      title: "title",
      department: "department.title",
      status: "status",
    },
    prepare({ title, department, status }) {
      return {
        title,
        subtitle: [department, status].filter(Boolean).join(" · "),
      };
    },
  },
});
