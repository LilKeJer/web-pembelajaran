"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { teksUi } from "@/data/teks-ui";
import { bukaIzinSuara } from "@/hooks/useSpeech";
import { sfx } from "@/lib/sfx";
import { TombolBesar } from "./Tombol";

/**
 * Layar pembuka topik: gambar besar (sesuai "Petunjuk gambar" guru) + judul + "Ayo Mulai!".
 * Ketukan "Ayo Mulai!" juga membuka izin suara (jika halaman dibuka langsung).
 */
export function PembukaTopik({
  judul,
  gambar,
  onMulai,
  latar = "bg-langit",
}: {
  judul: string;
  gambar: ReactNode;
  onMulai: () => void;
  latar?: string;
}) {
  return (
    <main className={`relative flex h-dvh w-full flex-col items-center justify-center gap-6 overflow-hidden p-4 ${latar}`}>
      <Link
        href="/"
        aria-label={teksUi.kembali}
        title={teksUi.kembali}
        className="tekan absolute top-3 left-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl"
      >
        <span aria-hidden>🏠</span>
      </Link>
      <div className="flex min-h-0 flex-1 items-end justify-center landscape:max-md:flex-none">{gambar}</div>
      <h1 className="text-center text-4xl font-bold text-teks sm:text-5xl landscape:max-md:text-3xl">{judul}</h1>
      <div className="flex flex-1 items-start justify-center landscape:max-md:flex-none">
        <TombolBesar
          warna="oranye"
          className="denyut px-12 text-3xl sm:text-4xl"
          onClick={() => {
            bukaIzinSuara();
            sfx.buka();
            sfx.ketuk();
            onMulai();
          }}
        >
          {teksUi.ayoMulai}
        </TombolBesar>
      </div>
    </main>
  );
}
