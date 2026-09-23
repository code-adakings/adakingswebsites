"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--color-brand-red)_35%,transparent),transparent_55%)]" />
      <Container className="relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-brand-gold uppercase">
            Proudly Ghanaian &middot; Black-owned
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Fast food, made with pride.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/70 text-pretty">
            Adakings brings bold Ghanaian flavor to every plate — crafted fresh,
            served fast, and rooted in the communities we call home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              render={<a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />}
              className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
            >
              Order Food
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="/branches" />}
              className="h-11 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Find a Branch
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <PlaceholderImage
            label="Signature meal — hero photography"
            className="aspect-4/5 w-full lg:aspect-square"
          />
        </motion.div>
      </Container>
    </section>
  );
}
