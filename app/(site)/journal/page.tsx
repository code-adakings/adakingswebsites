import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FeaturedPost } from "@/components/journal/featured-post";
import { JournalExplorer } from "@/components/journal/journal-explorer";
import { NewsletterSignup } from "@/components/journal/newsletter-signup";
import { getAllPosts, getCategories, getFeaturedPost, getJournalPage } from "@/lib/journal";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, blogSchema, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION =
  "Stories, news, and culture from Adakings — company news, franchise updates, recipes, and more.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getJournalPage();
  return buildMetadata({
    path: "/journal",
    title: "Journal",
    description: FALLBACK_DESCRIPTION,
    seo,
    hasOwnOgImage: true,
  });
}

export default async function JournalPage() {
  const [posts, featured, categories, { hero, newsletter }] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
    getCategories(),
    getJournalPage(),
  ]);
  const restPosts = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <>
      <JsonLd
        data={[
          blogSchema(posts),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
          ]),
        ]}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
      <Section>
        <Container>
          {featured ? <FeaturedPost post={featured} /> : null}
          <div className="mt-16">
            <JournalExplorer posts={restPosts} categories={categories} />
          </div>
          <div className="mt-20">
            <NewsletterSignup heading={newsletter.heading} description={newsletter.description} />
          </div>
        </Container>
      </Section>
    </>
  );
}
