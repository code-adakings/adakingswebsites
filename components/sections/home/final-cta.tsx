import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function FinalCta() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <Container className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Hungry? Let&apos;s fix that.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80 text-pretty">
          Order your favorite Adakings meal now, or find a branch near you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            render={<a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />}
            className="h-11 bg-white px-6 text-base text-brand-black hover:bg-white/90"
          >
            Order Food
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href="/branches" />}
            className="h-11 border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
          >
            Find a Branch
          </Button>
        </div>
      </Container>
    </section>
  );
}
