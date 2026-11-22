"use client";

import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SettingField } from "./SettingField";
import type { SystemSettingsValues } from "../types/settings.types";
import {
  SETTINGS_METADATA,
  MAX_LOANS_PRESETS,
  LOAN_DAYS_PRESETS,
} from "../constants/settings.constants";

interface LoanRulesCardProps {
  values: SystemSettingsValues;
  onChange: (key: keyof SystemSettingsValues, value: number) => void;
}

export function LoanRulesCard({ values, onChange }: LoanRulesCardProps) {
  return (
    <Card className="p-6 rounded-xl border border-border shadow-xs bg-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Aturan Peminjaman Utama
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* MAX_ACTIVE_LOANS */}
        <SettingField
          id="f-max-loans"
          label={SETTINGS_METADATA.MAX_ACTIVE_LOANS.label}
          description={SETTINGS_METADATA.MAX_ACTIVE_LOANS.description}
          value={values.MAX_ACTIVE_LOANS}
          displayValue={`${values.MAX_ACTIVE_LOANS} Buku`}
          min={SETTINGS_METADATA.MAX_ACTIVE_LOANS.min}
          max={SETTINGS_METADATA.MAX_ACTIVE_LOANS.max}
          presets={MAX_LOANS_PRESETS}
          onChange={(val) => onChange("MAX_ACTIVE_LOANS", val)}
          accentColor="emerald"
        />

        <hr className="border-border" />

        {/* DEFAULT_LOAN_DAYS */}
        <SettingField
          id="f-loan-days"
          label={SETTINGS_METADATA.DEFAULT_LOAN_DAYS.label}
          description={SETTINGS_METADATA.DEFAULT_LOAN_DAYS.description}
          value={values.DEFAULT_LOAN_DAYS}
          displayValue={`${values.DEFAULT_LOAN_DAYS} Hari`}
          min={SETTINGS_METADATA.DEFAULT_LOAN_DAYS.min}
          max={SETTINGS_METADATA.DEFAULT_LOAN_DAYS.max}
          presets={LOAN_DAYS_PRESETS}
          onChange={(val) => onChange("DEFAULT_LOAN_DAYS", val)}
          accentColor="emerald"
        />
      </div>
    </Card>
  );
}
