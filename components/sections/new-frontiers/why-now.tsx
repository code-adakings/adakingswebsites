import { Users, Cpu, Megaphone, Wallet, TrendingUp, ShieldCheck, Building2, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import type { PrivateLandingFeature } from "@/types/sanity";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  cpu: Cpu,
  megaphone: Megaphone,
  wallet: Wallet,
  "trending-up": TrendingUp,
  "shield-check": ShieldCheck,
  building: Building2,
};

export function NewFrontiersWhyNow({
  heading,
  body = [],
  features = [],
}: {
  heading?: string;
  body?: string[];
  features?: PrivateLandingFeature[];
}) {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            {heading ? (
              <h2 className="sticky top-24 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {heading}
              </h2>
            ) : null}
          </Reveal>
          <Reveal delay={0.1}>
            {body.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "text-lg leading-relaxed text-pretty text-foreground/80"
                    : "mt-4 text-lg leading-relaxed text-pretty text-foreground/80"
                }
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        {features.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = ICONS[feature.icon] ?? Users;
              return (
                <Reveal key={feature.title} delay={index * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-card p-8">
                    <Icon className="size-6 text-primary" strokeWidth={1.5} />
                    <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                    {feature.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
