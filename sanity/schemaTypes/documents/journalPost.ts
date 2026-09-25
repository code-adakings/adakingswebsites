import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary shown on listing cards and used as a fallback meta description.",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richTextBlock",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "Show this post in the Journal's featured slot.",
      initialValue: false,
    }),
    defineField({
      name: "readingTimeOverride",
      title: "Reading time override (minutes)",
      type: "number",
      group: "meta",
      description: "Leave empty to auto-calculate from the body content.",
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      group: "meta",
      description: "Optional manual picks. Falls back to posts sharing a category when empty.",
      of: [{ type: "reference", to: [{ type: "journalPost" }] }],
      validation: (rule) => rule.max(3).unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "heroImage", date: "publishedAt" },
    prepare({ title, author, media, date }) {
      return {
        title,
        subtitle: [author, date ? new Date(date).toLocaleDateString() : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
