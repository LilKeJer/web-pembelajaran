# Spesifikasi Adegan & Game per Topik

Keterangan:
- **[M]** = teks materi verbatim dari `docs/materi.md`
- **[UI]** = teks instruksi/pujian dari `src/data/teks-ui.ts`

Aturan materi strict di `CLAUDE.md` berlaku penuh.

---

## Teks UI awal (`src/data/teks-ui.ts`)

Daftar ini perlu diperiksa dan disetujui guru:

| Fungsi | Teks |
|---|---|
| Pembuka | Ayo Mulai! |
| Navigasi | Lanjut, Ulangi, Kembali |
| Instruksi | Sentuh {nama}!, Sentuh ruangannya!, Cari {nama}!, Masukkan ke tong sampah!, Rapikan mainannya!, Ketuk sabunnya!, Gosok tangannya! |
| Benar | Betul!, Hebat!, Pintar! |
| Salah | Coba lagi ya! |
| Bintang | Kamu dapat bintang! |
| Topik selesai | Kamu hebat! Semua bintang terkumpul! |

`{nama}` selalu diisi istilah dari materi.

---

## Beranda (`/`) — 2D ringan, tanpa three.js

- **Layar pembuka**: tombol besar **[UI]** "Ayo Mulai!". Ketukan ini membuka izin suara.
- **Kartu topik**: 3 kartu besar berurutan dengan ikon dan judul **[M]**:
  - 🏠 Rumahku Tempat Tinggalku
  - 🧹 Rumahku Bersih dan Sehat
  - 🌳 Halaman dan Sekitar Rumah
- **Ketuk kartu**: judul dibacakan, lalu masuk ke topik.
- Bintang yang sudah didapat tampil di setiap kartu.
- Jika semua topik selesai, tampil perayaan (konfeti + **[UI]** "Kamu hebat! Semua bintang terkumpul!").

---

## Topik 1 — 🏠 Rumahku Tempat Tinggalku (`/rumahku`)

Petunjuk gambar guru: rumah berukuran besar di bagian atas. Karena itu, rumah 3D menjadi pusat seluruh topik.

### Adegan 1 — Apa itu rumah?

- **Visual**: rumah 3D low-poly berwarna ceria. Matahari bersinar, lalu hujan turun, dan rumah melindungi figur anak (properti tanpa nama) di dalamnya.
- **Narasi [M]**: "Rumah adalah tempat berteduh kita semua agar tidak kepanasan dari matahari dan tidak basah saat hujan turun."
- Tombol **[UI]** Lanjut. Tidak ada tantangan, langsung dapat ⭐.

### Adegan 2 — Yuk, Kenali Bagian Rumah Kita

- **Bagian yang bisa disentuh** (hanya 5): atap, dinding, lantai, pintu, jendela.
  - Pastikan lantai terlihat dan mudah disentuh, misalnya rumah tampak potongan/dollhouse atau lantai teras terlihat.
  - Pintu bisa membuka. Jendela berkaca transparan.
- **Jelajahi**: sentuh satu bagian, bagian itu menyala, lalu muncul nama dan narasi **[M]**. Contoh: "Atap. Penutup rumah yang ada di paling atas."
- **Tantangan** (terbuka setelah kelima bagian disentuh): 5 soal dengan urutan acak, berbentuk **[UI]** "Sentuh {nama}!".
  - Benar: nada ceria + pujian.
  - Salah: goyang lembut + "Coba lagi ya!".
- Selesai: ⭐

### Adegan 3 — Ada Ruangan Apa Saja di Dalam Rumah?

- **Visual**: kamera bergerak masuk. Rumah tampak potongan dengan tepat 3 ruangan: Kamar Tidur, Dapur, Kamar Mandi. Properti pendukung tanpa nama: kasur, alat masak, bak/pancuran.
- **Jelajahi**: sentuh ruangan, kamera zoom halus, lalu narasi **[M]**. Contoh: "Kamar Tidur. Tempat nyaman untuk kita beristirahat dan tidur."
- **Tantangan**: 3 soal acak. Narasi berupa definisi **[M]**, contoh "Tempat Ibu atau Ayah memasak makanan lezat.", lalu **[UI]** "Sentuh ruangannya!".
- Selesai: ⭐. Topik selesai: konfeti + layar bintang.

