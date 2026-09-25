"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/journal/post-card";
import { cn } from "cn";
import type { JournalPost } from "@/types/journal";

export function JournalExplorer({
  posts,
  categories,
}: {
  posts: JournalPost[];
  categories: string[];
}) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const filtered = posts.filter((post) => {
    const matchesQuery =
      query.trim().length === 0 ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      !activeCategory || post.categories.some((category) => category.title === activeCategory);
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the journal..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setActiveCategory(null)}>
            <Badge
              variant={activeCategory === null ? "default" : "secondary"}
              className={cn(
                "cursor-pointer",
                activeCategory === null && "bg-primary text-primary-foreground",
              )}
            >
              All
            </Badge>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              <Badge
                variant={activeCategory === category ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer",
                  activeCategory === category && "bg-primary text-primary-foreground",
                )}
              >
                {category}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No stories match your search.
        </p>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
