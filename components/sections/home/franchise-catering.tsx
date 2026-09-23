import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export function FranchiseCatering() {
  return (
    <Section>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-3xl border border-border p-8 sm:p-10">
          <div>
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              Franchise
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">
              Own an Adakings in your community
            </h3>
            <p className="mt-3 text-muted-foreground">
              Join our growing network of franchise partners and bring Adakings
              to your city.
            </p>
          </div>
          <Button variant="outline" render={<a href="/franchise" />} className="mt-6 w-fit">
            Explore Franchising
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-brand-black p-8 text-white sm:p-10">
          <div>
            <span className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
              Catering
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">
              Adakings for your next event
            </h3>
            <p className="mt-3 text-white/70">
              From corporate lunches to weddings, let us cater your celebration.
            </p>
          </div>
          <Button
            render={<a href="/catering" />}
            className="mt-6 w-fit bg-primary text-primary-foreground hover:bg-brand-red-dark"
          >
            Get a Catering Quote
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
