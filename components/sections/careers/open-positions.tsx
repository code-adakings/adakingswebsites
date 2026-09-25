"use client";

import Image from "next/image";
import { MapPin, Briefcase, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { urlFor } from "@/sanity/lib/image";
import { trackEvent } from "@/lib/analytics";
import type { SanityCareer, SanityImage } from "@/types/sanity";

export function OpenPositions({
  careers,
  image,
  cvCtaLabel,
  contactEmail,
}: {
  careers: SanityCareer[];
  image?: SanityImage;
  cvCtaLabel: string;
  contactEmail?: string;
}) {
  return (
    <Section id="open-roles" className="scroll-mt-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <SectionHeading
            eyebrow="Open Positions"
            title="Current opportunities"
            description="Don't see a role that fits? Send us your CV and we'll reach out when something opens up."
          />
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
            <Image
              src={image?.asset ? urlFor(image).url() : "/media/web_images/TEAM AT WORK.png"}
              alt={image?.alt || "Adakings team at work"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <Button
          render={<a href={`mailto:${contactEmail}?subject=Career%20Inquiry`} />}
          onClick={() => trackEvent("career_apply", { method: "cv_email" })}
          className="mt-8 bg-primary text-primary-foreground hover:bg-brand-red-dark"
        >
          {cvCtaLabel}
        </Button>

        {careers.length === 0 ? (
          <p className="mt-8 text-muted-foreground sm:mt-12">
            No open roles right now — check back soon, or send us your CV above.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {careers.map((role) => (
              <div
                key={role.slug}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <h3 className="text-lg font-semibold">{role.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{role.department}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="size-3" />
                    {role.location}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="size-3" />
                    {role.employmentType}
                  </Badge>
                  {role.salary ? (
                    <Badge variant="outline" className="gap-1">
                      <Wallet className="size-3" />
                      {role.salary}
                    </Badge>
                  ) : null}
                </div>
                <Button
                  variant="outline"
                  render={<a href={role.applicationUrl} target="_blank" rel="noopener noreferrer" />}
                  onClick={() => trackEvent("career_apply", { method: "application_url", role: role.title })}
                  className="mt-6 w-fit"
                >
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
