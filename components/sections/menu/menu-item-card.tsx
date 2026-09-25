import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/ui/sanity-image";
import { priceFormatter } from "@/lib/menu";
import type { SanityMenuItem } from "@/types/sanity";

export function MenuItemCard({ item }: { item: SanityMenuItem }) {
  return (
    <div className="group">
      <div className="relative">
        <SanityImage
          image={item.image}
          fallbackLabel={item.name}
          className="aspect-4/3 transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        {item.featured ? (
          <Badge className="absolute top-3 left-3 bg-brand-black text-white">Featured</Badge>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className="shrink-0 text-sm font-semibold text-primary">
          {priceFormatter.format(item.price)}
        </span>
      </div>
      {item.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
      ) : null}
    </div>
  );
}
