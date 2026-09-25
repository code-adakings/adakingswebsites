import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import type { SanityImage as SanityImageValue } from "@/types/sanity";

export function FounderVision({
  eyebrow,
  heading,
  body,
  image,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: SanityImageValue;
}) {
  if (!body) return null;

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <SanityImage
          image={image}
          fallbackLabel="Adakings founder"
          className="aspect-4/3 sm:aspect-4/5"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{heading}</h2>
          ) : null}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">{body}</p>
        </div>
      </Container>
    </Section>
  );
}
