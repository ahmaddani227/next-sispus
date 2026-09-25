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
} from "lucide-react";
import { MetricItem } from "@/types/dashboard";
import { operationalMetrics } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const iconMap = {
  "book-open": BookOpen,
  layers: Layers,
  "check-circle": CheckCircle2,
  "arrow-left-right": ArrowLeftRight,
  "alert-triangle": AlertTriangle,
  "x-circle": XCircle,
  clock: Clock,
  "shield-alert": ShieldAlert,
  "file-check": FileCheck2,
};

const badgeStyles: Record<
  MetricItem["badgeVariant"],
  { badge: string; iconBg: string; iconColor: string }
> = {
  success: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200/50",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  info: {
    badge: "bg-blue-50 text-blue-800 border-blue-200/50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  warning: {
    badge: "bg-amber-50 text-amber-800 border-amber-200/50",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
  danger: {
    badge: "bg-rose-50 text-rose-800 border-rose-200/50",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-700",
  },
};

export function MetricCards({ metrics = operationalMetrics }: { metrics?: MetricItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => {
        const Icon = iconMap[m.iconName] || BookOpen;
        const style = badgeStyles[m.badgeVariant];

        return (
          <div
            key={m.id}
            className="group rounded-xl border border-slate-200 bg-white p-4.5 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] transition-all hover:border-slate-300 hover:shadow-xs"
          >
            {/* Top row: Label & Icon */}
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {m.title}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                  style.iconBg,
                  style.iconColor
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>

            {/* Middle row: Big Metric Number & Status Tag */}
            <div className="flex items-baseline justify-between gap-2">
              <div
                className={cn(
                  "font-data-mono text-2xl font-black tracking-tight",
                  m.highlightColor || "text-slate-900"
                )}
              >
                {m.value}{" "}
                <span className="font-sans text-xs font-medium text-slate-500">
                  {m.unit}
                </span>
              </div>

              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold border",
                  style.badge
                )}
              >
                {m.badgeText}
              </span>
            </div>

            {/* Bottom microcopy */}
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              {m.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
