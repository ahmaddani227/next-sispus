"use client";

import { useState, useEffect } from "react";

const DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/**
 * Format objek Date menjadi format string tanggal Indonesia:
 * Contoh: "Kamis, 24 Oktober 2024"
 */
export function formatIndonesianDate(date: Date = new Date()): string {
  const dayName = DAYS[date.getDay()];
  const day = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}

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

    // Set tanggal sesuai waktu client lokal
    setCurrentDate(formatIndonesianDate(new Date()));

    // Timer setiap 1 menit untuk memastikan tanggal selalu akurat saat pergantian hari
    const intervalId = setInterval(() => {
      setCurrentDate(formatIndonesianDate(new Date()));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [customDate]);

  return currentDate;
}
