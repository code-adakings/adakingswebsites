import { Container } from "@/components/ui/container";

export function TrustMetrics({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <section className="border-y border-border bg-muted/40">
      <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4 sm:gap-8 sm:py-12">
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
