import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "company", title: "Company information" },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "contact", title: "Contact & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Site Settings",
      readOnly: true,
    }),
    defineField({
      name: "siteName",
      title: "Brand name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Legal company name",
      type: "string",
      group: "general",
      description: "Used in the footer copyright line.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "general",
      description: "Used as the default meta description and Open Graph description.",
    }),
    defineField({
      name: "longDescription",
      title: "Long description",
      type: "text",
      rows: 6,
      group: "general",
      description: "Fuller company description for about/press use.",
    }),
    defineField({
      name: "orderUrl",
      title: "Online ordering URL",
      type: "url",
      group: "general",
    }),
    defineField({
      name: "registeredAddress",
      title: "Registered address",
      type: "text",
      rows: 3,
      group: "company",
      description: "Registered company address for legal/invoicing use.",
    }),
    defineField({
      name: "gpsAddress",
      title: "GPS address",
      type: "geopoint",
      group: "company",
      description: "Headquarters location, e.g. for a map embed.",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      group: "company",
    }),
    defineField({
      name: "businessHours",
      title: "Business hours",
      type: "array",
      group: "company",
      of: [{ type: "dayHours" }],
    }),
    defineField({
      name: "navigation",
      title: "Main navigation",
      type: "array",
      group: "navigation",
      of: [{ type: "navItem" }],
    }),
    defineField({
      name: "footerNav",
      title: "Footer link groups",
      type: "array",
      group: "footer",
      of: [{ type: "footerNavGroup" }],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "socialLinks",
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Primary email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "supportEmail",
      title: "Support email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Primary phone",
      type: "string",
      group: "contact",
      description: "Used for quick \"call us\" links in the header and footer.",
    }),
    defineField({
      name: "phoneNumbers",
      title: "Phone numbers",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          name: "phoneNumber",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "number",
              title: "Number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "number" },
          },
        },
      ],
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "Include country code, e.g. +233000000000.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
