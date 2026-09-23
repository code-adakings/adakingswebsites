import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="mt-10 text-4xl font-bold tracking-tight" {...props} />,
    h2: (props) => <h2 className="mt-10 text-2xl font-bold tracking-tight" {...props} />,
    h3: (props) => <h3 className="mt-8 text-xl font-semibold tracking-tight" {...props} />,
    p: (props) => <p className="mt-5 text-base leading-relaxed text-foreground/90" {...props} />,
    a: (props) => <a className="font-medium text-primary underline underline-offset-4" {...props} />,
    ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6" {...props} />,
    ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground/80 italic"
        {...props}
      />
    ),
    img: ({ alt, ...props }) => (
      <span className="relative mt-8 block aspect-video overflow-hidden rounded-xl">
        <Image
          {...(props as Parameters<typeof Image>[0])}
          alt={alt ?? ""}
          fill
          className="object-cover"
        />
      </span>
    ),
    ...components,
  };
}
