"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { teksUi } from "@/data/teks-ui";
import { DeretBintang } from "./Bintang";
import { TombolIkon } from "./Tombol";

export type Narasi = {
  judul?: string;
  teks?: string;
  instruksi?: string;
};

/**
 * Layar game penuh tanpa scroll: bar atas (🏠, bintang, 🔊), area adegan, kotak narasi.
 * Tombol 🏠 dan 🔊 selalu terlihat.
 */
export function LayoutGame({
  ikonTopik,
  dapat,
  total,
  onUlangi,
  narasi,
  aksi,
  children,
  latar = "bg-langit",
}: {
  ikonTopik: string;
  dapat: number;
  total: number;
  onUlangi: () => void;
  narasi: Narasi;
  aksi?: ReactNode;
  children: ReactNode;
  latar?: string;
}) {
  return (
    <main className={`relative flex h-dvh w-full flex-col overflow-hidden ${latar}`}>
      {/* Bar atas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
        <Link
          href="/"
          prefetch={false}
          aria-label={teksUi.kembali}
          title={teksUi.kembali}
          className="tekan pointer-events-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-3xl"
        >
          <span aria-hidden>🏠</span>
        </Link>
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/85 px-4 py-2">
          <span aria-hidden className="text-2xl">
            {ikonTopik}
          </span>
          <DeretBintang dapat={dapat} total={total} />
        </div>
        <TombolIkon ikon="🔊" label={teksUi.ulangi} warna="kuning" onClick={onUlangi} className="pointer-events-auto" />
      </div>

      {/* Area adegan */}
      <div className="relative min-h-0 flex-1">{children}</div>

      {/* Kotak narasi: teks selalu tampil */}
      <div className="relative z-10 flex items-center gap-3 bg-white/92 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="min-w-0 flex-1" aria-live="polite">
          {narasi.judul && (
            <p className="text-lg leading-tight font-bold text-ungu sm:text-xl landscape:max-md:text-base">
              {narasi.judul}
            </p>
          )}
          {narasi.teks && (
            <p className="text-lg leading-snug sm:text-2xl landscape:max-md:text-base">{narasi.teks}</p>
          )}
          {narasi.instruksi && (
            <p className="mt-1 text-xl font-bold text-oranye sm:text-2xl landscape:max-md:text-lg">
              {narasi.instruksi}
            </p>
          )}
        </div>
        {aksi && <div className="shrink-0">{aksi}</div>}
      </div>
    </main>
  );
}
