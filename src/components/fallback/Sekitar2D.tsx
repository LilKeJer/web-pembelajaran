"use client";

import { sekitarRumah } from "@/data/materi";
import { KATEGORI_OBJEK, SEMUA_OBJEK, type IdObjek, type PropsAdeganSekitar } from "@/scenes/sekitar-rumah/tipe";

/** Gambar pembuka Topik 3: pohon, bunga, dan mobil (sesuai "Petunjuk gambar" guru). */
export function GambarSekitar() {
  return (
    <div aria-hidden className="flex items-end gap-2 text-[22vw] leading-none sm:text-9xl landscape:max-md:text-7xl">
      <span>🌳</span>
      <span className="text-[16vw] sm:text-8xl landscape:max-md:text-6xl">🌷</span>
      <span>🚗</span>
    </div>
  );
}

const IKON: Record<IdObjek, string> = {
  pohon: "🌳",
  tanamanPot: "🪴",
  bungaPot: "🌷",
  bungaTanah: "🌼",
  semut: "🐜",
  kupuKupu: "🦋",
  kucing: "🐈",
  sepeda: "🚲",
  motor: "🏍️",
  mobil: "🚗",
  tetangga: "🙋",
};

/** aria-label hanya memakai kata dari materi. */
function label(id: IdObjek): string {
  const cari = sekitarRumah.namaCari.find((c) => (c.id as string) === id);
  if (cari) return cari.nama;
  if (id === "bungaPot" || id === "bungaTanah") return sekitarRumah.namaCari.find((c) => c.id === "bunga")!.nama;
  return sekitarRumah.sekitar.items.find((k) => k.id === KATEGORI_OBJEK[id])!.nama;
}

/** Versi 2D Topik 3 (tanpa WebGL). Logika game sama. */
export function Sekitar2D(p: PropsAdeganSekitar) {
  if (p.adegan === 1) {
    return (
      <div aria-hidden className="flex h-full w-full flex-col items-center justify-center gap-2 pt-20 text-6xl">
        <div className="flex items-end gap-4">
          <span className="text-7xl">🏠</span>
          <span className="text-8xl">🌳</span>
          <span className="text-7xl">🏡</span>
        </div>
        <div className="flex gap-3">🌼🌷🦋🐈</div>
        <div className="w-full bg-[#6b6f7a] py-2 text-center">🚲 🏍️ 🚗</div>
      </div>
    );
  }
  return (
    <div className="grid h-full w-full grid-cols-3 content-center gap-3 px-3 pt-24 pb-3 sm:grid-cols-4 landscape:grid-cols-6 landscape:pt-22">
      {SEMUA_OBJEK.map((id) => {
        const goyang = p.goyang?.id === id ? p.goyang.nonce : 0;
        return (
          <button
            key={`${id}-${goyang}`}
            type="button"
            aria-label={label(id)}
            onClick={() => p.aktif && p.onPilih(id)}
            className={`tekan flex min-h-16 items-center justify-center rounded-3xl border-4 bg-white py-2 text-5xl sm:text-6xl ${
              p.sorot === id ? "kilau border-kuning" : "border-white"
            } ${goyang ? "goyang" : ""} ${p.petunjuk.includes(id) && !p.gerakDikurangi ? "denyut" : ""}`}
          >
            <span aria-hidden>{IKON[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
