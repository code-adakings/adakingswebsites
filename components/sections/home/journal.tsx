import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ScrollRail, ScrollRailItem } from "@/components/ui/scroll-rail";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/journal/post-card";
import { getAllPosts } from "@/lib/journal";

export async function LatestJournal() {
  const posts = (await getAllPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Journal" title="Stories from Adakings" />
          <Button variant="outline" render={<Link href="/journal" />} className="hidden shrink-0 sm:inline-flex">
            Read the Journal
          </Button>
        </div>

        <ScrollRail className="mt-8 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {posts.map((post) => (
            <ScrollRailItem key={post.slug} className="w-[80%]">
              <PostCard post={post} />
            </ScrollRailItem>
          ))}
        </ScrollRail>

        <Button variant="outline" render={<Link href="/journal" />} className="mt-8 w-full sm:hidden">
          Read the Journal
          <ArrowRight className="size-4" />
        </Button>
      </Container>
    </Section>
  );
}
