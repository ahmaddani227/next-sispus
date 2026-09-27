import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        // Semantic status variants per DESIGN.md
        success:
          "border-emerald-200/60 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60",
        warning:
          "border-amber-200/60 bg-amber-50 text-amber-800 hover:bg-amber-100/70 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60",
        danger:
          "border-rose-200/60 bg-rose-50 text-rose-800 hover:bg-rose-100/70 dark:border-rose-800/80 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60",
        info:
          "border-blue-200/60 bg-blue-50 text-blue-800 hover:bg-blue-100/70 dark:border-blue-800/80 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60",
        neutral:
          "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        purple:
          "border-purple-200/60 bg-purple-50 text-purple-800 hover:bg-purple-100/70 dark:border-purple-800/80 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60",
      },
      size: {
        default: "text-[12px] px-2.5 py-0.5",
        sm: "text-[11px] px-2 py-0.5",
        lg: "text-xs px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            dotColor ||
              (variant === "success" && "bg-emerald-600") ||
              (variant === "warning" && "bg-amber-600") ||
              (variant === "danger" && "bg-rose-600") ||
              (variant === "info" && "bg-blue-600") ||
              (variant === "neutral" && "bg-slate-500") ||
              "bg-current"
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
