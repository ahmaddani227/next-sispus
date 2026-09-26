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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricItem } from "../types/dashboard.types";
import { operationalMetrics } from "../constants/dashboard-data";
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

const badgeVariantMap: Record<
  MetricItem["badgeVariant"],
  "success" | "neutral" | "info" | "warning" | "danger"
> = {
  success: "success",
  neutral: "neutral",
  info: "info",
  warning: "warning",
  danger: "danger",
};

const iconStyleMap: Record<
  MetricItem["badgeVariant"],
  { bg: string; color: string }
> = {
  success: { bg: "bg-emerald-50", color: "text-emerald-700" },
  neutral: { bg: "bg-slate-100", color: "text-slate-700" },
  info: { bg: "bg-blue-50", color: "text-blue-700" },
  warning: { bg: "bg-amber-50", color: "text-amber-700" },
  danger: { bg: "bg-rose-50", color: "text-rose-700" },
};

export function MetricCards({
  metrics = operationalMetrics,
}: {
  metrics?: MetricItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => {
        const Icon = iconMap[m.iconName] || BookOpen;
        const iconStyle = iconStyleMap[m.badgeVariant];
        const badgeVariant = badgeVariantMap[m.badgeVariant];

        return (
          <Card
            key={m.id}
            className="group p-4.5 transition-all hover:border-slate-300 hover:shadow-xs"
          >
            {/* Top row: Label & Icon */}
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {m.title}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                  iconStyle.bg,
                  iconStyle.color
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

              <Badge variant={badgeVariant} size="sm">
                {m.badgeText}
              </Badge>
            </div>

            {/* Bottom microcopy */}
            <p className="mt-2 text-[12px] font-medium text-slate-500">
              {m.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
