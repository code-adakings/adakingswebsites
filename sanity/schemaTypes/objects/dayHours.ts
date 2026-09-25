import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const dayHours = defineType({
  name: "dayHours",
  title: "Day hours",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: { list: [...DAYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "opens",
      title: "Opens",
      type: "string",
      description: "e.g. 09:00",
      hidden: ({ parent }) => Boolean(parent?.closed),
    }),
    defineField({
      name: "closes",
      title: "Closes",
      type: "string",
      description: "e.g. 22:00",
      hidden: ({ parent }) => Boolean(parent?.closed),
    }),
  ],
  preview: {
    select: { day: "day", opens: "opens", closes: "closes", closed: "closed" },
    prepare({ day, opens, closes, closed }) {
      return {
        title: day,
        subtitle: closed ? "Closed" : [opens, closes].filter(Boolean).join(" – "),
      };
    },
  },
});
