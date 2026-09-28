export type UserRole = "ADMIN" | "PETUGAS" | "KEPALA_PERPUSTAKAAN";

export interface UserProfile {
  name: string;
  role: string;
  roleType: UserRole;
  nip: string;
  avatarUrl?: string;
  initials: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
