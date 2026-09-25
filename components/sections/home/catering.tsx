import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { TrackClick } from "@/components/analytics/track-click";
import { getCateringPage } from "@/lib/catering";

export async function Catering() {
  const { image, homeCta } = await getCateringPage();

  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-3xl">
          <SanityImage
            image={image}
            fallbackLabel="Adakings catering"
            className="aspect-video w-full rounded-none sm:aspect-21/9"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
            <span className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
              Catering
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {homeCta.heading}
            </h2>
            <p className="mt-3 max-w-lg text-white/80 text-pretty">{homeCta.description}</p>
            <TrackClick event="catering_quote" params={{ location: "home_catering_teaser" }}>
              <Button
                size="lg"
                render={<a href={homeCta.cta?.href ?? "/catering"} />}
                className="mt-6 h-11 w-fit bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
              >
                {homeCta.cta?.label ?? "Request Catering"}
                <ArrowRight className="size-4" />
              </Button>
            </TrackClick>
          </div>
        </div>
      </Container>
    </Section>
  );
}
