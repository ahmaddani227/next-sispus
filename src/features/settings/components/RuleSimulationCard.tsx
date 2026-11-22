"use client";

import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calculator, ArrowRight, ShieldAlert, Sparkles, BookCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SystemSettingsValues } from "../types/settings.types";

interface RuleSimulationCardProps {
  values: SystemSettingsValues;
}

export function RuleSimulationCard({ values }: RuleSimulationCardProps) {
  const simulation = useMemo(() => {
    const today = new Date();
    const dueDate = addDays(today, values.DEFAULT_LOAN_DAYS);
    const extensionDueDate = addDays(dueDate, values.DEFAULT_EXTENSION_DAYS);

    return {
      pinjamStr: format(today, "EEEE, d MMMM yyyy", { locale: localeId }),
      dueDateStr: format(dueDate, "EEEE, d MMMM yyyy", { locale: localeId }),
      extDueDateStr: format(extensionDueDate, "EEEE, d MMMM yyyy", {
        locale: localeId,
      }),
    };
  }, [values.DEFAULT_LOAN_DAYS, values.DEFAULT_EXTENSION_DAYS]);

  return (
    <Card className="rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/50 via-card to-card dark:from-emerald-950/20 dark:via-card dark:to-card p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Aturan Transaksi</span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Gambaran penerapan konfigurasi saat petugas memproses sirkulasi di loket.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Simulasi Kuota Pinjam */}
        <div className="p-3.5 rounded-lg bg-background/80 border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <BookCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Kapasitas Pinjam Siswa</span>
          </div>
          <div className="text-xl font-extrabold text-foreground font-mono">
            {values.MAX_ACTIVE_LOANS}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Buku / Siswa
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sistem otomatis menolak peminjaman jika siswa sudah memiliki{" "}
            <strong>{values.MAX_ACTIVE_LOANS}</strong> buku berstatus pinjam aktif.
          </p>
        </div>

        {/* Simulasi Waktu Jatuh Tempo */}
        <div className="p-3.5 rounded-lg bg-background/80 border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Tenggat Waktu Normal</span>
          </div>
          <div className="text-xl font-extrabold text-foreground font-mono">
            {values.DEFAULT_LOAN_DAYS}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Hari Kalender
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground space-y-1">
            <div>
              Pinjam: <strong className="text-foreground">{simulation.pinjamStr}</strong>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold">
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span>Jatuh Tempo: {simulation.dueDateStr}</span>
            </div>
          </div>
        </div>

        {/* Simulasi Kebijakan Perpanjangan */}
        <div className="p-3.5 rounded-lg bg-background/80 border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Kebijakan Perpanjangan</span>
          </div>
          <div className="text-xl font-extrabold text-foreground font-mono">
            {values.MAX_LOAN_EXTENSIONS > 0 ? (
              <>
                {values.MAX_LOAN_EXTENSIONS}x{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (+{values.DEFAULT_EXTENSION_DAYS} hari)
                </span>
              </>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 text-sm font-bold">
                Dinonaktifkan (0x)
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {values.MAX_LOAN_EXTENSIONS > 0 ? (
              <>
                Jika diperpanjang 1x, tanggal kembali bergeser menjadi{" "}
                <strong className="text-foreground">
                  {simulation.extDueDateStr}
                </strong>
                .
              </>
            ) : (
              "Siswa harus mengembalikan buku tepat waktu tanpa opsi perpanjangan."
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
