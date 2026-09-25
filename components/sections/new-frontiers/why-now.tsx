import { Users, Cpu, Megaphone, Wallet } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const FEATURES = [
  {
    icon: Users,
    title: "People",
    description: "Recruit and train outstanding kitchen and operations teams.",
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Continue building our restaurant operating system and customer platform.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Execute sustained customer acquisition across Greater Legon.",
  },
  {
    icon: Wallet,
    title: "Cash Flow",
    description: "Create the buffer that enables disciplined long-term decision making.",
  },
];

export function NewFrontiersWhyNow() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="sticky top-24 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Why we&rsquo;re raising this facility
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-pretty text-foreground/80">
              This is a working-capital facility, not an emergency fundraiser.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-foreground/80">
              The proceeds create financial breathing room that allows Adakings to execute
              confidently across hiring, technology, operations, and customer acquisition while
              our growth initiatives produce long-term returns.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-card p-8">
                <feature.icon className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
