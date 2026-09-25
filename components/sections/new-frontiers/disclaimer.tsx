import { Container } from "@/components/ui/container";

export function NewFrontiersDisclaimer() {
  return (
    <div className="bg-brand-black py-10 text-white">
      <Container className="max-w-2xl">
        <p className="text-center text-xs leading-relaxed text-pretty text-white/50">
          Operation New Frontiers is a private lending facility intended exclusively for invited
          participants. This page does not constitute a public invitation to invest, an offer of
          securities, or a public solicitation. Participation is subject to a formal lending
          agreement and acceptance by Adakings Foods &amp; Beverages Company.
        </p>
      </Container>
    </div>
  );
}
