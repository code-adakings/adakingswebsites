import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SanityImage } from "@/components/ui/sanity-image";
import { PostCard } from "@/components/journal/post-card";
import { JournalBody } from "@/components/journal/portable-text";
import { urlFor } from "@/sanity/lib/image";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/journal";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/structured-data";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    seo: post.seo,
    image: post.heroImage,
    hasOwnOgImage: true,
    type: "article",
    publishedAt: post.publishedAt,
    authors: [post.author.name],
  });
}

function AuthorAvatar({
  name,
  avatar,
  className,
}: {
  name: string;
  avatar?: { asset?: { _ref: string; _type: "reference" }; alt?: string };
  className: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  if (avatar?.asset) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-full bg-muted ${className}`}>
        <Image src={urlFor(avatar).url()} alt={avatar.alt ?? name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground ${className}`}
    >
      {initials}
    </div>
  );
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const author = post.author;
  const related = await getRelatedPosts(post);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
            { name: post.title, path: `/journal/${post.slug}` },
          ]),
        ]}
      />
      <Section className="pb-0">
        <Container className="max-w-3xl">
          <Badge className="bg-primary text-primary-foreground">{post.categories[0]?.title}</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">{post.excerpt}</p>

          <div className="mt-8 flex items-center gap-3">
            <AuthorAvatar name={author.name} avatar={author.avatar} className="size-11 text-sm" />
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
          <SanityImage image={post.heroImage} fallbackLabel={post.title} className="aspect-video" priority />
          <article className="mt-4">
            <JournalBody value={post.body} />
          </article>

          <Separator className="my-12" />

          <div className="rounded-2xl bg-muted/50 p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Written by
            </p>
            <div className="mt-3 flex items-start gap-4">
              <AuthorAvatar name={author.name} avatar={author.avatar} className="size-14 text-lg" />
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
