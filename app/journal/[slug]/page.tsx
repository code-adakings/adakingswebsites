import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { PostCard } from "@/components/journal/post-card";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/journal";
import { getAuthor } from "@/lib/authors";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.authorId);
  const related = getRelatedPosts(post);
  const { default: Content } = await import(`@/content/journal/${slug}.mdx`);

  return (
    <>
      <Section className="pb-0">
        <Container className="max-w-3xl">
          <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">{post.excerpt}</p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold">{author.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                &middot; {post.readingTime}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <PlaceholderImage label={post.title} className="aspect-video" />
          <article className="mt-4">
            <Content />
          </article>

          <Separator className="my-12" />

          <div className="rounded-2xl bg-muted/50 p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Written by
            </p>
            <div className="mt-3 flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-background text-lg font-semibold">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-muted-foreground">{author.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{author.bio}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section className="bg-muted/40">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">Related stories</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="pt-0">
        <Container className="max-w-3xl text-center">
          <Link href="/journal" className="text-sm font-semibold text-primary hover:underline">
            &larr; Back to the Journal
          </Link>
        </Container>
      </Section>
    </>
  );
}
