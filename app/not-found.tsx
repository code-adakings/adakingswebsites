import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-center py-8">
        <Logo />
      </div>
      <Container className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground text-pretty">
          The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/" />}>Back to home</Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Contact us
          </Button>
        </div>
      </Container>
    </div>
  );
}
