import readingTime from "reading-time";
import { sanityFetch } from "@/sanity/lib/fetch";
import { extractPlainText } from "@/sanity/lib/portable-text";
import {
  allJournalPostsQuery,
  featuredJournalPostQuery,
  journalCategoriesQuery,
  journalPageQuery,
  journalPostBySlugQuery,
  journalPostSlugsQuery,
  journalPostsForSitemapQuery,
} from "@/sanity/lib/queries";
import type { SanityJournalPage, SanityJournalPost, Seo } from "@/types/sanity";
import type { JournalPost } from "@/types/journal";

const JOURNAL_TAG = "journalPost";
const JOURNAL_PAGE_TAG = "journalPage";

const FALLBACK_HERO: NonNullable<SanityJournalPage["hero"]> = {
  eyebrow: "Journal",
  title: "Stories from Adakings",
  description: "News, culture, franchise updates, and the people behind every plate.",
};

const FALLBACK_NEWSLETTER: NonNullable<SanityJournalPage["newsletter"]> = {
  heading: "Stay in the loop",
  description:
    "Get new stories from the Adakings Journal — company news, culture, and recipes — straight to your inbox.",
};

function withReadingTime(post: SanityJournalPost): JournalPost {
  const { readingTimeOverride, ...rest } = post;
  const computed =
    readingTimeOverride && readingTimeOverride > 0
      ? `${Math.round(readingTimeOverride)} min read`
      : readingTime(extractPlainText(post.body)).text;

  return { ...rest, readingTime: computed };
}

export async function getAllPosts(): Promise<JournalPost[]> {
  const posts = await sanityFetch<SanityJournalPost[]>({
    query: allJournalPostsQuery,
    tags: [JOURNAL_TAG],
  });
  return posts.map(withReadingTime);
}

export async function getPostSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: journalPostSlugsQuery,
    tags: [JOURNAL_TAG],
  });
}

export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
  const post = await sanityFetch<SanityJournalPost | null>({
    query: journalPostBySlugQuery,
    params: { slug },
    tags: [JOURNAL_TAG],
  });
  return post ? withReadingTime(post) : null;
}

export async function getFeaturedPost(): Promise<JournalPost | null> {
  const post = await sanityFetch<SanityJournalPost | null>({
    query: featuredJournalPostQuery,
    tags: [JOURNAL_TAG],
  });
  if (post) return withReadingTime(post);

  const [first] = await getAllPosts();
  return first ?? null;
}

export async function getJournalPage(): Promise<{
  hero: NonNullable<SanityJournalPage["hero"]>;
  newsletter: NonNullable<SanityJournalPage["newsletter"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityJournalPage | null>({
    query: journalPageQuery,
    tags: [JOURNAL_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    newsletter: page?.newsletter?.heading ? page.newsletter : FALLBACK_NEWSLETTER,
    seo: page?.seo,
  };
}

export async function getPostsForSitemap(): Promise<
  { slug: string; publishedAt: string; noIndex?: boolean }[]
> {
  return sanityFetch<{ slug: string; publishedAt: string; noIndex?: boolean }[]>({
    query: journalPostsForSitemapQuery,
    tags: [JOURNAL_TAG],
  });
}

export async function getCategories(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: journalCategoriesQuery,
    tags: [JOURNAL_TAG],
  });
}

export async function getRelatedPosts(post: JournalPost, limit = 3): Promise<JournalPost[]> {
  const full = await sanityFetch<SanityJournalPost | null>({
    query: journalPostBySlugQuery,
    params: { slug: post.slug },
    tags: [JOURNAL_TAG],
  });

  if (full?.relatedPosts?.length) {
    return full.relatedPosts.slice(0, limit).map(withReadingTime);
  }

  const categoryTitles = post.categories.map((category) => category.title);
  const all = await getAllPosts();
  return all
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) => candidate.categories.some((category) => categoryTitles.includes(category.title)))
    .slice(0, limit);
}
