import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import type { SanityImage as SanityImageValue } from "@/types/sanity";

export function BranchGrowth({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: SanityImageValue;
}) {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        <SanityImage image={image} fallbackLabel="Adakings expansion" className="aspect-4/3" />
      </Container>
    </Section>
  );
}
