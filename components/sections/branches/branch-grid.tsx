import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BranchCard } from "@/components/sections/branches/branch-card";
import { getBranchesMapEmbedUrl } from "@/lib/branch-utils";
import type { SanityBranch } from "@/types/sanity";

export function BranchGrid({
  branches,
  eyebrow,
  title,
  description,
}: {
  branches: SanityBranch[];
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const mapSrc = getBranchesMapEmbedUrl(branches);

  return (
    <Section id="locations">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {branches.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground">
              We&apos;re adding our branches — check back soon.
            </p>
          </div>
        ) : (
          <>
            {mapSrc ? (
              <div className="mt-10 aspect-21/9 w-full overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={mapSrc}
                  title="Adakings branch locations"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {branches.map((branch) => (
                <BranchCard key={branch.slug} branch={branch} />
              ))}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
