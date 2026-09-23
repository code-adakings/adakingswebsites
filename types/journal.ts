export type JournalCategory =
  | "Company News"
  | "Culture & Community"
  | "Franchise"
  | "Recipes & Craft"
  | "Careers";

export type JournalFrontmatter = {
  title: string;
  excerpt: string;
  category: JournalCategory;
  authorId: string;
  publishedAt: string;
  coverImage: string;
  featured?: boolean;
};

export type JournalPost = JournalFrontmatter & {
  slug: string;
  readingTime: string;
};
