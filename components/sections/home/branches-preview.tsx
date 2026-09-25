import { MapPin, ArrowRight, Bike, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { getOpenBranches, formatOpeningHours } from "@/lib/branches";
import { getSiteSettings } from "@/lib/site-settings";

export async function BranchesPreview({
  eyebrow = "Find Us",
  title = "Branches across Ghana",
  description = "From Accra to Kumasi to Takoradi — find your nearest Adakings.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [branches, siteSettings] = await Promise.all([
    getOpenBranches(3),
    getSiteSettings(),
  ]);

  const mapSrc = siteSettings.gpsAddress
    ? `https://www.google.com/maps?q=${siteSettings.gpsAddress.lat},${siteSettings.gpsAddress.lng}&z=12&output=embed`
    : undefined;

  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Button variant="outline" render={<a href="/branches" />} className="hidden shrink-0 sm:inline-flex">
            View All Branches
          </Button>
        </div>

        <div className="mt-10">
          {mapSrc ? (
            <div className="aspect-21/9 w-full overflow-hidden rounded-2xl border border-border">
              <iframe
                src={mapSrc}
                title="Adakings branch locations"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <PlaceholderImage label="Adakings branch map" className="aspect-21/9 w-full" />
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch.slug}
              className="flex flex-col rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <MapPin className="size-5 text-primary" />
                <div className="flex gap-1.5">
                  {branch.acceptsDelivery ? (
                    <Badge variant="outline" className="gap-1">
                      <Bike className="size-3" />
                      Delivery
                    </Badge>
                  ) : null}
                  {branch.acceptsPickup ? (
                    <Badge variant="outline" className="gap-1">
                      <ShoppingBag className="size-3" />
                      Pickup
                    </Badge>
                  ) : null}
                </div>
              </div>
              <h3 className="mt-3 text-base font-semibold">{branch.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{branch.address}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatOpeningHours(branch.openingHours)}
              </p>
              <Button
                variant="outline"
                render={<a href="/branches" />}
                className="mt-4 w-fit"
              >
                View Branch
              </Button>
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
