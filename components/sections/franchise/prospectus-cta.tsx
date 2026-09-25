import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { CtaLink } from "@/types/sanity";

export function FranchiseProspectusCta({
  heading,
  description,
  prospectusFileUrl,
  primaryCtaLabel,
  secondaryCta,
}: {
  heading?: string;
  description?: string;
  prospectusFileUrl?: string;
  primaryCtaLabel?: string;
  secondaryCta?: CtaLink;
}) {
  return (
    <section id="prospectus" className="bg-brand-black text-white">
      <Container className="py-20 text-center sm:py-24">
        {heading ? (
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {heading}
          </h2>
        ) : null}
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-white/70 text-pretty">{description}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            render={
              prospectusFileUrl ? (
                <a href={prospectusFileUrl} download target="_blank" rel="noopener noreferrer" />
              ) : (
                <a href="#enquiry" />
              )
            }
            className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
          >
            {prospectusFileUrl ? <Download className="size-4" /> : null}
            {primaryCtaLabel ?? "Download Prospectus"}
          </Button>
          {secondaryCta ? (
            <Button
              size="lg"
              variant="outline"
              render={<a href={secondaryCta.href} />}
              className="h-11 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              {secondaryCta.label}
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
