"use client";

import { useSyncExternalStore } from "react";
import { adaWebGL } from "@/lib/webgl";

const tanpaLangganan = () => () => {};

/** true = pakai 3D, false = versi 2D, null = belum diketahui (saat prerender). */
export function usePakai3D(): boolean | null {
  return useSyncExternalStore<boolean | null>(tanpaLangganan, adaWebGL, () => null);
}

/** Penanda memuat (tanpa teks). */
export function Memuat({ ikon }: { ikon: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span aria-hidden className="melayang text-7xl">
        {ikon}
      </span>
    </div>
  );
}

/** Titik progres jelajah (tanpa teks). */
export function TitikProgres({ sudah, total }: { sudah: number; total: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${sudah}/${total}`} role="img">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-4 w-4 rounded-full border-2 border-hijau ${i < sudah ? "bg-hijau" : "bg-white"}`}
        />
      ))}
    </div>
  );
}