---

## Topik 2 — 🧹 Rumahku Bersih dan Sehat (`/rumah-bersih`)

Petunjuk gambar guru: anak membuang sampah atau sapu. Tampilkan figur anak membuang sampah di layar pembuka topik.

### Adegan 1 — Kenapa Rumah Harus Bersih?

- **Visual**: ruangan 3D berantakan dengan kuman kartun lucu (bulatan berwarna dengan mata) sebagai visualisasi "kuman penyakit yang nakal".
- **Narasi [M]**: "Rumah yang bersih membuat badan kita sehat, kuat, dan terhindar dari kuman penyakit yang nakal."
- Kuman bergoyang saat narasi berjalan. Tombol Lanjut.

### Adegan 2 — Kebiasaan Baik yang Bisa Aku Lakukan

Ada 3 aktivitas berurutan. Setiap aktivitas punya alur yang sama:
1. Judul dan narasi **[M]** dibacakan.
2. Anak melakukan aktivitas.
3. Pujian + ⭐ kecil, dan sebagian kuman menghilang.

Semua interaksi bisa dilakukan dengan **ketuk** (objek bergerak otomatis ke tujuan). Seret adalah opsi tambahan, bukan keharusan.

**a. Buang Sampah**
- Bungkus jajan dan sisa kertas tersebar di lantai. Tong sampah ada di sudut.
- Ketuk sampah, lalu sampah melayang masuk ke tong.

**b. Rapikan Mainan**
- Mainan tersebar di lantai. Mainannya properti tanpa nama, misalnya bola dan balok.
- Ketuk mainan, lalu mainan masuk ke kotaknya. Hasilnya lantai rapi.

**c. Cuci Tangan**
- Dua tangan kartun dan sabun.
- Ketuk sabun, muncul busa. Gosok dengan menggeser jari atau mengetuk berulang, busa bertambah. Air membilas, lalu tangan berkilau.

Semua aktivitas selesai: semua kuman hilang, ruangan bersinar, konfeti, ⭐ topik.

---

## Topik 3 — 🌳 Halaman dan Sekitar Rumah (`/sekitar-rumah`)

Petunjuk gambar guru: pohon, bunga, dan mobil. Ketiganya harus menonjol di adegan.

### Adegan 1 — Melihat Luar Rumah Yuk!

- **Visual**: kamera keluar rumah, memperlihatkan halaman dan jalan di depan rumah.
- **Narasi [M]**: "Di luar rumah kita ada halaman dan jalanan yang ramai. Mari kita lihat ada apa saja di sana."

### Adegan 2 — Benda dan Makhluk Hidup di Sekitar Kita

**Objek yang bisa disentuh** (hanya ini):

| Kategori [M] | Objek |
|---|---|
| Tanaman & Bunga | tanaman dan bunga warna-warni (di pot dan di tanah); pohon termasuk sebagai tumbuhan hijau, tanpa menyebut kata "pohon" |
| Hewan Kecil | semut berjalan di dinding, kupu-kupu terbang, kucing lewat |
| Kendaraan | sepeda, motor, mobil yang melintas di jalan |
| Tetangga | tetangga di rumah sebelah, melambaikan tangan |

- **Jelajahi**: sentuh objek, objek beranimasi kecil, lalu narasi kategorinya **[M]**. Contoh: "Kendaraan. Sepeda, motor, dan mobil yang melintas di jalan depan rumah."
- **Tantangan "Cari!"**: 5 soal acak berbentuk **[UI]** "Cari {nama}!". Nama diambil dari: bunga, semut, kupu-kupu, kucing, sepeda, motor, mobil, tetangga.
- Selesai: konfeti + ⭐ topik.
