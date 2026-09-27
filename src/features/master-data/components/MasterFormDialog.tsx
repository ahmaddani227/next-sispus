"use client";

import * as React from "react";
import { Edit2, Plus } from "lucide-react";
import { ModalDialog } from "@/components/ModalDialog";
import {
  MasterItem,
  MasterStatus,
  MasterTabType,
} from "../types/master-data.types";
import { MASTER_TAB_CONFIGS } from "../constants/master-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MasterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MasterItem | null;
  defaultTab: MasterTabType;
  onSave: (itemData: Omit<MasterItem, "id"> & { id?: string }) => void;
}

function MasterFormContent({
  editingItem,
  defaultTab,
  onCancel,
  onSave,
}: {
  editingItem: MasterItem | null;
  defaultTab: MasterTabType;
  onCancel: () => void;
  onSave: (itemData: Omit<MasterItem, "id"> & { id?: string }) => void;
}) {
  const isEditing = Boolean(editingItem);

  const [type, setType] = React.useState<MasterTabType>(
    editingItem?.type ?? defaultTab
  );
  const [code, setCode] = React.useState(() => {
    if (editingItem) return editingItem.code;
    const conf = MASTER_TAB_CONFIGS[defaultTab];
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    return `${conf.codePrefix}-${randomSuffix}`;
  });
  const [status, setStatus] = React.useState<MasterStatus>(
    editingItem?.status ?? "Aktif"
  );
  const [name, setName] = React.useState(editingItem?.name ?? "");
  const [description, setDescription] = React.useState(
    editingItem?.description ?? ""
  );
  const [relation, setRelation] = React.useState(editingItem?.relation ?? "");

  const handleTypeChange = (newType: MasterTabType) => {
    setType(newType);
    if (!isEditing) {
      const conf = MASTER_TAB_CONFIGS[newType];
      const randomSuffix = Math.floor(Math.random() * 900 + 100);
      setCode(`${conf.codePrefix}-${randomSuffix}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    onSave({
      id: editingItem?.id,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      relation: relation.trim() || "0 Judul",
      status,
      type,
    });
  };

  const currentConfig = MASTER_TAB_CONFIGS[type];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Jenis Master Entitas */}
      <div>
        <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
          Jenis Master Entitas
        </Label>
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as MasterTabType)}
          disabled={isEditing}
          className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-slate-100 font-semibold focus:bg-white dark:focus:bg-card focus:outline-none focus:border-emerald-600 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <option value="kategori">Kategori Koleksi Buku</option>
          <option value="rak">Lokasi Rak Penyimpanan</option>
          <option value="penerbit">Mitra Penerbit Buku</option>
          <option value="kelas">Rombel Kelas Siswa</option>
        </select>
      </div>

      {/* Grid: Kode & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            Kode Entitas <span className="text-rose-500">*</span>
          </Label>
          <Input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: RAK-A1"
            className="font-mono text-xs uppercase bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border dark:text-slate-100 focus:bg-white dark:focus:bg-card"
          />
        </div>
        <div>
          <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            Status Operasional
          </Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MasterStatus)}
            className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-slate-100 font-semibold focus:bg-white dark:focus:bg-card focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Nama Entitas */}
      <div>
        <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
          Nama {currentConfig.singularLabel} <span className="text-rose-500">*</span>
        </Label>
        <Input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={currentConfig.namePlaceholder}
          className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border dark:text-slate-100 focus:bg-white dark:focus:bg-card font-medium"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
          Deskripsi {currentConfig.singularLabel}
        </Label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={currentConfig.descPlaceholder}
          className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-card focus:outline-none focus:border-emerald-600 transition-colors resize-none"
        />
      </div>

      {/* Relasi / Kapasitas */}
      <div>
        <Label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
          Kapasitas / Estimasi Relasi Koleksi Buku
        </Label>
        <Input
          type="text"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder={currentConfig.relationPlaceholder}
          className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border dark:text-slate-100 focus:bg-white dark:focus:bg-card"
        />
      </div>

      {/* Form Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-border flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          Simpan Data Master
        </Button>
      </div>
    </form>
  );
}

export function MasterFormDialog({
  open,
  onOpenChange,
  editingItem,
  defaultTab,
  onSave,
}: MasterFormDialogProps) {
  const isEditing = Boolean(editingItem);

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      icon={
        isEditing ? (
          <Edit2 className="w-4 h-4 text-emerald-800" />
        ) : (
          <Plus className="w-4 h-4 text-emerald-800" />
        )
      }
      iconBgClass="bg-emerald-100 text-emerald-800"
      title={isEditing ? "Edit Master Data" : "Tambah Master Data Baru"}
      description="Isi rincian entitas master perpustakaan"
    >
      {open && (
        <MasterFormContent
          key={editingItem ? editingItem.id : defaultTab}
          editingItem={editingItem}
          defaultTab={defaultTab}
          onCancel={() => onOpenChange(false)}
          onSave={(data) => {
            onSave(data);
            onOpenChange(false);
          }}
        />
      )}
    </ModalDialog>
  );
}
