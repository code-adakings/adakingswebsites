import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FeaturedPost } from "@/components/journal/featured-post";
import { JournalExplorer } from "@/components/journal/journal-explorer";
import { NewsletterSignup } from "@/components/journal/newsletter-signup";
import { getAllPosts, getCategories, getFeaturedPost } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories, news, and culture from Adakings — company news, franchise updates, recipes, and more.",
};

export default function JournalPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const categories = getCategories();
  const restPosts = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Stories from Adakings"
        description="News, culture, franchise updates, and the people behind every plate."
      />
      <Section>
        <Container>
          {featured ? <FeaturedPost post={featured} /> : null}
          <div className="mt-16">
            <JournalExplorer posts={restPosts} categories={categories} />
          </div>
          <div className="mt-20">
            <NewsletterSignup />
          </div>
        </Container>
      </Section>
    </>
  );
}
