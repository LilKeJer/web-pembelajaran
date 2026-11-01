"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GambarBuangSampah, RumahBersih2D } from "@/components/fallback/RumahBersih2D";
import { LayarBintang } from "@/components/LayarBintang";
import { LayoutGame, type Narasi } from "@/components/LayoutGame";
import { PembukaTopik } from "@/components/PembukaTopik";
import { Pujian } from "@/components/Pujian";
import { TombolBesar } from "@/components/Tombol";
import { narasiItem, rumahBersih, type IdKebiasaan } from "@/data/materi";
import { pujianAcak, teksUi } from "@/data/teks-ui";
import {
  URUTAN,
  aktivitasSekarang,
  reducerAktivitas,
  stateAwalAktivitas,
  type AksiAktivitas,
  type StateAktivitas,
} from "@/game/aktivitas";
import { useProgress } from "@/hooks/useProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpeech } from "@/hooks/useSpeech";
import { sfx } from "@/lib/sfx";
import type { PropsAdeganBersih } from "@/scenes/rumah-bersih/tipe";
import { Memuat, TitikProgres, usePakai3D } from "./umum";

const Adegan3D = dynamic(() => import("@/scenes/rumah-bersih/AdeganBersih"), {
  ssr: false,
  loading: () => <Memuat ikon={rumahBersih.info.ikon} />,
});

const { info, kenapaBersih, kebiasaan } = rumahBersih;

const INSTRUKSI: Record<IdKebiasaan, string> = {
  buangSampah: teksUi.masukkanKeTong,
  rapikanMainan: teksUi.rapikanMainannya,
  cuciTangan: teksUi.ketukSabunnya,
};

const cariKebiasaan = (id: IdKebiasaan) => kebiasaan.items.find((k) => k.id === id)!;

function instruksiUntuk(s: StateAktivitas): string | undefined {
  const a = aktivitasSekarang(s);
  if (!a || s.subfase !== "main") return undefined;
  if (a === "cuciTangan") return s.cuci === "gosok" ? teksUi.gosokTangannya : s.cuci === "sabun" ? teksUi.ketukSabunnya : undefined;
  return INSTRUKSI[a];
}

type Tahap = "pembuka" | 1 | 2;

