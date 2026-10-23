"use client";

import { useState, useEffect } from "react";
import { formatIndonesianDate } from "@/utils/formatDate";

export { formatIndonesianDate };

/**
 * Custom hook untuk mendapatkan tanggal saat ini dalam format bahasa Indonesia secara dinamis.
 * Otomatis terupdate setiap menit jika aplikasi dibiarkan terbuka (misal berganti hari).
 *
 * @param customDate - Opsional, tanggal khusus jika ingin override tanggal default
 */
export function useCurrentDate(customDate?: string): string {
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return customDate ?? formatIndonesianDate();
  });

  useEffect(() => {
    if (customDate) {
      setCurrentDate(customDate);
      return;
    }

    setCurrentDate(formatIndonesianDate(new Date()));

    const intervalId = setInterval(() => {
      setCurrentDate(formatIndonesianDate(new Date()));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [customDate]);

  return currentDate;
}
