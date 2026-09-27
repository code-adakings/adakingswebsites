import { Bike, Briefcase, ChefHat, Headset, Megaphone, Store, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { DepartmentSummary } from "@/types/career";

/** Keys match `DEPARTMENT_ICONS` in the department schema. */
const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  "chef-hat": ChefHat,
  headset: Headset,
  bike: Bike,
  megaphone: Megaphone,
  store: Store,
  briefcase: Briefcase,
};

export function getDepartmentIcon(icon?: string): LucideIcon {
  return (icon && DEPARTMENT_ICONS[icon]) || Briefcase;
}

export function DepartmentBadge({
  department,
  tone = "light",
  className,
}: {
  department: DepartmentSummary;
  /** "dark" for use on the brand-black hero. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const Icon = getDepartmentIcon(department.icon);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 px-2.5",
        tone === "light"
          ? "border-primary/20 bg-primary/5 text-primary"
          : "border-white/20 bg-white/10 text-white",
        className,
      )}
    >
      <Icon aria-hidden />
      {department.title}
    </Badge>
  );
}
