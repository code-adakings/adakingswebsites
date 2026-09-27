import {
  CalendarClock,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { CareersBenefit } from "@/types/career";

/** Keys match `BENEFIT_ICONS` in the careersPage schema. */
const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  "trending-up": TrendingUp,
  "shield-check": ShieldCheck,
  "calendar-clock": CalendarClock,
};

export function Benefits({
  eyebrow,
  heading,
  description,
  items,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: CareersBenefit[];
}) {
  if (!items?.length) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {items.map(({ icon, title, description }) => {
            const Icon = ICONS[icon] ?? Wallet;
            return (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-background p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
