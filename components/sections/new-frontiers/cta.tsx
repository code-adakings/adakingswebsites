import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { NewFrontiersLendingForm } from "@/components/forms/new-frontiers-lending-form";

export function NewFrontiersCta() {
  return (
    <Section id="apply" className="scroll-mt-20 bg-brand-black text-white">
      <Container className="max-w-2xl">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Join Operation New Frontiers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base text-white/70 text-pretty">
            If you&rsquo;d like to participate in this private lending round, complete the form
            below. We&rsquo;ll personally send you the lending agreement, repayment schedule, and
            onboarding instructions.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <NewFrontiersLendingForm />
        </Reveal>
      </Container>
    </Section>
  );
}
