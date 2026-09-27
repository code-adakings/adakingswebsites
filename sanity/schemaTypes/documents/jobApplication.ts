import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES } from "../../../types/career";

/**
 * A candidate's application, created only by the job page form
 * (`lib/actions/job-application.ts`) under a private `jobApplication.<uuid>`
 * id. Applicant details are read-only; HR works the `status` and `notes`.
 */
export const jobApplication = defineType({
  name: "jobApplication",
  title: "Job Application",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "hr", title: "HR", default: true },
    { name: "applicant", title: "Applicant" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "hr",
      options: { list: [...APPLICATION_STATUSES], layout: "radio", direction: "horizontal" },
      initialValue: "New",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notes",
      title: "HR notes",
      type: "array",
      group: "hr",
      description: "Internal only. Add a note for each call, interview, or decision.",
      of: [
        defineArrayMember({
          type: "object",
          name: "hrNote",
          fields: [
            defineField({
              name: "text",
              title: "Note",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "author",
              title: "Added by",
              type: "string",
              initialValue: (_params, context) => context.currentUser?.name ?? "",
            }),
            defineField({
              name: "createdAt",
              title: "Added at",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
            }),
          ],
          preview: {
            select: { title: "text", author: "author", createdAt: "createdAt" },
            prepare({ title, author, createdAt }) {
              const date = createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : "";
              return { title, subtitle: [author, date].filter(Boolean).join(" · ") };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "job",
      title: "Job posting",
      type: "reference",
      group: ["hr", "applicant"],
      to: [{ type: "jobPosting" }],
      // Weak, so a posting can still be deleted once it's closed; jobTitle below keeps the history.
      weak: true,
      readOnly: true,
    }),
    defineField({
      name: "jobTitle",
      title: "Job title (at time of applying)",
      type: "string",
      group: "applicant",
      readOnly: true,
    }),
    defineField({ name: "fullName", title: "Full name", type: "string", group: "applicant", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", group: "applicant", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", group: "applicant", readOnly: true }),
    defineField({
      name: "areaOfResidence",
      title: "Area of residence",
      type: "string",
      group: "applicant",
      readOnly: true,
    }),
    defineField({
      name: "employmentType",
      title: "Preferred employment type",
      type: "string",
      group: "applicant",
      options: { list: [...EMPLOYMENT_TYPES] },
      readOnly: true,
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 6,
      group: "applicant",
      readOnly: true,
    }),
    defineField({
      name: "cv",
      title: "CV",
      type: "file",
      group: ["hr", "applicant"],
      options: { accept: "application/pdf" },
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      group: "applicant",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Submitted date, new first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "fullName", jobTitle: "jobTitle", status: "status", hasCv: "cv.asset._ref" },
    prepare({ title, jobTitle, status, hasCv }) {
      return {
        title,
        subtitle: [jobTitle, status, hasCv ? "CV" : null].filter(Boolean).join(" · "),
      };
    },
  },
});
