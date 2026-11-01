import type { IdBagianRumah, IdRuangan } from "@/data/materi";

/** Props yang sama untuk adegan 3D dan versi 2D cadangan Topik 1. */
export type PropsAdeganRumahku = {
  adegan: 1 | 2 | 3;
  /** Objek yang sedang disorot (menyala). */
  sorot: string | null;
  /** Objek yang belum dijelajahi (berdenyut pelan sebagai petunjuk). */
  petunjuk: string[];
  goyang: { id: string; nonce: number } | null;
  /** Ruangan yang difokuskan kamera (adegan 3). */
  fokus: IdRuangan | null;
  pintuTerbuka: boolean;
  /** Boleh disentuh? (false saat narasi pembuka / layar bintang). */
  aktif: boolean;
  gerakDikurangi: boolean;
  onPilih: (id: IdBagianRumah | IdRuangan) => void;
};
