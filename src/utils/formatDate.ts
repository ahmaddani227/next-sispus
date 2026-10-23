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

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

/**
 * Mengubah input Date, string ISO, atau timestamp menjadi Date object yang valid
 */
function parseDateInput(dateInput?: Date | string | number | null): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  const parsed = new Date(dateInput);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format tanggal lengkap beserta hari dalam Bahasa Indonesia.
 * Contoh: "Kamis, 24 Oktober 2024"
 */
export function formatIndonesianDate(
  dateInput: Date | string | number | null = new Date()
): string {
  const date = parseDateInput(dateInput) ?? new Date();
  const dayName = DAYS[date.getDay()];
  const day = date.getDate();
  const monthName = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Format tanggal Indonesia (misal: "15 Januari 2024" atau "15 Jan 2024")
 */
export function formatDate(
  dateInput?: Date | string | number | null,
  options?: { shortMonth?: boolean }
): string {
  const date = parseDateInput(dateInput);
  if (!date) return "-";

  const day = date.getDate();
  const monthList = options?.shortMonth ? SHORT_MONTHS : MONTHS;
  const monthName = monthList[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`;
}

/**
 * Format tanggal dan jam Indonesia (misal: "15 Jan 2024, 08:30 WIB")
 */
export function formatDateTime(
  dateInput?: Date | string | number | null
): string {
  const date = parseDateInput(dateInput);
  if (!date) return "-";

  const dateStr = formatDate(date, { shortMonth: true });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dateStr}, ${hours}:${minutes} WIB`;
}
