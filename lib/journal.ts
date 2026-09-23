import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { JournalFrontmatter, JournalPost } from "@/types/journal";

const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

function readPostFile(fileName: string): JournalPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const filePath = path.join(JOURNAL_DIR, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as JournalFrontmatter;

  return {
    ...frontmatter,
    slug,
    readingTime: readingTime(content).text,
  };
}

export function getAllPosts(): JournalPost[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readPostFile)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): JournalPost | null {
  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readPostFile(`${slug}.mdx`);
}

export function getFeaturedPost(): JournalPost | null {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  return Array.from(new Set(posts.map((post) => post.category)));
}

export function getRelatedPosts(current: JournalPost, limit = 3): JournalPost[] {
  return getAllPosts()
    .filter((post) => post.slug !== current.slug)
    .filter((post) => post.category === current.category)
    .slice(0, limit);
}
