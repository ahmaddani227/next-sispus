export type UserRole = "ADMIN" | "PETUGAS";

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
  roles?: UserRole[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
