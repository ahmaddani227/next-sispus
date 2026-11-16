export type UserRole = 'ADMIN' | 'PETUGAS';
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface Pengguna {
  id: string;
  nama: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
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
