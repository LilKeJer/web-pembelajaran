"use client";

import Link from "next/link";
import { useEffect } from "react";
import { teksUi } from "@/data/teks-ui";
import { tembakKonfeti } from "@/lib/konfeti";
import { sfx } from "@/lib/sfx";
import { DeretBintang } from "./Bintang";
import { TombolBesar } from "./Tombol";

/**
 * Layar bintang: bintang besar + "Kamu dapat bintang!" + konfeti.
 * `akhirTopik` → tombol 🏠 Kembali ke beranda; selain itu tombol Lanjut.
 */
export function LayarBintang({
  dapat,
  total,
  onLanjut,
  akhirTopik = false,
}: {
  dapat: number;
  total: number;
  onLanjut?: () => void;
  akhirTopik?: boolean;
}) {
  useEffect(() => {
    sfx.bintang();
    void tembakKonfeti();
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-teks/40 p-4">
      <div className="muncul flex max-w-md flex-col items-center gap-4 rounded-[2.5rem] bg-krem px-8 py-8 text-center shadow-2xl">
        <div aria-hidden className="denyut text-8xl leading-none sm:text-9xl">
          ⭐
        </div>
        <p className="text-3xl font-bold sm:text-4xl">{teksUi.dapatBintang}</p>
        <DeretBintang dapat={dapat} total={total} ukuran="text-4xl" />
        {akhirTopik ? (
          <Link
            href="/"
        prefetch={false}
            className="tekan flex min-h-16 items-center gap-3 rounded-3xl bg-hijau px-8 py-3 text-2xl font-bold text-white sm:text-3xl"
          >
            <span aria-hidden>🏠</span> {teksUi.kembali}
          </Link>
        ) : (
          <TombolBesar warna="hijau" onClick={onLanjut}>
            {teksUi.lanjut} <span aria-hidden>▶</span>
          </TombolBesar>
        )}
      </div>
    </div>
  );
}
