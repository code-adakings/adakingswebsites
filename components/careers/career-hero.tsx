import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

const FALLBACK_IMAGE = "/media/web_images/TEAM AT WORK.png";

export function CareerHero({
  eyebrow,
  title,
  description,
  image,
  openRolesCount,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: SanityImage;
  openRolesCount: number;
}) {
  return (
    <section className="border-b border-border bg-brand-black text-white">
      <Container className="grid gap-8 py-10 sm:py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold tracking-wide text-brand-gold uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-xl text-white/70 text-pretty sm:mt-4 sm:text-lg">{description}</p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Button
              size="lg"
              render={<a href="#open-roles" />}
              className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
            >
              {openRolesCount > 0
                ? `View ${openRolesCount} open ${openRolesCount === 1 ? "role" : "roles"}`
                : "View openings"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#talent-pool" />}
              className="h-11 border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Join the talent pool
            </Button>
          </div>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-white/5">
          <Image
            src={image?.asset ? urlFor(image).width(1200).url() : FALLBACK_IMAGE}
            alt={image?.alt || "The Adakings team at work"}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
