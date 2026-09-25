import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

export function LifeAtAdakings({
  eyebrow,
  heading,
  description,
  gallery,
  quote,
  departments,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  gallery?: SanityImage[];
  quote?: { text?: string; name?: string; role?: string };
  departments: { name: string; description?: string }[];
}) {
  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />

        {gallery?.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {gallery.map((image, index) => (
              <div key={image.asset?._ref ?? index} className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={urlFor(image).url()}
                  alt={image.alt || "Life at Adakings"}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        {quote?.text ? (
          <figure className="mx-auto mt-8 max-w-2xl text-center sm:mt-12">
            <blockquote className="text-lg font-medium text-balance sm:text-xl">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            {quote.name ? (
              <figcaption className="mt-4 text-sm text-muted-foreground">
                {quote.name}
                {quote.role ? <span> &middot; {quote.role}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {departments.length ? (
          <div className="mt-8 sm:mt-12">
            <h3 className="text-center text-sm font-semibold tracking-wide text-primary uppercase">
              Where you could work
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {departments.map((dept) => (
                <div key={dept.name} className="rounded-xl border border-border bg-background p-5">
                  <h4 className="font-semibold">{dept.name}</h4>
                  {dept.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
