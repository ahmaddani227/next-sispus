"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Pengguna, PenggunaFormValues, UserRole } from "../types/pengguna.types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: Pengguna | null;
  onSave: (values: PenggunaFormValues) => void;
}

const DEFAULT_VALUES: PenggunaFormValues = {
  nama: "",
  nip: "",
  username: "",
  password: "ArRasyid#2024!",
  email: "",
  telepon: "",
  role: "PETUGAS",
  izinEkspor: true,
  izinResetSanksi: false,
  kirimWhatsApp: true,
};

function FormField({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label
        htmlFor={id}
        className="text-xs font-bold text-foreground"
      >
        {label}{" "}
        {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSave,
}: UserFormDialogProps) {
  const [values, setValues] = useState<PenggunaFormValues>(DEFAULT_VALUES);
  const [showPwd, setShowPwd] = useState(false);
  const isEdit = Boolean(editingItem);

  useEffect(() => {
    if (editingItem) {
      setValues({
        nama: editingItem.nama,
        nip: editingItem.nip,
        username: editingItem.username,
        password: "",
        email: editingItem.email,
        telepon: editingItem.telepon,
        role: editingItem.role,
        izinEkspor: true,
        izinResetSanksi: false,
        kirimWhatsApp: true,
      });
    } else {
      setValues(DEFAULT_VALUES);
    }
    setShowPwd(false);
  }, [editingItem, open]);

  const set = <K extends keyof PenggunaFormValues>(
    key: K,
    val: PenggunaFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-foreground tracking-tight">
                  {isEdit ? "Edit Akun Pengguna" : "Tambah Akun Pengguna Baru"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEdit
                  ? "Perbarui data dan hak akses akun staf perpustakaan."
                  : "Daftarkan staf pustakawan baru dan tetapkan hierarki peran otorisasi SIPUS Ar-Rasyid."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama */}
            <FormField
              id="f-nama"
              label="Nama Lengkap & Gelar"
              required
              hint="Nama resmi pada kartu identitas staf madrasah."
            >
              <Input
                id="f-nama"
                value={values.nama}
                onChange={(e) => set("nama", e.target.value)}
                placeholder="Contoh: Ustadzah Maryam Fauziyah, S.Pd.I"
                required
                className="text-xs bg-muted/40 border-border focus:bg-background"
              />
            </FormField>

            {/* NIP */}
            <FormField
              id="f-nip"
              label="NIP / ID Staf Madrasah"
              required
              hint="Nomor Induk Pegawai unik staf madrasah."
            >
              <Input
                id="f-nip"
                value={values.nip}
                onChange={(e) => set("nip", e.target.value)}
                placeholder="199508102021"
                required
                className="text-xs font-mono bg-muted/40 border-border focus:bg-background"
              />
            </FormField>

            {/* Username */}
            <FormField
              id="f-username"
              label="Username Akun"
              required
              hint="Digunakan saat otentikasi login aplikasi SIPUS."
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  @
                </span>
                <Input
                  id="f-username"
                  value={values.username}
                  onChange={(e) => set("username", e.target.value)}
                  placeholder="maryam.sirkulasi"
                  required
                  className="pl-7 text-xs bg-muted/40 border-border focus:bg-background"
                />
              </div>
            </FormField>

            {/* Password */}
            <FormField
              id="f-password"
              label={isEdit ? "Kata Sandi Baru (opsional)" : "Kata Sandi Sementara"}
              required={!isEdit}
              hint={
                isEdit
                  ? "Kosongkan jika tidak ingin mengubah sandi."
                  : "Staf wajib mengganti sandi saat login perdana."
              }
            >
              <div className="relative">
                <Input
                  id="f-password"
                  type={showPwd ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={isEdit ? "••••••••••••" : "ArRasyid#2024!"}
                  required={!isEdit}
                  className="pr-9 text-xs font-mono bg-muted/40 border-border focus:bg-background"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  title={showPwd ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </FormField>

            {/* Email */}
            <FormField
              id="f-email"
              label="Email Institusi Madrasah"
              required
              hint="Untuk pemulihan sandi dan pengiriman laporan."
            >
              <Input
                id="f-email"
                type="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="maryam.fauziyah@arrasyd.sch.id"
                required
                className="text-xs bg-muted/40 border-border focus:bg-background"
              />
            </FormField>

            {/* Telepon */}
            <FormField
              id="f-telepon"
              label="Nomor WhatsApp / Kontak"
              required
              hint="Untuk verifikasi OTP dan notifikasi sirkulasi."
            >
              <Input
                id="f-telepon"
                value={values.telepon}
                onChange={(e) => set("telepon", e.target.value)}
                placeholder="0812-3456-7890"
                required
                className="text-xs font-mono bg-muted/40 border-border focus:bg-background"
              />
            </FormField>

            {/* Role */}
            <div className="md:col-span-2">
              <FormField
                id="f-role"
                label="Penugasan Role Pengguna (Wajib)"
                required
                hint="Setiap role menentukan hak akses menu dan batas kewenangan operasional."
              >
                <Select
                  value={values.role}
                  onValueChange={(v) => set("role", v as UserRole)}
                >
                  <SelectTrigger
                    id="f-role"
                    className="text-xs font-semibold bg-muted/40 border-border focus:bg-background"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETUGAS">
                      PETUGAS — Loket Sirkulasi, Data Buku & Master Peminjaman
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      ADMIN — Akses Penuh Sistem, Hak Konfigurasi & Audit Pengguna
                    </SelectItem>
                    <SelectItem value="KEPALA_PERPUSTAKAAN">
                      KEPALA PERPUSTAKAAN — Supervisi, Monitoring Statistik &
                      Validasi Laporan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 border-t border-border flex-row justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1.5 text-xs border-border text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
              Batal
            </Button>
            <div className="flex items-center gap-2.5">
              <Button
                type="submit"
                size="sm"
                className="gap-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-emerald-200" />
                {isEdit ? "Simpan Perubahan" : "+ Simpan Pengguna Baru"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
