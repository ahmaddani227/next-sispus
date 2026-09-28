import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeaderBannerProps {
  title: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "gradient";
  className?: string;
}

export function HeaderBanner({
  title,
  badge,
  description,
  actions,
  variant = "default",
  className,
}: HeaderBannerProps) {
  const isGradient = variant === "gradient";

  return (
    <div
      className={cn(
        "rounded-xl p-5 sm:p-6 transition-all border shadow-xs",
        isGradient
          ? "relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white border-emerald-950/20"
          : "bg-card border-border text-card-foreground",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          {badge && <div className="flex items-center gap-2">{badge}</div>}
          <div
            className={cn(
              "text-xl sm:text-2xl font-bold tracking-tight",
              isGradient ? "text-white" : "text-card-foreground font-extrabold"
            )}
          >
            {title}
          </div>
          {description && (
            <p
              className={cn(
                "text-xs leading-relaxed max-w-3xl",
                isGradient ? "text-emerald-100" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
