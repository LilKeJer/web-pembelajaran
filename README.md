# Lingkunganku

Game pembelajaran tema "Lingkunganku" untuk anak TK A–TK B. Materi dari guru ada di `docs/materi.md`; desain game ada di `docs/spek-game.md`. Aturan kerja ada di `CLAUDE.md`.

## Menjalankan

```bash
npm install
npm run dev -- -H 0.0.0.0
```

Buka `http://<IP-laptop>:3000` dari HP yang tersambung ke Wi-Fi yang sama.

## Pemeriksaan

```bash
npm run build       # situs statis di folder out/
npm run lint
npm run cek-materi  # memastikan semua teks materi sama persis dengan docs/materi.md
```

Tambahkan `?2d=1` di alamat halaman topik untuk mencoba versi 2D (tanpa WebGL).

## Deploy

Hasil `npm run build` ada di folder `out/` (situs statis). Unggah ke Vercel, Netlify, atau Cloudflare Pages.

## Untuk guru

- Semua teks instruksi dan pujian ada di `src/data/teks-ui.ts`.
- Teks materi ada di `src/data/materi.ts`, disalin persis dari `docs/materi.md`.
- Rekaman suara guru (mp3) bisa ditambahkan lewat field `audio` di `src/data/materi.ts`.
