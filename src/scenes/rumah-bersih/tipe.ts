import type { IdKebiasaan } from "@/data/materi";
import type { TahapCuci } from "@/game/aktivitas";

/** Props yang sama untuk adegan 3D dan versi 2D cadangan Topik 2. */
export type PropsAdeganBersih = {
  adegan: 1 | 2;
  aktivitas: IdKebiasaan | null;
  /** Sampah yang masih di lantai. */
  sampah: string[];
  /** Mainan yang masih di lantai. */
  mainan: string[];
  cuci: TahapCuci;
  busa: number;
  /** Jumlah kuman yang masih ada. */
  kuman: number;
  /** Semua selesai: ruangan bersinar. */
  bersinar: boolean;
  /** Kuman bergoyang (saat narasi berjalan). */
  bergoyang: boolean;
  aktif: boolean;
  gerakDikurangi: boolean;
  onBuang: (id: string) => void;
  onRapikan: (id: string) => void;
  onSabun: () => void;
  onGosok: () => void;
};
