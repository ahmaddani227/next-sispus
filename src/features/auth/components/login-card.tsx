import { Library, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoginForm } from "./login-form";
import { AUTH_CONFIG } from "../constants/auth.constants";

export function LoginCard() {
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-7 sm:p-10 shadow-xl shadow-emerald-950/5">
      {/* Top Emerald Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-[#166534]" />

      {/* Header: Logo & Titles */}
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/50 p-2 shadow-xs text-emerald-800">
          <Library className="h-8 w-8 text-emerald-700" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-headline-md">
          {AUTH_CONFIG.appName}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
          {AUTH_CONFIG.appSubtitle}
        </p>

        <div className="mt-3">
          <Badge
            variant="success"
            size="lg"
            className="font-semibold gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>{AUTH_CONFIG.portalBadgeText}</span>
          </Badge>
        </div>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Security Note Strip */}
      <div className="mt-6 flex items-start gap-2.5 border-t border-slate-100 pt-5 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <p className="leading-relaxed text-justify">{AUTH_CONFIG.securityNote}</p>
      </div>
    </div>
  );
}
