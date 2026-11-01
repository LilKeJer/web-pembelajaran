/**
 * Memastikan setiap teks materi di src/data/materi.ts ada persis di docs/materi.md.
 * Tanda markdown dibuang dan spasi dinormalkan sebelum dibandingkan.
 * Gagal (exit code 1) jika ada yang tidak cocok.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as materi from "../src/data/materi";

const KUNCI_DIABAIKAN = new Set(["id", "ikon", "rute", "audio", "kategori", "jumlahBintang"]);

function normalisasi(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/^\s*#+\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function kumpulkan(nilai: unknown, jalur: string, hasil: { jalur: string; teks: string }[]) {
  if (typeof nilai === "string") {
    hasil.push({ jalur, teks: nilai });
  } else if (Array.isArray(nilai)) {
    nilai.forEach((v, i) => kumpulkan(v, `${jalur}[${i}]`, hasil));
  } else if (nilai && typeof nilai === "object") {
    for (const [k, v] of Object.entries(nilai)) {
      if (KUNCI_DIABAIKAN.has(k)) continue;
      kumpulkan(v, jalur ? `${jalur}.${k}` : k, hasil);
    }
  }
}

const sumber = normalisasi(readFileSync(join(process.cwd(), "docs", "materi.md"), "utf8"));

const daftar: { jalur: string; teks: string }[] = [];
for (const [nama, nilai] of Object.entries(materi)) {
  if (typeof nilai === "function") continue;
  kumpulkan(nilai, nama, daftar);
}

const gagal = daftar.filter(({ teks }) => !sumber.includes(normalisasi(teks)));

if (gagal.length > 0) {
  console.error(`❌ ${gagal.length} teks materi tidak ditemukan persis di docs/materi.md:`);
  for (const g of gagal) console.error(`  - ${g.jalur}: "${g.teks}"`);
  process.exit(1);
}

console.log(`✅ ${daftar.length} teks materi cocok dengan docs/materi.md.`);
