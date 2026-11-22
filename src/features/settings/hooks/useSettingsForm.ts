"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateSystemSettingsAction,
  resetSystemSettingsAction,
} from "../actions/settings.actions";
import type { SystemSettingsValues } from "../types/settings.types";
import { DEFAULT_SETTINGS } from "../constants/settings.constants";

export function useSettingsForm(initialValues: SystemSettingsValues) {
  const router = useRouter();
  const [values, setValues] = useState<SystemSettingsValues>(initialValues);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaving, startSaveTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();

  const isDirty =
    values.MAX_ACTIVE_LOANS !== initialValues.MAX_ACTIVE_LOANS ||
    values.DEFAULT_LOAN_DAYS !== initialValues.DEFAULT_LOAN_DAYS ||
    values.MAX_LOAN_EXTENSIONS !== initialValues.MAX_LOAN_EXTENSIONS ||
    values.DEFAULT_EXTENSION_DAYS !== initialValues.DEFAULT_EXTENSION_DAYS;

  const handleChange = (key: keyof SystemSettingsValues, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    startSaveTransition(async () => {
      const res = await updateSystemSettingsAction(values);
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan konfigurasi.");
        return;
      }

      toast.success(res.message);
      router.refresh();
    });
  };

  const handleConfirmReset = () => {
    startResetTransition(async () => {
      const res = await resetSystemSettingsAction();
      if (!res.success) {
        toast.error(res.error || "Gagal memulihkan default.");
        return;
      }

      setValues(DEFAULT_SETTINGS);
      toast.success(res.message);
      setIsResetDialogOpen(false);
      router.refresh();
    });
  };

  return {
    values,
    isDirty,
    isSaving,
    isResetting,
    isResetDialogOpen,
    setIsResetDialogOpen,
    handleChange,
    handleSave,
    handleConfirmReset,
  };
}
