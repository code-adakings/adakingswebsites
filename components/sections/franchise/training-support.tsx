import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import type { FranchiseTrainingColumn } from "@/types/sanity";

export function FranchiseTrainingSupport({
  eyebrow,
  heading,
  columns,
}: {
  eyebrow?: string;
  heading?: string;
  columns?: FranchiseTrainingColumn[];
}) {
  if (!columns?.length) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {columns.map(({ title, description, image }) => (
            <div key={title}>
              <SanityImage image={image} fallbackLabel={title} className="aspect-4/3" sizes="(min-width: 640px) 33vw, 100vw" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              {description ? <p className="mt-2 text-sm text-muted-foreground text-pretty">{description}</p> : null}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
