import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <Avatar
      className={cn(
        size === "sm" ? "h-8 w-8 text-[10px]" : "h-9 w-9 text-xs",
        "border ring-0",
        c.border,
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "font-bold text-xs select-none",
          c.bg,
          c.text
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function RoleBadge({ role }: { role: Pengguna["role"] }) {
  if (role === "ADMIN") {
    return (
      <Badge variant="success" size="sm">
        Admin
      </Badge>
    );
  }

  if (role === "KEPALA_PERPUSTAKAAN") {
    return (
      <Badge variant="purple" size="sm">
        Kepala Perpus
      </Badge>
    );
  }

  return (
    <Badge variant="info" size="sm">
      Petugas
    </Badge>
  );
}

export function StatusBadge({ status }: { status: Pengguna["status"] }) {
  const isAktif = status === "Aktif";
  return (
    <Badge
      variant={isAktif ? "success" : "neutral"}
      size="sm"
    >
      {status}
    </Badge>
  );
}
