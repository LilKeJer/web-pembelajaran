# Lingkunganku — Game Pembelajaran TK

Website game pembelajaran tema "Lingkunganku" untuk anak TK A–TK B (4–6 tahun), dimainkan di HP. Kadang juga dipakai guru di kelas. Materinya disusun guru dan ada di `docs/materi.md`. Materi dan game menyatu: anak belajar sambil bermain.

Desain detail tiap topik ada di `docs/spek-game.md`. Baca hanya bagian yang relevan dengan fase yang sedang dikerjakan.

## ATURAN #1 — Materi strict (tidak bisa ditawar)

- `docs/materi.md` adalah satu-satunya sumber materi. Semua teks materi (judul, subjudul, nama, definisi, penjelasan) disalin **persis kata per kata**. Yang boleh hanya merapikan tanda format (markdown), bukan kata-katanya.
- **DILARANG menambah materi** apa pun: bagian rumah, ruangan, kebiasaan, hewan, kendaraan, fakta, atau penjelasan baru. Ini berlaku sekecil apa pun dan di mana pun: narasi suara, soal, label, alt text, aria-label, title, dan metadata.
- Objek yang **diberi nama, label, narasi, bisa disentuh, atau dijadikan jawaban** hanya yang tertulis di materi.
- **Properti visual pendukung** boleh ada untuk memperjelas gambaran, misalnya kasur di kamar tidur, alat masak di dapur, langit, tanah, atau figur anak sebagai "kita". Syaratnya: tidak diberi nama, label, atau narasi, dan tidak bisa disentuh.
- **Teks non-materi** hanya boleh berupa navigasi, instruksi game, dan pujian/penyemangat. Teks ini harus pendek, umum, dan tanpa fakta baru. Semuanya dikumpulkan di `src/data/teks-ui.ts` supaya mudah diperiksa guru. Jangan menulis teks non-materi di luar file itu.
- **Soal game** memakai teks materi verbatim, ditambah instruksi umum dari `teks-ui.ts`. Jawabannya adalah istilah dari materi. Contoh: narasi "Tempat Ibu atau Ayah memasak makanan lezat." lalu "Sentuh ruangannya!", jawabannya Dapur.
- Ikuti baris "Petunjuk gambar" di `docs/materi.md`.
- Jika ragu apakah sesuatu termasuk menambah materi: **jangan tambahkan, tanyakan dulu.**
- Jangan pernah mengubah `docs/materi.md`.

## Pengguna

- Anak 4–6 tahun yang sebagian besar belum lancar membaca. Suara dan ikon adalah navigasi utama, teks hanya pendukung.
- Perangkat utama: HP Android kelas menengah-bawah, layar portrait. Tetap harus nyaman di landscape, tablet, dan proyektor kelas.
- Tanpa login, tanpa pengumpulan data, tanpa analytics atau tracker, tanpa iklan, tanpa link keluar.
- Progres (bintang) disimpan hanya di localStorage perangkat. Setiap baca/tulis dibungkus try/catch, dan aplikasi tetap jalan normal tanpa localStorage.

## Stack

