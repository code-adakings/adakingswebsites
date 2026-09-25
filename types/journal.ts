import type { SanityJournalPost } from "./sanity";

export type JournalPost = Omit<SanityJournalPost, "readingTimeOverride" | "relatedPosts"> & {
  readingTime: string;
};
