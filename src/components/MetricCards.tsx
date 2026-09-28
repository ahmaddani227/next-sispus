import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  BookOpen,
  Layers,
  CheckCircle2,
  ArrowLeftRight,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  FileCheck2,
  Tag,
  Building2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MetricBadgeVariant =
  | "success"
  | "neutral"
  | "info"
  | "warning"
  | "danger"
  | "emerald"
  | "blue"
  | "amber"
  | "purple";

export const metricIconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  layers: Layers,
  "check-circle": CheckCircle2,
  "arrow-left-right": ArrowLeftRight,
  "alert-triangle": AlertTriangle,
  "x-circle": XCircle,
  clock: Clock,
  "shield-alert": ShieldAlert,
  "file-check": FileCheck2,
  tag: Tag,
  building: Building2,
  users: Users,
};

// CVA untuk wrapper container Card
export const metricCardVariants = cva(
  "group p-4.5 transition-all bg-white dark:bg-card border-slate-200 dark:border-border shadow-xs",
  {
    variants: {
      clickable: {
        true: "cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-sm",
        false: "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs",
      },
    },
    defaultVariants: {
      clickable: false,
    },
  }
);

// CVA untuk icon container sesuai konsep shadcn UI
export const metricIconVariants = cva(
  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
  {
    variants: {
      variant: {
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        info: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400",
        neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

// CVA untuk layout responsive grid MetricCards
export const metricCardsGridVariants = cva("grid gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: 3,
  },
});

type ShadcnBadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

// Normalisasi varian warna ke varian resmi badge shadcn UI
function resolveBadgeVariant(variant: MetricBadgeVariant): ShadcnBadgeVariant {
  switch (variant) {
    case "emerald":
      return "success";
    case "blue":
      return "info";
    case "amber":
      return "warning";
    default:
      return variant;
  }
}

export interface MetricCardProps {
  id?: string;
  title: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  badgeText?: React.ReactNode;
  badgeVariant?: MetricBadgeVariant;
  description?: React.ReactNode;
  icon?: LucideIcon | string;
  iconName?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  highlightColor?: string;
  unitColor?: string;
  onClick?: () => void;
  clickable?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  badgeText,
  badgeVariant = "neutral",
  description,
  icon,
  iconName,
  iconBgClass,
  iconColorClass,
  highlightColor,
  unitColor,
  onClick,
  clickable = Boolean(onClick),
  className,
}: MetricCardProps) {
  // Resolve Icon component
  let IconComponent: LucideIcon | null = null;
  if (typeof icon === "function") {
    IconComponent = icon;
  } else if (typeof icon === "string" && metricIconMap[icon]) {
    IconComponent = metricIconMap[icon];
  } else if (iconName && metricIconMap[iconName]) {
    IconComponent = metricIconMap[iconName];
  } else {
    IconComponent = BookOpen;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(metricCardVariants({ clickable }), className)}
    >
      {/* Top row: Label & Icon */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 dark:text-muted-foreground">{title}</span>
        <span
          className={cn(
            metricIconVariants({ variant: badgeVariant }),
            iconBgClass,
            iconColorClass
          )}
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
        </span>
      </div>

      {/* Middle row: Big Metric Number & Status Tag */}
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div
          className={cn(
            "font-data-mono text-2xl font-black tracking-tight",
            highlightColor || "text-slate-900 dark:text-foreground"
          )}
        >
          {value}{" "}
          {unit && (
            <span
              className={cn(
                "font-sans text-xs font-medium",
                unitColor || "text-slate-500 dark:text-muted-foreground"
              )}
            >
              {unit}
            </span>
          )}
        </div>

        {badgeText && (
          <Badge
            variant={resolveBadgeVariant(badgeVariant)}
            size="sm"
            className="px-2 py-0.5 text-xs font-bold"
          >
            {badgeText}
          </Badge>
        )}
      </div>

      {/* Bottom microcopy */}
      {description && (
        <p className="mt-2 text-[12px] font-medium text-slate-500 dark:text-muted-foreground leading-normal">
          {description}
        </p>
      )}
    </Card>
  );
}

export interface MetricCardsProps {
  items: MetricCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricCards({
  items,
  columns = 3,
  className,
}: MetricCardsProps) {
  return (
    <div className={cn(metricCardsGridVariants({ columns }), className)}>
      {items.map((item, index) => (
        <MetricCard key={item.id || index} {...item} />
      ))}
    </div>
  );
}

export default MetricCards;
