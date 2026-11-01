/**
 * Logika murni Topik 2 — Kebiasaan Baik (tanpa React, tanpa 3D).
 * Urutan: Buang Sampah → Rapikan Mainan → Cuci Tangan.
 * Setiap aktivitas: intro (narasi) → main → beres (pujian + bintang) → aktivitas berikutnya.
 */

import type { IdKebiasaan } from "@/data/materi";

export const URUTAN: IdKebiasaan[] = ["buangSampah", "rapikanMainan", "cuciTangan"];
export const SAMPAH = ["sampah1", "sampah2", "sampah3", "sampah4"] as const;
export const MAINAN = ["mainan1", "mainan2", "mainan3", "mainan4"] as const;
export const TARGET_GOSOK = 6;
export const TOTAL_KUMAN = 6;

export type TahapCuci = "sabun" | "gosok" | "bilas" | "kilau";

export type StateAktivitas = {
  indeks: number; // indeks URUTAN; 3 = semua selesai
  subfase: "intro" | "main" | "beres";
  sampah: string[]; // yang masih di lantai
  mainan: string[]; // yang masih di lantai
  cuci: TahapCuci;
  busa: number;
  kuman: number;
};

export type AksiAktivitas =
  | { type: "MULAI" }
  | { type: "BUANG"; id: string }
  | { type: "RAPIKAN"; id: string }
  | { type: "KETUK_SABUN" }
  | { type: "GOSOK" }
  | { type: "BILAS_SELESAI" }
  | { type: "LANJUT" }
  | { type: "RESET" };

export function stateAwalAktivitas(): StateAktivitas {
  return {
    indeks: 0,
    subfase: "intro",
    sampah: [...SAMPAH],
    mainan: [...MAINAN],
    cuci: "sabun",
    busa: 0,
    kuman: TOTAL_KUMAN,
  };
}

export function aktivitasSekarang(s: StateAktivitas): IdKebiasaan | null {
  return URUTAN[s.indeks] ?? null;
}

export function semuaSelesai(s: StateAktivitas): boolean {
  return s.indeks >= URUTAN.length;
}

/** Kuman yang tersisa setelah n aktivitas selesai. */
function kumanSetelah(n: number): number {
  return Math.max(0, TOTAL_KUMAN - Math.round((TOTAL_KUMAN / URUTAN.length) * n));
}

function beres(s: StateAktivitas): StateAktivitas {
  return { ...s, subfase: "beres", kuman: kumanSetelah(s.indeks + 1) };
}

export function reducerAktivitas(s: StateAktivitas, a: AksiAktivitas): StateAktivitas {
  const akt = aktivitasSekarang(s);
  switch (a.type) {
    case "RESET":
      return stateAwalAktivitas();
    case "MULAI":
      return s.subfase === "intro" && akt ? { ...s, subfase: "main" } : s;
    case "BUANG": {
      if (akt !== "buangSampah" || s.subfase !== "main" || !s.sampah.includes(a.id)) return s;
      const sampah = s.sampah.filter((x) => x !== a.id);
      const baru = { ...s, sampah };
      return sampah.length === 0 ? beres(baru) : baru;
    }
    case "RAPIKAN": {
      if (akt !== "rapikanMainan" || s.subfase !== "main" || !s.mainan.includes(a.id)) return s;
      const mainan = s.mainan.filter((x) => x !== a.id);
      const baru = { ...s, mainan };
      return mainan.length === 0 ? beres(baru) : baru;
    }
    case "KETUK_SABUN":
      if (akt !== "cuciTangan" || s.subfase !== "main" || s.cuci !== "sabun") return s;
      return { ...s, cuci: "gosok", busa: 1 };
    case "GOSOK": {
      if (akt !== "cuciTangan" || s.subfase !== "main" || s.cuci !== "gosok") return s;
      const busa = s.busa + 1;
      return { ...s, busa, cuci: busa >= TARGET_GOSOK ? "bilas" : "gosok" };
    }
    case "BILAS_SELESAI":
      if (akt !== "cuciTangan" || s.cuci !== "bilas") return s;
      return beres({ ...s, cuci: "kilau", busa: 0 });
    case "LANJUT":
      if (s.subfase !== "beres") return s;
      return { ...s, indeks: s.indeks + 1, subfase: "intro" };
  }
}
