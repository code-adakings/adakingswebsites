import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/ui/sanity-image";
import type { JournalPost } from "@/types/journal";

export function FeaturedPost({ post }: { post: JournalPost }) {
  const author = post.author;
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group grid gap-8 rounded-3xl border border-border p-6 sm:p-8 lg:grid-cols-2 lg:items-center"
    >
      <SanityImage
        image={post.heroImage}
        fallbackLabel={post.title}
        className="aspect-video lg:aspect-4/3"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div>
        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance transition-colors group-hover:text-primary sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 text-muted-foreground text-pretty">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{author.name}</span>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read the story
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
