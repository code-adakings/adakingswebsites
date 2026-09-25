import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-brand-black text-white">
      <Container className="py-10 sm:py-16 md:py-20">
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-white/70 text-pretty sm:mt-4">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
