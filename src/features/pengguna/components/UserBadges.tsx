import { cn } from "@/lib/utils";
import type { Pengguna } from "../types/pengguna.types";

const AVATAR_COLOR_MAP: Record<
  Pengguna["avatarColor"],
  { bg: string; text: string; border: string }
> = {
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950/60",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-700",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-950/60",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  },
};

interface UserAvatarProps {
  initials: string;
  color: Pengguna["avatarColor"];
  size?: "sm" | "md";
  className?: string;
}

export function UserAvatar({
  initials,
  color,
  size = "md",
  className,
}: UserAvatarProps) {
  const c = AVATAR_COLOR_MAP[color];
  return (
    <div
      className={cn(
        "rounded-full font-bold flex items-center justify-center shrink-0 border",
        size === "sm" ? "w-8 h-8 text-[10px]" : "w-9 h-9 text-xs",
        c.bg,
        c.text,
        c.border,
        className
      )}
    >
      {initials}
    </div>
  );
}

// Role badge
const ROLE_STYLES: Record<
  Pengguna["role"],
  { label: string; className: string; dotClass: string }
> = {
  ADMIN: {
    label: "ADMIN",
    className:
      "bg-emerald-800 dark:bg-emerald-900 text-white border-transparent",
    dotClass: "bg-emerald-300",
  },
  PETUGAS: {
    label: "PETUGAS",
    className:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    dotClass: "bg-blue-600 dark:bg-blue-400",
  },
  KEPALA_PERPUSTAKAAN: {
    label: "KEPALA PERPUS",
    className:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    dotClass: "bg-purple-600 dark:bg-purple-400",
  },
};

export function RoleBadge({ role }: { role: Pengguna["role"] }) {
  const s = ROLE_STYLES[role];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border",
        s.className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dotClass)} />
      {s.label}
    </span>
  );
}

// Status badge
export function StatusBadge({ status }: { status: Pengguna["status"] }) {
  const isAktif = status === "Aktif";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border",
        isAktif
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isAktif
            ? "bg-emerald-500"
            : "bg-slate-400 dark:bg-slate-500"
        )}
      />
      {status}
    </span>
  );
}
