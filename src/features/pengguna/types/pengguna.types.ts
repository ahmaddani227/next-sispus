export type UserRole = 'ADMIN' | 'PETUGAS' | 'KEPALA_PERPUSTAKAAN';
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface Pengguna {
  id: string;
  nama: string; // Memetakan full_name pada PRD
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // Memetakan created_at pada PRD
  avatarInitials: string;
  avatarColor: 'emerald' | 'blue' | 'purple' | 'slate';
  isSelf?: boolean;
}

export interface PenggunaFilterState {
  searchQuery: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
}

export interface PenggunaFormValues {
  nama: string;
  username: string;
  password: string;
  role: UserRole;
}
