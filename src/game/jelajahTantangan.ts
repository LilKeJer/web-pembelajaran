/**
 * Logika game murni "Jelajahi → Tantangan → Selesai" (tanpa React, tanpa 3D).
 * Dipakai oleh adegan 3D maupun versi 2D cadangan.
 */

export type Fase = "jelajahi" | "tantangan" | "selesai";

export type Hasil = { jenis: "benar" | "salah"; id: string; nonce: number } | null;

export type StateJT = {
  fase: Fase;
  /** Kunci jelajah yang sudah disentuh (misalnya id bagian rumah / id kategori). */
  disentuh: string[];
  /** Objek yang terakhir disentuh saat jelajahi. */
  dipilih: string | null;
  /** Daftar id soal (urutan acak). */
  soal: string[];
  indeks: number;
  hasil: Hasil;
};

export type AksiJT =
  | { type: "PILIH"; id: string }
  | { type: "MULAI_TANTANGAN"; soal: string[] }
  | { type: "RESET" };

export type KonfigJT = {
  /** Semua kunci yang harus dijelajahi sebelum tantangan terbuka. */
  semuaKunci: string[];
  /** Kunci jelajah dari objek yang disentuh. Bawaan: id itu sendiri. */
  kunciDari?: (idObjek: string) => string | null;
  /** Apakah objek yang disentuh menjawab soal. Bawaan: id sama. */
  cocok?: (idSoal: string, idObjek: string) => boolean;
};

export function stateAwal(): StateJT {
  return { fase: "jelajahi", disentuh: [], dipilih: null, soal: [], indeks: 0, hasil: null };
}

export function tantanganTerbuka(s: StateJT, k: KonfigJT): boolean {
  return k.semuaKunci.every((x) => s.disentuh.includes(x));
}

export function soalSekarang(s: StateJT): string | null {
  return s.fase === "tantangan" ? (s.soal[s.indeks] ?? null) : null;
}

export function buatReducer(k: KonfigJT) {
  const kunciDari = k.kunciDari ?? ((id: string) => id);
  const cocok = k.cocok ?? ((soal: string, id: string) => soal === id);

  return function reducer(s: StateJT, a: AksiJT): StateJT {
    switch (a.type) {
      case "RESET":
        return stateAwal();

      case "MULAI_TANTANGAN":
        if (s.fase !== "jelajahi" || a.soal.length === 0) return s;
        return { ...s, fase: "tantangan", soal: a.soal, indeks: 0, hasil: null, dipilih: null };

      case "PILIH": {
        const nonce = (s.hasil?.nonce ?? 0) + 1;
        if (s.fase === "jelajahi") {
          const kunci = kunciDari(a.id);
          if (kunci === null) return s;
          const disentuh = s.disentuh.includes(kunci) ? s.disentuh : [...s.disentuh, kunci];
          return { ...s, disentuh, dipilih: a.id };
        }
        if (s.fase === "tantangan") {
          const soal = s.soal[s.indeks];
          if (cocok(soal, a.id)) {
            const indeks = s.indeks + 1;
            return {
              ...s,
              indeks,
              fase: indeks >= s.soal.length ? "selesai" : "tantangan",
              hasil: { jenis: "benar", id: a.id, nonce },
            };
          }
          return { ...s, hasil: { jenis: "salah", id: a.id, nonce } };
        }
        return s;
      }
    }
  };
}
