"use client";

import { useEffect, useState } from "react";

/** Teks pujian/penyemangat besar yang muncul sebentar di tengah adegan. */
export function Pujian({ teks, nonce, warna = "text-hijau" }: { teks: string | null; nonce: number; warna?: string }) {
  const [tampil, setTampil] = useState<number | null>(null);

  useEffect(() => {
    if (!teks) return;
    const muncul = setTimeout(() => setTampil(nonce), 0);
    const hilang = setTimeout(() => setTampil(null), 1400);
    return () => {
      clearTimeout(muncul);
      clearTimeout(hilang);
    };
  }, [teks, nonce]);

  if (!teks || tampil !== nonce) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-30 flex justify-center">
      <div
        key={nonce}
        className={`muncul rounded-full bg-white px-8 py-3 text-4xl font-bold shadow-lg sm:text-5xl ${warna}`}
      >
        {teks}
      </div>
    </div>
  );
}
