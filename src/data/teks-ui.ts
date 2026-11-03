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

  // Identitas penyusun (ditampilkan di layar pembuka, tidak dibacakan)
  identitas: [
    { label: "Nama", isi: "Ita" },
    { label: "NIM", isi: "858193709" },
    { label: "Mata Kuliah", isi: "Produksi Bahan Pembelajaran Berbasis Online" },
  ],

  // Tujuan pembelajaran dari penyusun (ditampilkan di layar pembuka, tidak dibacakan)
  judulTujuan: "Tujuan Pembelajaran",
  pengantarTujuan: "Setelah mengikuti kegiatan pembelajaran, anak diharapkan mampu:",
  tujuan: [
    "Mengenal lingkungan di sekitar tempat tinggal.",
    "Menyebutkan benda-benda yang ada di lingkungan.",
    "Mengenal bagian-bagian rumah.",
    "Mengetahui cara menjaga kebersihan lingkungan.",
    "Membiasakan diri menyayangi dan merawat lingkungan.",
  ],

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
