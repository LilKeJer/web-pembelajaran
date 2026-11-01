"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";
import { LayarBintang } from "@/components/LayarBintang";
import { LayoutGame, type Narasi } from "@/components/LayoutGame";
import { PembukaTopik } from "@/components/PembukaTopik";
import { Pujian } from "@/components/Pujian";
import { TombolBesar } from "@/components/Tombol";
import { Rumahku2D, GambarRumah } from "@/components/fallback/Rumahku2D";
import { narasiItem, rumahku, type IdBagianRumah, type IdRuangan } from "@/data/materi";
import { sentuh, teksUi } from "@/data/teks-ui";
import type { KonfigJT } from "@/game/jelajahTantangan";
import { useProgress } from "@/hooks/useProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpeech } from "@/hooks/useSpeech";
import { sfx } from "@/lib/sfx";
import type { PropsAdeganRumahku } from "@/scenes/rumahku/tipe";
import { Memuat, TitikProgres, usePakai3D } from "./umum";
import { useAdeganJT } from "./useAdeganJT";

const Adegan3D = dynamic(() => import("@/scenes/rumahku/AdeganRumahku"), {
  ssr: false,
  loading: () => <Memuat ikon={rumahku.info.ikon} />,
});

const { info, apaItuRumah, bagianRumah, ruangan } = rumahku;
const ID_BAGIAN = bagianRumah.items.map((b) => b.id);
const ID_RUANGAN = ruangan.items.map((r) => r.id);
const KONFIG_BAGIAN: KonfigJT = { semuaKunci: ID_BAGIAN };
const KONFIG_RUANGAN: KonfigJT = { semuaKunci: ID_RUANGAN };

const cariBagian = (id: string) => bagianRumah.items.find((b) => b.id === id);
const cariRuangan = (id: string) => ruangan.items.find((r) => r.id === id);

type Tahap = "pembuka" | 1 | 2 | 3;

export function Rumahku() {
  const { bicara } = useSpeech();
  const { beriBintang, jumlah } = useProgress();
  const gerakDikurangi = useReducedMotion();
  const pakai3D = usePakai3D();
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [layar, setLayar] = useState<null | "adegan" | "akhir">(null);

  // ----- Adegan 2: bagian rumah -----
  const narasiBagian = useCallback((id: string) => {
    const b = cariBagian(id);
    return b ? { teks: narasiItem(b), audio: b.audio } : null;
  }, []);
  const soalBagian = useCallback((id: string) => sentuh(cariBagian(id)?.nama ?? ""), []);
  const selesaiBagian = useCallback(() => {
    beriBintang(info.id, 1);
    setLayar("adegan");
  }, [beriBintang]);
  const jt2 = useAdeganJT({
    konfig: KONFIG_BAGIAN,
    bicara,
    narasiJelajah: narasiBagian,
    narasiSoal: soalBagian,
    daftarSoal: ID_BAGIAN,
    jumlahSoal: ID_BAGIAN.length,
    onSelesai: selesaiBagian,
  });

  // ----- Adegan 3: ruangan -----
  const narasiRuangan = useCallback((id: string) => {
    const r = cariRuangan(id);
    return r ? { teks: narasiItem(r), audio: r.audio } : null;
  }, []);
  const soalRuangan = useCallback(
    (id: string) => `${cariRuangan(id)?.definisi ?? ""} ${teksUi.sentuhRuangannya}`,
    [],
  );
  const selesaiRuangan = useCallback(() => {
    beriBintang(info.id, 2);
    setLayar("akhir");
  }, [beriBintang]);
  const jt3 = useAdeganJT({
    konfig: KONFIG_RUANGAN,
    bicara,
    narasiJelajah: narasiRuangan,
    narasiSoal: soalRuangan,
    daftarSoal: ID_RUANGAN,
    jumlahSoal: ID_RUANGAN.length,
    onSelesai: selesaiRuangan,
  });

  // ----- Pindah tahap (narasi dari handler ketukan) -----
  function keAdegan1() {
    setTahap(1);
    bicara(apaItuRumah.teks, { audio: apaItuRumah.audio });
  }
  function selesaiAdegan1() {
    sfx.ketuk();
    beriBintang(info.id, 0);
    setLayar("adegan");
  }
  function lanjutDariBintang() {
    setLayar(null);
    if (tahap === 1) {
      setTahap(2);
      jt2.reset();
      bicara(bagianRumah.judul);
    } else if (tahap === 2) {
      setTahap(3);
      jt3.reset();
      bicara(ruangan.judul);
    }
  }

  if (tahap === "pembuka") {
    return <PembukaTopik judul={info.judul} gambar={<GambarRumah />} onMulai={keAdegan1} />;
  }

  // ----- Narasi di layar & tombol aksi -----
  let narasi: Narasi = {};
  let ulangi = "";
  let aksi: ReactNode = null;
  const jt = tahap === 2 ? jt2 : tahap === 3 ? jt3 : null;

  if (tahap === 1) {
    narasi = { judul: apaItuRumah.judul, teks: apaItuRumah.teks };
    ulangi = apaItuRumah.teks;
    aksi = (
      <TombolBesar warna="hijau" onClick={selesaiAdegan1} disabled={layar !== null}>
        {teksUi.lanjut} <span aria-hidden>▶</span>
      </TombolBesar>
    );
  } else if (jt) {
    const daftar = tahap === 2 ? bagianRumah : ruangan;
    const item = (id: string | null) => (id ? daftar.items.find((x) => x.id === id) : undefined);
    if (jt.state.fase === "jelajahi") {
      const d = item(jt.state.dipilih);
      narasi = { judul: d ? d.nama : daftar.judul, teks: d?.definisi };
      ulangi = d ? narasiItem(d) : daftar.judul;
      aksi = jt.terbuka ? (
        <TombolBesar warna="hijau" className="denyut" onClick={jt.mulaiTantangan}>
          {teksUi.lanjut} <span aria-hidden>▶</span>
        </TombolBesar>
      ) : (
        <TitikProgres sudah={jt.state.disentuh.length} total={daftar.items.length} />
      );
    } else {
      const s = item(jt.soal);
      if (tahap === 2) {
        narasi = { judul: daftar.judul, instruksi: s ? sentuh(s.nama) : undefined };
        ulangi = s ? sentuh(s.nama) : "";
      } else {
        narasi = { teks: s?.definisi, instruksi: teksUi.sentuhRuangannya };
        ulangi = s ? `${s.definisi} ${teksUi.sentuhRuangannya}` : "";
      }
      aksi = <TitikProgres sudah={jt.state.indeks} total={jt.state.soal.length} />;
    }
  }

  const propsAdegan: PropsAdeganRumahku = {
    adegan: tahap,
    sorot: jt?.sorot ?? null,
    petunjuk: jt?.petunjuk ?? [],
    goyang: jt?.goyang ?? null,
    fokus: tahap === 3 && jt3.state.fase === "jelajahi" ? ((jt3.state.dipilih as IdRuangan | null) ?? null) : null,
    pintuTerbuka: jt2.sorot === "pintu" && tahap === 2,
    aktif: layar === null,
    gerakDikurangi,
    onPilih: (id: IdBagianRumah | IdRuangan) => jt?.pilih(id),
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
      {pakai3D === null ? null : pakai3D ? <Adegan3D {...propsAdegan} /> : <Rumahku2D {...propsAdegan} />}
      {jt?.umpan && (
        <Pujian
          teks={jt.umpan.teks}
          nonce={jt.umpan.nonce}
          warna={jt.umpan.benar ? "text-hijau" : "text-oranye"}
        />
      )}
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
