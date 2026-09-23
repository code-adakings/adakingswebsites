import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function CareersCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-10 rounded-3xl bg-brand-black p-8 text-white sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
              We&apos;re Hiring
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Build your career with Adakings
            </h2>
            <p className="mt-4 max-w-md text-white/70 text-pretty">
              From the kitchen to branch leadership, we invest in our people.
              Join a team that&apos;s growing across Ghana.
            </p>
            <Button
              size="lg"
              render={<a href="/careers" />}
              className="mt-8 h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
            >
              View Open Roles
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <PlaceholderImage
            label="Team at work"
            className="aspect-video lg:aspect-4/3"
          />
        </div>
      </Container>
    </section>
  );
}
