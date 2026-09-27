import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:border-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
