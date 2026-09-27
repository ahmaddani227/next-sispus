import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border border-slate-200 dark:border-border bg-slate-50/50 dark:bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-foreground transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-500 focus-visible:border-emerald-700 dark:focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