export function RumahBersih() {
  const { bicara, sedangBicara } = useSpeech();
  const { beriBintang, jumlah } = useProgress();
  const gerakDikurangi = useReducedMotion();
  const pakai3D = usePakai3D();
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [s, setS] = useState<StateAktivitas>(stateAwalAktivitas);
  const [layar, setLayar] = useState<null | "adegan" | "akhir">(null);
  const [umpan, setUmpan] = useState<{ teks: string; nonce: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timer.current.forEach(clearTimeout), []);

  function kirim(a: AksiAktivitas): StateAktivitas {
    const next = reducerAktivitas(s, a);
    setS(next);
    return next;
  }

  /** Mulai aktivitas berikutnya: bacakan judul + definisi + instruksi. */
  function mulaiAktivitas(st: StateAktivitas) {
    const next = reducerAktivitas(st, { type: "MULAI" });
    setS(next);
    const a = aktivitasSekarang(next);
    if (!a) return;
    const k = cariKebiasaan(a);
    bicara(`${narasiItem(k)} ${INSTRUKSI[a]}`, { audio: k.audio });
  }

  function beres(next: StateAktivitas) {
    sfx.benar();
    const p = pujianAcak();
    setUmpan({ teks: p, nonce: Date.now() });
    bicara(p);
    const idx = next.indeks;
    timer.current.push(
      setTimeout(() => {
        beriBintang(info.id, idx);
        setLayar(idx >= URUTAN.length - 1 ? "akhir" : "adegan");
      }, 1400),
    );
  }

  // ----- handler ketukan -----
  function onBuang(id: string) {
    const next = kirim({ type: "BUANG", id });
    if (next === s) return;
    sfx.wus();
    if (next.subfase === "beres") beres(next);
  }
  function onRapikan(id: string) {
    const next = kirim({ type: "RAPIKAN", id });
    if (next === s) return;
    sfx.wus();
    if (next.subfase === "beres") beres(next);
  }
  function onSabun() {
    const next = kirim({ type: "KETUK_SABUN" });
    if (next === s) return;
    sfx.ketuk();
    bicara(teksUi.gosokTangannya);
  }
  function onGosok() {
    const next = kirim({ type: "GOSOK" });
    if (next === s) return;
    sfx.gosok();
    if (next.cuci === "bilas") {
      sfx.wus();
      timer.current.push(
        setTimeout(() => {
          // Selama membilas tidak ada aksi lain yang diterima reducer, jadi `next` masih terbaru.
          const n = reducerAktivitas(next, { type: "BILAS_SELESAI" });
          setS(n);
          if (n.subfase === "beres") beres(n);
        }, 1800),
      );
    }
  }

  function keAdegan1() {
    setTahap(1);
    bicara(kenapaBersih.teks, { audio: kenapaBersih.audio });
  }
  function keAdegan2() {
    sfx.ketuk();
    setTahap(2);
    mulaiAktivitas(s);
  }
  function lanjutDariBintang() {
    setLayar(null);
    setUmpan(null);
    mulaiAktivitas(reducerAktivitas(s, { type: "LANJUT" }));
  }

  if (tahap === "pembuka") {
    return <PembukaTopik judul={info.judul} gambar={<GambarBuangSampah />} onMulai={keAdegan1} latar="bg-[#ffe9c7]" />;
  }

  const akt = aktivitasSekarang(s);
  let narasi: Narasi;
  let ulangi: string;
  let aksi: ReactNode = null;

  if (tahap === 1) {
    narasi = { judul: kenapaBersih.judul, teks: kenapaBersih.teks };
    ulangi = kenapaBersih.teks;
    aksi = (
      <TombolBesar warna="hijau" onClick={keAdegan2}>
        {teksUi.lanjut} <span aria-hidden>▶</span>
      </TombolBesar>
    );
  } else if (akt) {
    const k = cariKebiasaan(akt);
    const instruksi = instruksiUntuk(s);
    narasi = { judul: k.nama, teks: k.definisi, instruksi };
    ulangi = `${narasiItem(k)}${instruksi ? ` ${instruksi}` : ""}`;
    if (akt === "buangSampah") aksi = <TitikProgres sudah={4 - s.sampah.length} total={4} />;
    if (akt === "rapikanMainan") aksi = <TitikProgres sudah={4 - s.mainan.length} total={4} />;
  } else {
    narasi = { judul: kebiasaan.judul };
    ulangi = kebiasaan.judul;
  }

  const props: PropsAdeganBersih = {
    adegan: tahap,
    aktivitas: tahap === 2 ? akt : null,
    sampah: s.sampah,
    mainan: s.mainan,
    cuci: s.cuci,
    busa: s.busa,
    kuman: s.kuman,
    bersinar: s.kuman === 0,
    bergoyang: tahap === 1 && sedangBicara,
    aktif: layar === null && s.subfase === "main",
    gerakDikurangi,
    onBuang,
    onRapikan,
    onSabun,
    onGosok,
  };

  return (
    <LayoutGame
      ikonTopik={info.ikon}
      dapat={jumlah(info.id)}
      total={info.jumlahBintang}
      onUlangi={() => bicara(ulangi)}
      narasi={narasi}
      aksi={aksi}
      latar="bg-[#ffe9c7]"
    >
      {pakai3D === null ? null : pakai3D ? <Adegan3D {...props} /> : <RumahBersih2D {...props} />}
      {umpan && <Pujian teks={umpan.teks} nonce={umpan.nonce} />}
      {layar && (
        <LayarBintang
          dapat={jumlah(info.id)}
          total={info.jumlahBintang}
          akhirTopik={layar === "akhir"}
          onLanjut={lanjutDariBintang}
        />
      )}
    </LayoutGame>
  );
}
