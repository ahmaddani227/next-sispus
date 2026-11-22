"use client";

import { Save, RotateCcw, Loader2 } from "lucide-react";
import { HeaderBanner } from "@/components/HeaderBanner";
import { Button } from "@/components/ui/button";
import { RuleSimulationCard } from "./RuleSimulationCard";
import { LoanRulesCard } from "./LoanRulesCard";
import { ExtensionRulesCard } from "./ExtensionRulesCard";
import { DatabaseInfoCard } from "./DatabaseInfoCard";
import { ResetDefaultsDialog } from "./ResetDefaultsDialog";
import { useSettingsForm } from "../hooks/useSettingsForm";
import type {
  SystemSettingsValues,
  SystemSettingRecord,
} from "../types/settings.types";

interface SettingsProps {
  initialValues: SystemSettingsValues;
  records?: SystemSettingRecord[];
  lastUpdated?: string | null;
}

export default function Settings({
  initialValues,
  records = [],
  lastUpdated,
}: SettingsProps) {
  const {
    values,
    isDirty,
    isSaving,
    isResetting,
    isResetDialogOpen,
    setIsResetDialogOpen,
    handleChange,
    handleSave,
    handleConfirmReset,
  } = useSettingsForm(initialValues);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <HeaderBanner
        title="Sistem Manajemen & Konfigurasi Aturan"
        description="Pengaturan terpusat parameter operasional sirkulasi perpustakaan madrasah Ar-Rasyid."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={isSaving || isResetting}
              className="gap-1.5 text-xs border-border text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kembalikan ke Default
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isResetting || !isDirty}
              className="gap-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
              ) : (
                <Save className="w-3.5 h-3.5 text-emerald-200" />
              )}
              {isSaving ? "Menyimpan..." : isDirty ? "Simpan Perubahan" : "Tersimpan"}
            </Button>
          </div>
        }
      />

      <section aria-labelledby="simulation-heading">
        <h2 id="simulation-heading" className="sr-only">
          Simulasi Aturan Peminjaman
        </h2>
        <RuleSimulationCard values={values} />
      </section>

      {/* Main Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoanRulesCard values={values} onChange={handleChange} />

        <ExtensionRulesCard values={values} onChange={handleChange} />
      </form>

      <DatabaseInfoCard records={records} lastUpdated={lastUpdated} />

      <ResetDefaultsDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onConfirm={handleConfirmReset}
        isLoading={isResetting}
      />
    </div>
  );
}
