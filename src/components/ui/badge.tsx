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
          "border-emerald-200/60 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70",
        warning:
          "border-amber-200/60 bg-amber-50 text-amber-800 hover:bg-amber-100/70",
        danger:
          "border-rose-200/60 bg-rose-50 text-rose-800 hover:bg-rose-100/70",
        info:
          "border-blue-200/60 bg-blue-50 text-blue-800 hover:bg-blue-100/70",
        neutral:
          "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200/70",
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
