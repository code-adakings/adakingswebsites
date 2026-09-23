import { Container } from "@/components/ui/container";

const metrics = [
  { value: "200,000+", label: "Meals Sold" },
  { value: "10+", label: "Branches Across Ghana" },
  { value: "500+", label: "Team Members" },
  { value: "4.8/5", label: "Average Customer Rating" },
];

export function TrustMetrics() {
  return (
    <section className="border-y border-border bg-muted/40">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
