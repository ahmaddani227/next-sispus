import type { Pengguna } from '../types/pengguna.types';
import type { MetricCardProps } from '@/components/MetricCards';
import { ShieldCheck, Users, Building2, UserCog } from 'lucide-react';

export const MOCK_PENGGUNA: Pengguna[] = [
  {
    id: '1', nama: 'Ustadzah Siti Rahmawati, S.Pd.I', nip: '198804152014',
    username: 'siti.admin', email: 'siti.rahmawati@arrasyd.sch.id',
    telepon: '+62 812-4456-7890', role: 'ADMIN', status: 'Aktif',
    avatarInitials: 'SR', avatarColor: 'emerald', isSelf: true,
  },
  {
    id: '2', nama: 'Drs. H. Ahmad Fauzi, M.Pd', nip: '197508122002',
    username: 'ahmad.fauzi', email: 'ahmad.fauzi@arrasyd.sch.id',
    telepon: '+62 811-2345-6789', role: 'KEPALA_PERPUSTAKAAN', status: 'Aktif',
    avatarInitials: 'AF', avatarColor: 'purple',
  },
  {
    id: '3', nama: 'Ustadz Danang Prasetyo, S.Hum', nip: '199203102018',
    username: 'danang.sirkulasi', email: 'danang.prasetyo@arrasyd.sch.id',
    telepon: '+62 856-7890-1234', role: 'PETUGAS', status: 'Aktif',
    avatarInitials: 'DP', avatarColor: 'blue',
  },
  {
    id: '4', nama: 'Ustadzah Halimah Zahra, S.Pd', nip: '199407222019',
    username: 'halimah.petugas', email: 'halimah.zahra@arrasyd.sch.id',
    telepon: '+62 878-1234-5678', role: 'PETUGAS', status: 'Aktif',
    avatarInitials: 'HZ', avatarColor: 'emerald',
  },
  {
    id: '5', nama: 'Ustadz Ridwan Malik, S.Ag', nip: '199105152017',
    username: 'ridwan.katalog', email: 'ridwan.malik@arrasyd.sch.id',
    telepon: '+62 813-9876-5432', role: 'PETUGAS', status: 'Aktif',
    avatarInitials: 'RM', avatarColor: 'slate',
  },
  {
    id: '6', nama: 'Ustadzah Nur Aini, S.Sos', nip: '199602182020',
    username: 'nuraini.petugas', email: 'nuraini@arrasyd.sch.id',
    telepon: '+62 821-5678-9012', role: 'PETUGAS', status: 'Aktif',
    avatarInitials: 'NA', avatarColor: 'blue',
  },
  {
    id: '7', nama: 'Ustadz Fajar Nugroho, S.Pd', nip: '199301082016',
    username: 'fajar.petugas', email: 'fajar.nugroho@arrasyd.sch.id',
    telepon: '+62 877-2345-6789', role: 'PETUGAS', status: 'Nonaktif',
    avatarInitials: 'FN', avatarColor: 'slate',
  },
  {
    id: '8', nama: 'Ustadzah Reza Amalia, M.Pd', nip: '199508152022',
    username: 'reza.admin2', email: 'reza.amalia@arrasyd.sch.id',
    telepon: '+62 857-3456-7890', role: 'ADMIN', status: 'Aktif',
    avatarInitials: 'RA', avatarColor: 'emerald',
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
