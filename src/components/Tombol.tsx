"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Warna = "kuning" | "hijau" | "biru" | "oranye" | "putih" | "merah-muda";

const kelasWarna: Record<Warna, string> = {
  kuning: "bg-kuning text-teks",
  hijau: "bg-hijau text-white",
  biru: "bg-biru text-white",
  oranye: "bg-oranye text-white",
  putih: "bg-white text-teks",
  "merah-muda": "bg-merah-muda text-white",
};

/** Tombol besar (minimal 64px) untuk anak. */
export function TombolBesar({
  warna = "kuning",
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { warna?: Warna; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`tekan min-h-16 min-w-16 rounded-3xl px-8 py-3 text-2xl font-bold sm:text-3xl ${kelasWarna[warna]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Tombol bulat ikon (🏠, 🔊) — 64px. */
export function TombolIkon({
  ikon,
  label,
  warna = "putih",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { ikon: string; label: string; warna?: Warna }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`tekan flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl ${kelasWarna[warna]} ${className}`}
      {...rest}
    >
      <span aria-hidden>{ikon}</span>
    </button>
  );
}
