export type UserRole = 'ADMIN' | 'PETUGAS' | 'KEPALA_PERPUSTAKAAN';
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface Pengguna {
  id: string;
  nama: string;
  nip: string;
  username: string;
  email: string;
  telepon: string;
  role: UserRole;
  status: UserStatus;
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
  nip: string;
  username: string;
  password: string;
  email: string;
  telepon: string;
  role: UserRole;
  izinEkspor: boolean;
  izinResetSanksi: boolean;
  kirimWhatsApp: boolean;
}
