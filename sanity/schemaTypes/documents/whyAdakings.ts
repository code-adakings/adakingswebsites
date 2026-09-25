import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

const ICONS = [
  { title: "Flame", value: "flame" },
  { title: "Leaf", value: "leaf" },
  { title: "Timer", value: "timer" },
  { title: "Heart", value: "heart" },
];

export const whyAdakings = defineType({
  name: "whyAdakings",
  title: "Why Adakings",
  type: "document",
  icon: SparklesIcon,
  description: "Shown on both the homepage and the About page.",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Why Adakings",
      readOnly: true,
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "reasons",
      title: "Reasons",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          name: "reason",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: ICONS },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Why Adakings" };
    },
  },
});
