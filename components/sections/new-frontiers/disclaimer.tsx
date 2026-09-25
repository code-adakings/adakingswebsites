import { Container } from "@/components/ui/container";

export function NewFrontiersDisclaimer({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <div className="bg-brand-black py-10 text-white">
      <Container className="max-w-2xl">
        <p className="text-center text-xs leading-relaxed text-pretty text-white/50">{text}</p>
      </Container>
    </div>
  );
}
