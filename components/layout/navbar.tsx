"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { mainNav, siteConfig } from "@/lib/site-config";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-sm supports-backdrop-filter:bg-background/70"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-(--container-page) items-center justify-between px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            render={
              <a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />
            }
            className="bg-primary text-primary-foreground hover:bg-brand-red-dark"
          >
            Order Food
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <SheetContent side="right" className="w-[85%] sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {mainNav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SheetClose key={item.href} render={
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                        active
                          ? "bg-muted text-primary"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                      )}
                    />
                  }>
                    {item.label}
                  </SheetClose>
                );
              })}
            </nav>
            <div className="mt-auto p-4">
              <Button
                render={
                  <a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />
                }
                className="w-full bg-primary text-primary-foreground hover:bg-brand-red-dark"
              >
                Order Food
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
