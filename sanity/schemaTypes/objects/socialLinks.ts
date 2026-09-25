import { defineField, defineType } from "sanity";
import { ShareIcon } from "@sanity/icons";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social links",
  type: "object",
  icon: ShareIcon,
  fields: [
    defineField({ name: "instagram", title: "Instagram", type: "url" }),
    defineField({ name: "facebook", title: "Facebook", type: "url" }),
    defineField({ name: "twitter", title: "Twitter / X", type: "url" }),
    defineField({ name: "tiktok", title: "TikTok", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
  ],
  options: { collapsible: true, collapsed: true },
});
