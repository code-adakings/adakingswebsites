"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-center py-8">
        <Logo />
      </div>
      <Container className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground text-pretty">
          We hit an unexpected error loading this page. You can try again, or head back to the
          homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back to home
          </Button>
        </div>
      </Container>
    </div>
  );
}
