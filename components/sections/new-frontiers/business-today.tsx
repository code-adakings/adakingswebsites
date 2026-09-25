import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import type { PrivateLandingMetric } from "@/types/sanity";

export function NewFrontiersBusinessToday({
  heading,
  body,
  serviceAreas = [],
  metrics = [],
}: {
  heading?: string;
  body?: string;
  serviceAreas?: string[];
  metrics?: PrivateLandingMetric[];
}) {
  return (
    <Section className="bg-muted/40">
      <Container className="max-w-3xl">
        <Reveal>
          {heading ? (
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {body ? (
            <p className="mt-6 text-lg leading-relaxed text-pretty text-foreground/80">{body}</p>
          ) : null}
        </Reveal>

        {serviceAreas.length > 0 ? (
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <Badge key={area} variant="outline" className="h-7 px-3 text-sm">
                {area}
              </Badge>
            ))}
          </Reveal>
        ) : null}

        {metrics.length > 0 ? (
          <Reveal delay={0.15} className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{metric.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