- Next.js (versi stabil terbaru, App Router, TypeScript) dengan `output: 'export'` sehingga hasilnya situs statis. Deploy gratis ke Vercel, Netlify, atau Cloudflare Pages. Jika memakai `next/image`, set `images.unoptimized: true`.
- Tailwind CSS.
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`.
- Suara narasi: Web Speech API (`speechSynthesis`), bahasa `id-ID`.
- Efek suara: Web Audio API (nada sintetis sederhana), tanpa file audio.
- Konfeti: `canvas-confetti`.
- Jangan menambah dependensi lain tanpa alasan kuat. Sebutkan dan minta persetujuan dulu.

## Arsitektur

```
docs/materi.md          # materi dari guru (read-only)
docs/spek-game.md       # desain adegan & game per topik
src/app/                # rute: /  /rumahku  /rumah-bersih  /sekitar-rumah
src/data/materi.ts      # data materi terstruktur, teks verbatim dari docs/materi.md, id per item
src/data/teks-ui.ts     # SEMUA teks non-materi (instruksi, pujian, navigasi)
src/game/               # logika game murni (state machine: jelajahi → tantangan → selesai), TANPA kode 3D
src/scenes/             # komponen 3D per topik
src/components/         # UI 2D: tombol, overlay, bintang, layout
src/hooks/useSpeech.ts  # narasi Web Speech API
src/hooks/useProgress.ts# bintang di localStorage
scripts/cek-materi.ts   # verifikasi teks materi verbatim (npm run cek-materi)
```

Prinsip arsitektur:

- **Logika game terpisah dari rendering 3D.** Adegan 3D hanya menerima state dan memanggil event (misalnya `onPilih(id)`). Dengan begitu versi 2D cadangan bisa memakai logika yang sama.
- **Komponen 3D client-only**: `'use client'` + `next/dynamic` dengan `ssr: false`. Beranda tidak boleh memuat three.js.
- **`scripts/cek-materi.ts`** memastikan setiap teks materi di `src/data/materi.ts` ada persis di `docs/materi.md`. Perbandingan dilakukan setelah tanda markdown dibuang dan spasi dinormalkan. Script ini gagal (exit code 1) jika ada yang tidak cocok.

## UX untuk anak

- Pola setiap adegan: **Dengar & Jelajahi → Tantangan → Bintang ⭐**.
- Narasi dipicu langsung dari handler ketukan, karena HP memblokir suara tanpa interaksi. Layar pembuka "Ayo Mulai!" membuka izin suara pertama. Setiap layar punya tombol 🔊 besar untuk mengulang narasi.
- Target sentuh UI 2D minimal 64px. Objek 3D yang bisa disentuh diberi area sentuh tak terlihat yang lebih besar dari bendanya.
- Kamera tetap, tanpa putar atau zoom bebas. Saat fokus ke objek, kamera bergerak dengan transisi halus.
- **Jawaban salah**: respons lembut (objek bergoyang pelan + "Coba lagi ya!"). Tanpa tanda silang merah dan tanpa skor kalah.
- **Jawaban benar**: kilau + nada ceria + pujian.
- Font bulat dan besar (Fredoka atau Baloo 2 via `next/font`), warna cerah dengan kontras cukup.
- Layar game penuh tanpa scroll halaman. Tombol kembali 🏠 dan tombol 🔊 selalu terlihat.
- Hormati `prefers-reduced-motion`.
- Semua teks tampilan berbahasa Indonesia.

## useSpeech

- Pilih suara `id-ID` atau `id_ID`, dengan menunggu event `voiceschanged`. Rate sekitar 0.9, pitch sekitar 1.1.
- Panggil `cancel()` sebelum bicara baru supaya narasi tidak menumpuk.
- Jika suara Indonesia tidak ada, tetap jalankan dengan `lang='id-ID'`. Teks narasi selalu tampil di layar.
- Siapkan struktur agar nanti bisa diganti rekaman mp3 suara guru, misalnya field opsional `audio?: string` per item materi.

## Performa 3D (wajib, target HP murah)

- Model low-poly dari primitive three.js (box, cone, cylinder, sphere), tanpa file model eksternal. Jika nanti memakai GLB, hanya yang berlisensi CC0 (misalnya Kenney, Quaternius), dan dicatat di `CREDITS.md`.
- `dpr={[1, 1.5]}`, tanpa shadow map real-time (cukup `ContactShadows` sederhana atau tanpa bayangan), material sederhana, tanpa post-processing.
- Satu Canvas aktif per halaman. Hentikan render saat tab tersembunyi. Animasi ringan saja.
- Deteksi dukungan WebGL. Jika tidak ada, tampilkan versi 2D (kartu emoji/ikon besar) dengan logika game yang sama.

## Cara kerja

- Kerjakan per fase sesuai prompt. Sebelum menulis kode, sampaikan rencana singkat.
- Sebuah fase selesai jika `npm run build`, `npm run lint`, dan `npm run cek-materi` lulus.
- Di akhir fase, ringkas apa yang selesai dan cara mencobanya dari HP (`npm run dev -- -H 0.0.0.0`, lalu buka IP laptop dari HP di Wi-Fi yang sama).
- Teks non-materi baru hanya boleh ditambahkan ke `src/data/teks-ui.ts`, dan sebutkan di ringkasan agar bisa diperiksa guru.
