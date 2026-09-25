import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/ui/sanity-image";
import type { JournalPost } from "@/types/journal";

export function PostCard({ post }: { post: JournalPost }) {
  const author = post.author;
  return (
    <Link href={`/journal/${post.slug}`} className="group block">
      <SanityImage image={post.heroImage} fallbackLabel={post.title} className="aspect-4/3" />
      <div className="mt-4">
        <Badge variant="secondary" className="bg-muted text-foreground/70">
          {post.categories[0]?.title}
        </Badge>
        <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{author.name}</span>
          <span>&middot;</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
