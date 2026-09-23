import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { branches } from "@/lib/branches";

export function BranchesPreview() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Find Us"
            title="Branches across Ghana"
            description="From Accra to Kumasi to Takoradi — find your nearest Adakings."
          />
          <Button variant="outline" render={<a href="/branches" />} className="hidden shrink-0 sm:inline-flex">
            View All Branches
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <MapPin className="size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{branch.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{branch.address}</p>
              <p className="mt-3 text-xs text-muted-foreground">{branch.hours}</p>
            </div>
          ))}
        </div>

        <Button variant="outline" render={<a href="/branches" />} className="mt-8 w-full sm:hidden">
          View All Branches
          <ArrowRight className="size-4" />
        </Button>
      </Container>
    </Section>
  );
}
