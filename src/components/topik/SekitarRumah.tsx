"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";
import { GambarSekitar, Sekitar2D } from "@/components/fallback/Sekitar2D";
import { LayarBintang } from "@/components/LayarBintang";
import { LayoutGame, type Narasi } from "@/components/LayoutGame";
import { PembukaTopik } from "@/components/PembukaTopik";
import { Pujian } from "@/components/Pujian";
import { TombolBesar } from "@/components/Tombol";
import { narasiItem, sekitarRumah, type IdCari } from "@/data/materi";
import { cari, teksUi } from "@/data/teks-ui";
import type { KonfigJT } from "@/game/jelajahTantangan";
import { useProgress } from "@/hooks/useProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpeech } from "@/hooks/useSpeech";
import { sfx } from "@/lib/sfx";
import {
  KATEGORI_OBJEK,
  SEMUA_OBJEK,
  cocokCari,
  type IdObjek,
  type PropsAdeganSekitar,
} from "@/scenes/sekitar-rumah/tipe";
import { Memuat, TitikProgres, usePakai3D } from "./umum";
import { useAdeganJT } from "./useAdeganJT";

const Adegan3D = dynamic(() => import("@/scenes/sekitar-rumah/AdeganSekitar"), {
  ssr: false,
  loading: () => <Memuat ikon={sekitarRumah.info.ikon} />,
});

const { info, melihatLuar, sekitar, namaCari } = sekitarRumah;
const JUMLAH_SOAL = 5;

const KONFIG: KonfigJT = {
  semuaKunci: sekitar.items.map((k) => k.id),
  kunciDari: (id) => KATEGORI_OBJEK[id as IdObjek] ?? null,
  cocok: (soal, id) => cocokCari(soal as IdCari, id as IdObjek),
};

const kategoriDari = (id: string | null) =>
  id ? sekitar.items.find((k) => k.id === KATEGORI_OBJEK[id as IdObjek]) : undefined;
const namaSoal = (id: string) => namaCari.find((c) => c.id === id)?.nama ?? "";

type Tahap = "pembuka" | 1 | 2;

export function SekitarRumah() {
  const { bicara } = useSpeech();
  const { beriBintang, jumlah } = useProgress();
  const gerakDikurangi = useReducedMotion();
  const pakai3D = usePakai3D();
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [layar, setLayar] = useState(false);

  const narasiJelajah = useCallback((id: string) => {
    const k = kategoriDari(id);
    return k ? { teks: narasiItem(k), audio: k.audio } : null;
  }, []);
  const narasiSoal = useCallback((id: string) => cari(namaSoal(id)), []);
  const onSelesai = useCallback(() => {
    beriBintang(info.id, 0);
    setLayar(true);
  }, [beriBintang]);

  const jt = useAdeganJT({
    konfig: KONFIG,
    bicara,
    narasiJelajah,
    narasiSoal,
    daftarSoal: namaCari.map((c) => c.id),
    jumlahSoal: JUMLAH_SOAL,
    onSelesai,
  });

  function keAdegan1() {
    setTahap(1);
    bicara(melihatLuar.teks, { audio: melihatLuar.audio });
  }
  function keAdegan2() {
    sfx.ketuk();
    setTahap(2);
    bicara(sekitar.judul);
  }

  if (tahap === "pembuka") {
    return <PembukaTopik judul={info.judul} gambar={<GambarSekitar />} onMulai={keAdegan1} />;
  }

  let narasi: Narasi;
  let ulangi: string;
  let aksi: ReactNode = null;

  if (tahap === 1) {
    narasi = { judul: melihatLuar.judul, teks: melihatLuar.teks };
    ulangi = melihatLuar.teks;
    aksi = (
      <TombolBesar warna="hijau" onClick={keAdegan2}>
        {teksUi.lanjut} <span aria-hidden>▶</span>
      </TombolBesar>
    );
  } else if (jt.state.fase === "jelajahi") {
    const k = kategoriDari(jt.state.dipilih);
    narasi = { judul: k ? k.nama : sekitar.judul, teks: k?.definisi };
    ulangi = k ? narasiItem(k) : sekitar.judul;
    aksi = jt.terbuka ? (
      <TombolBesar warna="hijau" className="denyut" onClick={jt.mulaiTantangan}>
        {teksUi.lanjut} <span aria-hidden>▶</span>
      </TombolBesar>
    ) : (
      <TitikProgres sudah={jt.state.disentuh.length} total={sekitar.items.length} />
    );
  } else {
    const s = jt.soal;
    narasi = { judul: sekitar.judul, instruksi: s ? cari(namaSoal(s)) : undefined };
    ulangi = s ? cari(namaSoal(s)) : "";
    aksi = <TitikProgres sudah={jt.state.indeks} total={jt.state.soal.length} />;
  }

  const props: PropsAdeganSekitar = {
    adegan: tahap,
    sorot: jt.sorot,
    petunjuk: tahap === 2 ? SEMUA_OBJEK.filter((o) => jt.petunjuk.includes(KATEGORI_OBJEK[o])) : [],
    goyang: jt.goyang,
    aktif: !layar,
    gerakDikurangi,
    onPilih: (id) => jt.pilih(id),
  };

  return (
    <LayoutGame
      ikonTopik={info.ikon}
      dapat={jumlah(info.id)}
      total={info.jumlahBintang}
      onUlangi={() => ulangi && bicara(ulangi)}
      narasi={narasi}
      aksi={aksi}
    >
      {pakai3D === null ? null : pakai3D ? <Adegan3D {...props} /> : <Sekitar2D {...props} />}
      {jt.umpan && (
        <Pujian teks={jt.umpan.teks} nonce={jt.umpan.nonce} warna={jt.umpan.benar ? "text-hijau" : "text-oranye"} />
      )}
      {layar && <LayarBintang dapat={jumlah(info.id)} total={info.jumlahBintang} akhirTopik />}
    </LayoutGame>
  );
}
