import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const SERVICE_AREAS = [
  "Legon",
  "North Legon",
  "UPSA",
  "Haatso",
  "Agbogba",
  "West Legon",
  "GIMPA",
  "Shiashie",
  "Madina",
  "East Legon",
];

const METRICS = [
  { value: "100–200", label: "Current Daily Capacity" },
  { value: "400+", label: "Target Daily Orders" },
];

export function NewFrontiersBusinessToday() {
  return (
    <Section className="bg-muted/40">
      <Container className="max-w-3xl">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Positioned for the Greater Legon Corridor
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-foreground/80">
            Adakings now serves one of Accra&rsquo;s fastest-growing food communities through
            strategically positioned operations across the Greater Legon area.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
          {SERVICE_AREAS.map((area) => (
            <Badge key={area} variant="outline" className="h-7 px-3 text-sm">
              {area}
            </Badge>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{metric.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
