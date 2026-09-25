import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export function NewFrontiersFoundersLetter() {
  return (
    <Section id="letter" className="scroll-mt-20 bg-muted/40">
      <Container className="max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Founder&rsquo;s Letter
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A Letter from Kingsley
          </h2>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-pretty text-foreground/90">
            <p>Dear Franchise Partners &amp; Friends,</p>
            <p>
              This letter has one purpose: to invite you to participate in Phase One of Operation
              New Frontiers.
            </p>
            <p>
              Over the past year, Adakings experienced one of the most difficult seasons in our
              journey. Sales declined, operations became strained, and we made the painful
              decision to completely rebuild our team. It was a season that tested our
              resilience, but it also forced us to become a much stronger company.
            </p>
            <p>Today, that season is behind us.</p>
            <p>
              We have rebuilt our operational systems, strengthened our leadership, and
              positioned ourselves to serve the wider Greater Legon community with renewed
              confidence. We are no longer rebuilding simply to survive&mdash;we are preparing to
              scale.
            </p>
            <p>What we need most is not money to keep the lights on.</p>
            <p>
              We need the financial patience to make excellent long-term decisions. Marketing
              takes time before it converts. New staff require training before they become
              exceptional. Technology investments improve efficiency gradually. Operation New
              Frontiers gives us the cash flow buffer to allow those efforts to mature without
              being pressured by short-term costs.
            </p>
            <p>Thank you for believing in this vision.</p>
          </div>

          <div className="mt-10">
            <p className="font-semibold">Kingsley K. Adase</p>
            <p className="text-sm text-muted-foreground">Founder &amp; Chief Visionary</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
