import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { getDepartmentIcon } from "@/components/careers/department-badge";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";
import type { CareersQuote, Department } from "@/types/career";

export function CultureGallery({
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
  quote?: CareersQuote;
  departments: Department[];
}) {
  const images = gallery?.filter((image) => image.asset) ?? [];

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />

        {images.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {images.map((image, index) => (
              <div
                key={image.asset?._ref ?? index}
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted first:col-span-2 first:aspect-2/1 sm:first:col-span-1 sm:first:aspect-square"
              >
                <Image
                  src={urlFor(image).width(800).url()}
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
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((dept) => {
                const Icon = getDepartmentIcon(dept.icon);
                return (
                  <div key={dept._id} className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h4 className="mt-4 font-semibold">{dept.title}</h4>
                    {dept.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
