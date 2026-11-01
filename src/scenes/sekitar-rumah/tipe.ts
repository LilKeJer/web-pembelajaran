import type { IdCari, IdSekitar } from "@/data/materi";

/** Objek yang bisa disentuh di Topik 3 (hanya yang ada di materi). */
export type IdObjek =
  | "pohon" // tumbuhan hijau (tidak pernah disebut "pohon" di layar/suara)
  | "tanamanPot"
  | "bungaPot"
  | "bungaTanah"
  | "semut"
  | "kupuKupu"
  | "kucing"
  | "sepeda"
  | "motor"
  | "mobil"
  | "tetangga";

export const SEMUA_OBJEK: IdObjek[] = [
  "pohon",
  "tanamanPot",
  "bungaPot",
  "bungaTanah",
  "semut",
  "kupuKupu",
  "kucing",
  "sepeda",
  "motor",
  "mobil",
  "tetangga",
];

export const KATEGORI_OBJEK: Record<IdObjek, IdSekitar> = {
  pohon: "tanaman",
  tanamanPot: "tanaman",
  bungaPot: "tanaman",
  bungaTanah: "tanaman",
  semut: "hewan",
  kupuKupu: "hewan",
  kucing: "hewan",
  sepeda: "kendaraan",
  motor: "kendaraan",
  mobil: "kendaraan",
  tetangga: "tetangga",
};

/** Objek yang menjawab soal "Cari {nama}!". */
export function cocokCari(soal: IdCari, objek: IdObjek): boolean {
  if (soal === "bunga") return objek === "bungaPot" || objek === "bungaTanah";
  return soal === objek;
}

/** Props yang sama untuk adegan 3D dan versi 2D cadangan Topik 3. */
export type PropsAdeganSekitar = {
  adegan: 1 | 2;
  sorot: string | null;
  petunjuk: IdObjek[];
  goyang: { id: string; nonce: number } | null;
  aktif: boolean;
  gerakDikurangi: boolean;
  onPilih: (id: IdObjek) => void;
};
