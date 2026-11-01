/**
 * SEMUA teks non-materi (navigasi, instruksi game, pujian) ada di file ini,
 * supaya mudah diperiksa guru. Jangan menulis teks non-materi di tempat lain.
 * `{nama}` selalu diisi istilah dari materi (src/data/materi.ts).
 */

export const teksUi = {
  // Nama aplikasi (judul tab browser), dari nama tema di materi
  namaAplikasi: "Lingkunganku",

  // Pembuka
  ayoMulai: "Ayo Mulai!",

  // Navigasi
  lanjut: "Lanjut",
  ulangi: "Ulangi",
  kembali: "Kembali",

  // Instruksi
  sentuhRuangannya: "Sentuh ruangannya!",
  masukkanKeTong: "Masukkan ke tong sampah!",
  rapikanMainannya: "Rapikan mainannya!",
  ketukSabunnya: "Ketuk sabunnya!",
  gosokTangannya: "Gosok tangannya!",

  // Benar
  pujian: ["Betul!", "Hebat!", "Pintar!"],

  // Salah
  cobaLagi: "Coba lagi ya!",

  // Bintang
  dapatBintang: "Kamu dapat bintang!",

  // Topik selesai / semua selesai
  semuaSelesai: "Kamu hebat! Semua bintang terkumpul!",
} as const;

/** "Sentuh {nama}!" */
export function sentuh(nama: string): string {
  return `Sentuh ${nama.toLowerCase()}!`;
}

/** "Cari {nama}!" */
export function cari(nama: string): string {
  return `Cari ${nama.toLowerCase()}!`;
}

export function pujianAcak(): string {
  const p = teksUi.pujian;
  return p[Math.floor(Math.random() * p.length)];
}
