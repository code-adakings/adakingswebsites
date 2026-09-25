import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const newFrontiersLead = defineType({
  name: "newFrontiersLead",
  title: "Lending Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "amount",
      title: "Intended investment amount",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "acknowledged",
      title: "Acknowledged lending terms",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["New", "Contacted", "Closed"] },
      initialValue: "New",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
    select: { title: "fullName", amount: "amount", status: "status" },
    prepare({ title, amount, status }) {
      return { title, subtitle: [amount, status].filter(Boolean).join(" · ") };
    },
  },
});
