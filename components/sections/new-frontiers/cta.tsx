import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { NewFrontiersLendingForm } from "@/components/forms/new-frontiers-lending-form";

export function NewFrontiersCta({
  heading,
  body,
  investmentAmountOptions,
  acknowledgementText,
  submitLabel,
}: {
  heading?: string;
  body?: string;
  investmentAmountOptions?: string[];
  acknowledgementText?: string;
  submitLabel?: string;
}) {
  return (
    <Section id="apply" className="scroll-mt-20 bg-brand-black text-white">
      <Container className="max-w-2xl">
        <Reveal>
          {heading ? (
            <h2 className="text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {body ? (
            <p className="mx-auto mt-4 max-w-xl text-center text-base text-white/70 text-pretty">
              {body}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <NewFrontiersLendingForm
            investmentAmountOptions={investmentAmountOptions}
            acknowledgementText={acknowledgementText}
            submitLabel={submitLabel}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
