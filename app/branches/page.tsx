import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { branches } from "@/lib/branches";

export const metadata: Metadata = {
  title: "Branches",
  description: "Find your nearest Adakings branch across Ghana.",
};

export default function BranchesPage() {
  return (
    <>
      <PageHero
        eyebrow="Branches"
        title="Find your nearest Adakings"
        description="From Accra to Kumasi to Takoradi — we're growing across Ghana."
      />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div key={branch.id} className="rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold">{branch.name}</h3>
                <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <dd>{branch.address}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <dd>{branch.hours}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                    <dd>
                      <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className="hover:text-foreground">
                        {branch.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
