"use client";

import { Tag, Layers, Building2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MASTER_METRICS_DATA } from "../constants/master-data";
import { MasterTabType } from "../types/master-data.types";
import { cn } from "@/lib/utils";

interface MasterMetricsProps {
  onSelectTab?: (tab: MasterTabType) => void;
}

const iconMap = {
  tag: Tag,
  layers: Layers,
  building: Building2,
  users: Users,
};

const badgeStyles = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  amber: "bg-emerald-50 text-emerald-700 border-emerald-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
};

const iconStyles = {
  tag: "bg-emerald-50 text-emerald-700",
  layers: "bg-blue-50 text-blue-700",
  building: "bg-amber-50 text-amber-700",
  users: "bg-purple-100 text-purple-800",
};

export function MasterMetrics({ onSelectTab }: MasterMetricsProps) {
  const tabKeys: MasterTabType[] = ["kategori", "rak", "penerbit", "kelas"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {MASTER_METRICS_DATA.map((metric, index) => {
        const Icon = iconMap[metric.icon] || Tag;
        const targetTab = tabKeys[index];

        return (
          <Card
            key={metric.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectTab?.(targetTab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTab?.(targetTab);
              }
            }}
            className="rounded-xl border border-slate-200 shadow-xs bg-white hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium text-slate-600">
                  {metric.title}
                </span>
                <span
                  className={cn(
                    "p-1.5 rounded-lg transition-transform group-hover:scale-110",
                    iconStyles[metric.icon]
                  )}
                >
                  <Icon className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div
                  className={cn(
                    "text-2xl font-black tracking-tight",
                    metric.icon === "layers"
                      ? "text-blue-700"
                      : metric.icon === "building"
                      ? "text-amber-700"
                      : "text-slate-900"
                  )}
                >
                  {metric.value}{" "}
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      metric.icon === "layers" ? "text-blue-600" : "text-slate-500"
                    )}
                  >
                    {metric.unit}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                    badgeStyles[metric.badgeVariant]
                  )}
                >
                  {metric.badgeText}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
