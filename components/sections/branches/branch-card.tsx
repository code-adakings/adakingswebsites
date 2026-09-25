"use client";

import { MapPin, Clock, Phone, Bike, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { formatOpeningHours, getBranchMapsUrl } from "@/lib/branch-utils";
import { trackEvent } from "@/lib/analytics";
import type { SanityBranch } from "@/types/sanity";

export function BranchCard({ branch }: { branch: SanityBranch }) {
  const isOpen = branch.status === "Open";
  const hours = formatOpeningHours(branch.openingHours);
  const mapsUrl = getBranchMapsUrl(branch);
  const telHref = branch.phone ? `tel:${branch.phone.replace(/\s+/g, "")}` : undefined;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <SanityImage
        image={branch.heroImage}
        alt={branch.name}
        fallbackLabel={branch.name}
        className="aspect-4/3 rounded-none"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{branch.name}</h3>
          {!isOpen ? (
            <Badge variant="secondary" className="shrink-0 bg-muted text-foreground/70">
              {branch.status}
            </Badge>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
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

        <dl className="mt-4 space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd>
              {branch.address}
              {branch.city ? `, ${branch.city}` : ""}
            </dd>
          </div>
          {hours ? (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <dd>{hours}</dd>
            </div>
          ) : null}
          {branch.phone && telHref ? (
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <dd>
                <a href={telHref} className="hover:text-foreground">
                  {branch.phone}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {telHref ? (
            <Button
              render={<a href={telHref} />}
              onClick={() => trackEvent("branch_call", { branch: branch.name })}
              className="grow bg-primary text-primary-foreground hover:bg-brand-red-dark sm:grow-0"
            >
              Call Branch
            </Button>
          ) : null}
          <Button
            variant="outline"
            render={<a href={mapsUrl} target="_blank" rel="noopener noreferrer" />}
            onClick={() => trackEvent("branch_maps", { branch: branch.name })}
            className="grow sm:grow-0"
          >
            Open in Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}
