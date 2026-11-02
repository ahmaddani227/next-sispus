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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Pengguna, PenggunaFormValues, UserRole } from "../types/pengguna.types";
import { generateUsernameFromName } from "../_utils/usernameGenerator";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: Pengguna | null;
  onSave: (values: PenggunaFormValues) => void;
}

const DEFAULT_VALUES: PenggunaFormValues = {
  nama: "",
  username: "",
  password: "",
  role: "PETUGAS",
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
  hint?: React.ReactNode;
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
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);
  const isEdit = Boolean(editingItem);

  useEffect(() => {
    if (editingItem) {
      setValues({
        nama: editingItem.nama,
        username: editingItem.username,
        password: "",
        role: editingItem.role,
      });
      setIsUsernameManuallyEdited(true);
    } else {
      setValues(DEFAULT_VALUES);
      setIsUsernameManuallyEdited(false);
    }
    setShowPwd(false);
  }, [editingItem, open]);

  const set = <K extends keyof PenggunaFormValues>(
    key: K,
    val: PenggunaFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  // Handler auto-generate username saat nama lengkap diketik
  const handleNamaChange = (namaValue: string) => {
    setValues((prev) => {
      const nextValues = { ...prev, nama: namaValue };
      // Hanya isi otomatis jika mode tambah (bukan edit) dan username belum diubah manual
      if (!isEdit && !isUsernameManuallyEdited) {
        nextValues.username = generateUsernameFromName(namaValue);
      }
      return nextValues;
    });
  };

  // Handler ketika user mengedit username secara langsung
  const handleUsernameChange = (val: string) => {
    const cleanVal = val.toLowerCase().replace(/\s+/g, "");
    set("username", cleanVal);
    // Jika input username dikosongkan lagi, aktifkan kembali auto-generate dari nama
    if (cleanVal.trim() === "") {
      setIsUsernameManuallyEdited(false);
    } else {
      setIsUsernameManuallyEdited(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        {/* Header */}
        <DialogHeader className="py-3.5 border-b border-border">
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
                  ? "Perbarui informasi nama, username, atau penugasan role akun staf."
                  : "Daftarkan akun staf baru dan tetapkan peran akses sistem SIPUS."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 px-7">
          {/* Nama Lengkap (full_name) */}
          <FormField
            id="f-nama"
            label="Nama Lengkap"
            required
          >
            <Input
              id="f-nama"
              value={values.nama}
              onChange={(e) => handleNamaChange(e.target.value)}
              placeholder="Contoh: Ustadzah Maryam Fauziyah, S.Pd.I"
              required
              className="text-xs bg-muted/40 border-border focus:bg-background"
            />
          </FormField>

          {/* Username */}
          <FormField
            id="f-username"
            label="Username Akun"
            required
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                @
              </span>
              <Input
                id="f-username"
                value={values.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="maryam.fauziyah"
                required
                className="pl-7 text-xs bg-muted/40 border-border focus:bg-background"
              />
            </div>
          </FormField>

          {/* Password */}
          <FormField
            id="f-password"
            label={isEdit ? "Kata Sandi Baru (opsional)" : "Kata Sandi"}
            required={!isEdit}
          >
            <div className="relative">
              <Input
                id="f-password"
                type={showPwd ? "text" : "password"}
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={isEdit ? "••••••••••••" : "Masukkan kata sandi"}
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

          {/* Role */}
          <FormField
            id="f-role"
            label="Role"
            required
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
                  PETUGAS — Loket Sirkulasi, Data Buku & Pengembalian
                </SelectItem>
                <SelectItem value="ADMIN">
                  ADMIN — Akses Penuh Sistem & Pengaturan
                </SelectItem>
                <SelectItem value="KEPALA_PERPUSTAKAAN">
                  KEPALA PERPUSTAKAAN — Supervisi, Statistik & Laporan
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Footer */}
          <DialogFooter className="pt-3 border-t border-border flex-row justify-between gap-3">
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
