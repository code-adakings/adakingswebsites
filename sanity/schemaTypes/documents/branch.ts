import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

const SERVICES = ["Dine-in", "Takeout", "Delivery", "Drive-thru", "Catering"] as const;

export const branch = defineType({
  name: "branch",
  title: "Branch",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      options: { list: ["Open", "Coming Soon", "Temporarily Closed"] },
      initialValue: "Open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      group: "details",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "location",
      title: "GPS coordinates",
      type: "geopoint",
      group: "details",
      description: "Sets both latitude and longitude.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps link",
      type: "url",
      group: "details",
      description: "Falls back to a link generated from the GPS coordinates (or address) if left blank.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "details",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      type: "array",
      group: "details",
      of: [{ type: "dayHours" }],
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: { list: [...SERVICES] },
    }),
    defineField({
      name: "acceptsDelivery",
      title: "Accepts delivery",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "acceptsPickup",
      title: "Accepts pickup",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      group: "details",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
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
    select: { title: "name", subtitle: "address", media: "heroImage" },
  },
});
