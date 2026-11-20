import type { Pengguna } from "../types/pengguna.types";

export function extractInitials(fullName: string): string {
  const parts = fullName
    .replace(/^(ustadzah|ustadz|ustad|ust|drs|dra|dr|prof|ir|kh|h\.|hj\.|m\.)\b\.?\s*/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function getAvatarColor(role: string, id: string): Pengguna["avatarColor"] {
  if (role === "ADMIN") return "emerald";
  const colors: Pengguna["avatarColor"][] = ["blue", "purple", "slate"];
  const charCode = id.charCodeAt(id.length - 1) || 0;
  return colors[charCode % colors.length];
}
