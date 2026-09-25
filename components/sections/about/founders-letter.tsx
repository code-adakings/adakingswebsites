import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import type { SanityLeadership } from "@/types/sanity";

export function FoundersLetter({
  founder,
  fallbackRole,
  fallbackBody,
}: {
  founder: SanityLeadership | null;
  fallbackRole: string;
  fallbackBody: string;
}) {
  const body = founder?.biography || fallbackBody;
  const signatureName = founder?.name ?? "The Adakings Team";
  const signatureRole = founder?.position ?? fallbackRole;

  if (!body) return null;

  return (
    <Section>
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Founder&rsquo;s Letter
        </p>
        <blockquote className="mt-6 text-2xl leading-relaxed font-medium text-balance text-foreground/90 sm:text-3xl">
          &ldquo;{body}&rdquo;
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          {founder?.photo ? (
            <SanityImage
              image={founder.photo}
              fallbackLabel={signatureName}
              className="size-14 shrink-0 rounded-full"
              sizes="56px"
            />
          ) : null}
          <div>
            <p className="font-semibold">{signatureName}</p>
            <p className="text-sm text-muted-foreground">{signatureRole}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
