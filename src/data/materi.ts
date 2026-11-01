/**
 * Data materi terstruktur.
 * SEMUA teks di file ini disalin kata per kata dari docs/materi.md.
 * Jangan menambah, mengurangi, atau mengubah kata-katanya.
 * Diverifikasi oleh `npm run cek-materi`.
 *
 * Field `id`, `ikon`, `rute`, dan `audio` bukan teks materi dan tidak diperiksa.
 * `audio` disiapkan untuk rekaman suara guru (mp3) di masa depan.
 */

export type ItemMateri = {
  id: string;
  nama: string;
  definisi: string;
  audio?: string;
};

export type Paragraf = {
  judul: string;
  teks: string;
  audio?: string;
};

export type Daftar<T extends string = string> = {
  judul: string;
  items: (ItemMateri & { id: T })[];
};

export type IdTopik = "rumahku" | "rumahBersih" | "sekitarRumah";

export type InfoTopik = {
  id: IdTopik;
  ikon: string;
  judul: string;
  rute: string;
  /** Jumlah bintang yang bisa didapat di topik ini. */
  jumlahBintang: number;
  audio?: string;
};

// ---------- Topik 1 ----------

export type IdBagianRumah = "atap" | "dinding" | "lantai" | "pintu" | "jendela";
export type IdRuangan = "kamarTidur" | "dapur" | "kamarMandi";

export const rumahku = {
  info: {
    id: "rumahku",
    ikon: "🏠",
    judul: "Rumahku Tempat Tinggalku",
    rute: "/rumahku",
    jumlahBintang: 3,
  } satisfies InfoTopik,
  apaItuRumah: {
    judul: "Apa itu rumah?",
    teks: "Rumah adalah tempat berteduh kita semua agar tidak kepanasan dari matahari dan tidak basah saat hujan turun.",
  } satisfies Paragraf,
  bagianRumah: {
    judul: "Yuk, Kenali Bagian Rumah Kita:",
    items: [
      { id: "atap", nama: "Atap", definisi: "Penutup rumah yang ada di paling atas." },
      { id: "dinding", nama: "Dinding", definisi: "Pembatas rumah di bagian samping." },
      { id: "lantai", nama: "Lantai", definisi: "Tempat kita berjalan di bagian bawah." },
      { id: "pintu", nama: "Pintu", definisi: "Tempat kita masuk dan keluar rumah." },
      { id: "jendela", nama: "Jendela", definisi: "Tempat kaca untuk melihat pemandangan luar." },
    ],
  } satisfies Daftar<IdBagianRumah>,
  ruangan: {
    judul: "Ada Ruangan Apa Saja di Dalam Rumah?",
    items: [
      { id: "kamarTidur", nama: "Kamar Tidur", definisi: "Tempat nyaman untuk kita beristirahat dan tidur." },
      { id: "dapur", nama: "Dapur", definisi: "Tempat Ibu atau Ayah memasak makanan lezat." },
      { id: "kamarMandi", nama: "Kamar Mandi", definisi: "Tempat kita membersihkan badan agar wangi." },
    ],
  } satisfies Daftar<IdRuangan>,
};

// ---------- Topik 2 ----------

export type IdKebiasaan = "buangSampah" | "rapikanMainan" | "cuciTangan";

export const rumahBersih = {
  info: {
    id: "rumahBersih",
    ikon: "🧹",
    judul: "Rumahku Bersih dan Sehat",
    rute: "/rumah-bersih",
    jumlahBintang: 3,
  } satisfies InfoTopik,
  kenapaBersih: {
    judul: "Kenapa Rumah Harus Bersih?",
    teks: "Rumah yang bersih membuat badan kita sehat, kuat, dan terhindar dari kuman penyakit yang nakal.",
  } satisfies Paragraf,
  kebiasaan: {
    judul: "Kebiasaan Baik yang Bisa Aku Lakukan:",
    items: [
      {
        id: "buangSampah",
        nama: "Buang Sampah",
        definisi: "Memasukkan semua bungkus jajan atau sisa kertas ke dalam tong sampah.",
      },
      {
        id: "rapikanMainan",
        nama: "Rapikan Mainan",
        definisi:
          "Mengembalikan mainan ke dalam kotaknya setelah selesai bermain agar lantai tidak berantakan.",
      },
      {
        id: "cuciTangan",
        nama: "Cuci Tangan",
        definisi: "Membiasakan cuci tangan memakai sabun sebelum makan dan setelah memegang benda kotor.",
      },
    ],
  } satisfies Daftar<IdKebiasaan>,
};

// ---------- Topik 3 ----------

export type IdSekitar = "tanaman" | "hewan" | "kendaraan" | "tetangga";
export type IdCari =
  | "bunga"
  | "semut"
  | "kupuKupu"
  | "kucing"
  | "sepeda"
  | "motor"
  | "mobil"
  | "tetangga";

export type ItemCari = {
  id: IdCari;
  /** Kata dari materi, dipakai di "Cari {nama}!" */
  nama: string;
  kategori: IdSekitar;
};

export const sekitarRumah = {
  info: {
    id: "sekitarRumah",
    ikon: "🌳",
    judul: "Halaman dan Sekitar Rumah",
    rute: "/sekitar-rumah",
    jumlahBintang: 1,
  } satisfies InfoTopik,
  melihatLuar: {
    judul: "Melihat Luar Rumah Yuk!",
    teks: "Di luar rumah kita ada halaman dan jalanan yang ramai. Mari kita lihat ada apa saja di sana.",
  } satisfies Paragraf,
  sekitar: {
    judul: "Benda dan Makhluk Hidup di Sekitar Kita:",
    items: [
      {
        id: "tanaman",
        nama: "Tanaman & Bunga",
        definisi: "Tumbuhan hijau dan bunga warna-warni yang tumbuh di pot atau tanah.",
      },
      {
        id: "hewan",
        nama: "Hewan Kecil",
        definisi: "Semut yang berjalan di dinding, kupu-kupu yang terbang, atau kucing yang lewat.",
      },
      {
        id: "kendaraan",
        nama: "Kendaraan",
        definisi: "Sepeda, motor, dan mobil yang melintas di jalan depan rumah.",
      },
      {
        id: "tetangga",
        nama: "Tetangga",
        definisi: "Orang-orang baik yang tinggal di sebelah rumah kita.",
      },
    ],
  } satisfies Daftar<IdSekitar>,
  namaCari: [
    { id: "bunga", nama: "bunga", kategori: "tanaman" },
    { id: "semut", nama: "Semut", kategori: "hewan" },
    { id: "kupuKupu", nama: "kupu-kupu", kategori: "hewan" },
    { id: "kucing", nama: "kucing", kategori: "hewan" },
    { id: "sepeda", nama: "Sepeda", kategori: "kendaraan" },
    { id: "motor", nama: "motor", kategori: "kendaraan" },
    { id: "mobil", nama: "mobil", kategori: "kendaraan" },
    { id: "tetangga", nama: "Tetangga", kategori: "tetangga" },
  ] satisfies ItemCari[],
};

export const daftarTopik: InfoTopik[] = [rumahku.info, rumahBersih.info, sekitarRumah.info];

export function narasiItem(item: { nama: string; definisi: string }): string {
  return `${item.nama}. ${item.definisi}`;
}
