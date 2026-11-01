"use client";

import { useCallback, useSyncExternalStore } from "react";
import { daftarTopik, type IdTopik } from "@/data/materi";

/**
 * Progres bintang, disimpan hanya di localStorage perangkat.
 * Setiap baca/tulis dibungkus try/catch; tanpa localStorage aplikasi tetap jalan (memori saja).
 */

type Progres = Partial<Record<IdTopik, number[]>>;

const KUNCI = "lingkunganku-bintang";
const KOSONG: Progres = {};

let cache: Progres | null = null;
const pendengar = new Set<() => void>();

function baca(): Progres {
  if (cache) return cache;
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    const data = mentah ? (JSON.parse(mentah) as Progres) : {};
    cache = data && typeof data === "object" ? data : {};
  } catch {
    cache = {};
  }
  return cache;
}

function tulis(baru: Progres) {
  cache = baru;
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(baru));
  } catch {
    /* tanpa localStorage: simpan di memori saja */
  }
  pendengar.forEach((f) => f());
}

function langganan(f: () => void) {
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
  };
}

export function useProgress() {
  const progres = useSyncExternalStore(langganan, baca, () => KOSONG);

  const beriBintang = useCallback((topik: IdTopik, indeks: number) => {
    const sekarang = baca();
    const lama = sekarang[topik] ?? [];
    if (lama.includes(indeks)) return;
    tulis({ ...sekarang, [topik]: [...lama, indeks].sort() });
  }, []);

  const jumlah = useCallback((topik: IdTopik) => progres[topik]?.length ?? 0, [progres]);

  const semuaSelesai = daftarTopik.every((t) => (progres[t.id]?.length ?? 0) >= t.jumlahBintang);

  return { progres, beriBintang, jumlah, semuaSelesai };
}
