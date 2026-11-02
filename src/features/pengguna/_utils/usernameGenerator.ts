function extractNameWords(fullName: string): string[] {
  if (!fullName) return [];

  const nameBeforeComma = fullName.split(',')[0].trim();

  const frontTitlesRegex =
    /^(ustadzah|ustadz|ustad|ust|drs|dra|dr|prof|ir|kh|kyai|nyai|habib|haji|hajjah|h\.|hj\.|m\.)\b\.?\s*/i;

  let cleaned = nameBeforeComma;

  let prevCleaned = "";
  while (cleaned !== prevCleaned) {
    prevCleaned = cleaned;
    cleaned = cleaned.replace(frontTitlesRegex, "").trim();
  }

  return cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Menghasilkan username default dari nama lengkap.
 * Contoh:
 * - "Ahmad Fauzi" -> "ahmad.fauzi"
 * - "Ustadzah Maryam Fauziyah, S.Pd.I" -> "maryam.fauziyah"
 * - "Budi" -> "budi"
 */
export function generateUsernameFromName(fullName: string): string {
  const words = extractNameWords(fullName);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0];
  // Ambil 2 kata pertama digabung titik
  return `${words[0]}.${words[1]}`;
}

