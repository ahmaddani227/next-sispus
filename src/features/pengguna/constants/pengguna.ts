import type { Pengguna } from '../types/pengguna.types';
import type { MetricCardProps } from '@/components/MetricCards';
import { ShieldCheck, Users, Building2, UserCog } from 'lucide-react';

export const MOCK_PENGGUNA: Pengguna[] = [
  {
    id: '1',
    nama: 'Ustadzah Siti Rahmawati, S.Pd.I',
    username: 'siti.admin',
    role: 'ADMIN',
    status: 'Aktif',
    createdAt: '2024-01-15T08:00:00Z',
    avatarInitials: 'SR',
    avatarColor: 'emerald',
    isSelf: true,
  },
  {
    id: '2',
    nama: 'Drs. H. Ahmad Fauzi, M.Pd',
    username: 'ahmad.fauzi',
    role: 'KEPALA_PERPUSTAKAAN',
    status: 'Aktif',
    createdAt: '2024-01-20T09:30:00Z',
    avatarInitials: 'AF',
    avatarColor: 'purple',
  },
  {
    id: '3',
    nama: 'Ustadz Danang Prasetyo, S.Hum',
    username: 'danang.sirkulasi',
    role: 'PETUGAS',
    status: 'Aktif',
    createdAt: '2024-02-01T10:15:00Z',
    avatarInitials: 'DP',
    avatarColor: 'blue',
  },
  {
    id: '4',
    nama: 'Ustadzah Halimah Zahra, S.Pd',
    username: 'halimah.petugas',
    role: 'PETUGAS',
    status: 'Aktif',
    createdAt: '2024-02-10T11:00:00Z',
    avatarInitials: 'HZ',
    avatarColor: 'emerald',
  },
  {
    id: '5',
    nama: 'Ustadz Ridwan Malik, S.Ag',
    username: 'ridwan.katalog',
    role: 'PETUGAS',
    status: 'Aktif',
    createdAt: '2024-03-05T08:45:00Z',
    avatarInitials: 'RM',
    avatarColor: 'slate',
  },
  {
    id: '6',
    nama: 'Ustadzah Nur Aini, S.Sos',
    username: 'nuraini.petugas',
    role: 'PETUGAS',
    status: 'Aktif',
    createdAt: '2024-03-12T13:20:00Z',
    avatarInitials: 'NA',
    avatarColor: 'blue',
  },
  {
    id: '7',
    nama: 'Ustadz Fajar Nugroho, S.Pd',
    username: 'fajar.petugas',
    role: 'PETUGAS',
    status: 'Nonaktif',
    createdAt: '2024-04-01T07:30:00Z',
    avatarInitials: 'FN',
    avatarColor: 'slate',
  },
  {
    id: '8',
    nama: 'Ustadzah Reza Amalia, M.Pd',
    username: 'reza.admin2',
    role: 'ADMIN',
    status: 'Aktif',
    createdAt: '2024-04-18T14:10:00Z',
    avatarInitials: 'RA',
    avatarColor: 'emerald',
  },
];

export function buildPenggunaMetrics(data: Pengguna[]): MetricCardProps[] {
  const total = data.length;
  const adminCount = data.filter(u => u.role === 'ADMIN').length;
  const petugasCount = data.filter(u => u.role === 'PETUGAS').length;
  const kepalaCount = data.filter(u => u.role === 'KEPALA_PERPUSTAKAAN').length;
  return [
    { id: 'total', title: 'Total Users', value: total, unit: 'Pengguna', badgeText: 'Aktif', badgeVariant: 'emerald', description: 'Semua staf & otoritas aktif madrasah', icon: Users },
    { id: 'admin', title: 'Role Admin', value: adminCount, unit: 'Akun', badgeText: 'Full Access', badgeVariant: 'emerald', description: 'Full System Access & Pengaturan', icon: ShieldCheck, highlightColor: 'text-emerald-700 dark:text-emerald-400' },
    { id: 'petugas', title: 'Role Petugas', value: petugasCount, unit: 'Akun', badgeText: 'Sirkulasi', badgeVariant: 'blue', description: 'Loket Peminjaman & Operasional', icon: UserCog, highlightColor: 'text-blue-700 dark:text-blue-400' },
    { id: 'kepala', title: 'Role Kepala Perpus', value: kepalaCount, unit: 'Akun', badgeText: 'Pimpinan', badgeVariant: 'purple', description: 'Supervisi, Monitoring & Validasi', icon: Building2, highlightColor: 'text-purple-700 dark:text-purple-400' },
  ];
}
