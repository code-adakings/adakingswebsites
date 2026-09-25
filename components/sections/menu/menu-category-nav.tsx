import { Container } from "@/components/ui/container";
import type { MenuCategorySection } from "@/lib/menu";

export function MenuCategoryNav({ categories }: { categories: MenuCategorySection[] }) {
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <Container>
        <nav
          aria-label="Menu categories"
          className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <a
            href="#featured"
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:border-primary hover:text-primary"
          >
            Featured
          </a>
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              {category.title}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
