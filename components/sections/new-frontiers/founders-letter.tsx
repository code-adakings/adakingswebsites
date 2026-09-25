import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export function NewFrontiersFoundersLetter({
  eyebrow,
  heading,
  paragraphs = [],
  signatureName,
  signatureRole,
}: {
  eyebrow?: string;
  heading?: string;
  paragraphs?: string[];
  signatureName?: string;
  signatureRole?: string;
}) {
  if (paragraphs.length === 0) return null;

  return (
    <Section id="letter" className="scroll-mt-20 bg-muted/40">
      <Container className="max-w-2xl">
        <Reveal>
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
          ) : null}

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-pretty text-foreground/90">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {signatureName ? (
            <div className="mt-10">
              <p className="font-semibold">{signatureName}</p>
              {signatureRole ? (
                <p className="text-sm text-muted-foreground">{signatureRole}</p>
              ) : null}
            </div>
          ) : null}
        </Reveal>
      </Container>
    </Section>
  );
}
