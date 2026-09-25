import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPostsForSitemap } from "@/lib/journal";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/our-story", changeFrequency: "monthly", priority: 0.6 },
  { path: "/menu", changeFrequency: "weekly", priority: 0.8 },
  { path: "/branches", changeFrequency: "weekly", priority: 0.8 },
  { path: "/catering", changeFrequency: "monthly", priority: 0.6 },
  { path: "/franchise", changeFrequency: "monthly", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.7 },
  { path: "/journal", changeFrequency: "daily", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostsForSitemap();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const journalEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noIndex)
    .map((post) => ({
      url: `${siteConfig.url}/journal/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...journalEntries];
}
