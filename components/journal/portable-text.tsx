import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
            <Image
              src={urlFor(value).url()}
              alt={value.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="font-medium text-primary underline underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-bold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-bold tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 text-foreground/80 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mt-5 leading-7 text-foreground/90">{children}</p>,
  },
};

export function JournalBody({ value }: { value: Parameters<typeof PortableText>[0]["value"] }) {
  return <PortableText value={value} components={components} />;
}
