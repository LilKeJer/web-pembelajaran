"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ambilAcak } from "@/game/acak";
import {
  buatReducer,
  soalSekarang,
  stateAwal,
  tantanganTerbuka,
  type KonfigJT,
  type StateJT,
} from "@/game/jelajahTantangan";
import { pujianAcak, teksUi } from "@/data/teks-ui";
import { sfx } from "@/lib/sfx";

type Bicara = (teks: string, opsi?: { audio?: string; selesai?: () => void }) => void;

export type UmpanBalik = { teks: string; nonce: number; benar: boolean } | null;

/**
 * Menghubungkan logika murni Jelajahi → Tantangan dengan suara, efek, dan pujian.
 * Narasi selalu dipicu langsung dari handler ketukan.
 */
export function useAdeganJT({
  konfig,
  bicara,
  narasiJelajah,
  narasiSoal,
  daftarSoal,
  jumlahSoal,
  onSelesai,
}: {
  konfig: KonfigJT;
  bicara: Bicara;
  /** Teks + audio yang dibacakan saat objek disentuh di fase jelajahi. */
  narasiJelajah: (idObjek: string) => { teks: string; audio?: string } | null;
  /** Teks soal yang dibacakan. */
  narasiSoal: (idSoal: string) => string;
  daftarSoal: string[];
  jumlahSoal: number;
  onSelesai: () => void;
}) {
  const reducer = useMemo(() => buatReducer(konfig), [konfig]);
  const [state, setState] = useState<StateJT>(stateAwal);
  const [umpan, setUmpan] = useState<UmpanBalik>(null);
  const [sorotBenar, setSorotBenar] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timer.current.forEach(clearTimeout), []);

  const pilih = useCallback(
    (id: string) => {
      const next = reducer(state, { type: "PILIH", id });
      if (next === state) return;
      setState(next);

      if (state.fase === "jelajahi") {
        sfx.ketuk();
        const n = narasiJelajah(id);
        if (n) bicara(n.teks, { audio: n.audio });
        return;
      }

      const nonce = next.hasil?.nonce ?? 0;
      if (next.hasil?.jenis === "benar") {
        sfx.benar();
        const p = pujianAcak();
        setUmpan({ teks: p, nonce, benar: true });
        setSorotBenar(id);
        timer.current.push(setTimeout(() => setSorotBenar(null), 1300));
        if (next.fase === "selesai") {
          bicara(p);
          timer.current.push(setTimeout(onSelesai, 1300));
        } else {
          const s = soalSekarang(next);
          bicara(s ? `${p} ${narasiSoal(s)}` : p);
        }
      } else {
        sfx.salah();
        setUmpan({ teks: teksUi.cobaLagi, nonce, benar: false });
        const s = soalSekarang(next);
        bicara(s ? `${teksUi.cobaLagi} ${narasiSoal(s)}` : teksUi.cobaLagi);
      }
    },
    [state, reducer, narasiJelajah, narasiSoal, bicara, onSelesai],
  );

  const terbuka = tantanganTerbuka(state, konfig);

  const mulaiTantangan = useCallback(() => {
    if (state.fase !== "jelajahi" || !terbuka) return;
    const soal = ambilAcak(daftarSoal, jumlahSoal);
    setState(reducer(state, { type: "MULAI_TANTANGAN", soal }));
    sfx.ketuk();
    bicara(narasiSoal(soal[0]));
  }, [state, terbuka, daftarSoal, jumlahSoal, reducer, bicara, narasiSoal]);

  const reset = useCallback(() => {
    setState(stateAwal());
    setUmpan(null);
    setSorotBenar(null);
  }, []);

  const goyang = umpan && !umpan.benar && state.hasil ? { id: state.hasil.id, nonce: umpan.nonce } : null;

  return {
    state,
    pilih,
    mulaiTantangan,
    reset,
    terbuka,
    umpan,
    goyang,
    sorot: state.fase === "jelajahi" ? state.dipilih : sorotBenar,
    soal: soalSekarang(state),
    petunjuk: state.fase === "jelajahi" ? konfig.semuaKunci.filter((k) => !state.disentuh.includes(k)) : [],
  };
}
