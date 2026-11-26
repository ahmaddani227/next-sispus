const ROMAN_GRADE_MAP: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
};

interface ParsedClassName {
  grade: number;
  rombel: string;
  normalized: string;
}

function cleanRombelText(raw: string): string {
  return raw.replace(/^[\s\-_./()]+|[\s\-_./()]+$/g, "").trim();
}

function parseClassName(name: string): ParsedClassName {
  const cleaned = name.trim().toUpperCase();
  const withoutNoise = cleaned
    .replace(/\b(KELAS|KLS|TINGKAT|MI|MTS|MA)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Baca angka Arab di depan (contoh: 1, 2, 7, 10)
  const arabicMatch = withoutNoise.match(/(\d+)/);

  // 2. Baca angka Romawi di depan (contoh: I, II, VII, VIII, IX)
  const romanMatch = withoutNoise.match(
    /(?:^|[\s\-_./()])(XII|XI|IX|VIII|VII|VI|IV|III|II|I|X|V)(?:(?=[\s\-_./()]|$)|(?=[A-Z0-9](?:[\s\-_./()]|$)))/
  );

  let useRoman = false;
  if (romanMatch && arabicMatch) {
    useRoman = (romanMatch.index ?? 0) <= (arabicMatch.index ?? 0);
  } else if (romanMatch) {
    useRoman = true;
  }

  // Ambil nilai tingkat Romawi + huruf rombel di belakangnya
  if (useRoman && romanMatch) {
    const romanToken = romanMatch[1] ?? "";
    const matchStart = romanMatch.index ?? 0;
    const matchEnd = matchStart + romanMatch[0].length;

    const afterGrade = cleanRombelText(withoutNoise.slice(matchEnd));
    const beforeGrade = cleanRombelText(withoutNoise.slice(0, matchStart));

    return {
      grade: ROMAN_GRADE_MAP[romanToken] ?? 9999,
      rombel: afterGrade || beforeGrade,
      normalized: cleaned,
    };
  }

  // Ambil nilai tingkat Arab + huruf rombel di belakangnya
  if (arabicMatch) {
    const matchStart = arabicMatch.index ?? 0;
    const matchEnd = matchStart + arabicMatch[0].length;

    const afterGrade = cleanRombelText(withoutNoise.slice(matchEnd));
    const beforeGrade = cleanRombelText(withoutNoise.slice(0, matchStart));

    return {
      grade: Number.parseInt(arabicMatch[1], 10),
      rombel: afterGrade || beforeGrade,
      normalized: cleaned,
    };
  }

  return {
    grade: 9999,
    rombel: withoutNoise,
    normalized: cleaned,
  };
}

export function compareClassItems<
  T extends { name: string; academicYear: string; isActive: boolean },
>(a: T, b: T): number {
  // 1. Kelas Aktif di atas kelas Nonaktif
  if (a.isActive !== b.isActive) {
    return a.isActive ? -1 : 1;
  }

  // 2. Tahun ajaran terbaru didahulukan
  if (a.academicYear !== b.academicYear) {
    return b.academicYear.localeCompare(a.academicYear, "id");
  }

  // 3. Urutkan tingkat kelas dari terkecil (1 / I s.d. 12 / XII)
  const parsedA = parseClassName(a.name);
  const parsedB = parseClassName(b.name);

  if (parsedA.grade !== parsedB.grade) {
    return parsedA.grade - parsedB.grade;
  }

  // 4. Urutkan huruf rombel di belakang angka (A, B, C, dst.)
  const rombelDiff = parsedA.rombel.localeCompare(parsedB.rombel, "id", {
    numeric: true,
    sensitivity: "base",
  });
  if (rombelDiff !== 0) {
    return rombelDiff;
  }

  return parsedA.normalized.localeCompare(parsedB.normalized, "id", {
    numeric: true,
    sensitivity: "base",
  });
}