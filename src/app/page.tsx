"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DeretBintang } from "@/components/Bintang";
import { TombolBesar, TombolIkon } from "@/components/Tombol";
import { daftarTopik, type InfoTopik } from "@/data/materi";
import { teksUi } from "@/data/teks-ui";
import { useProgress } from "@/hooks/useProgress";
import { bukaIzinSuara, izinSuaraTerbuka, useSpeech } from "@/hooks/useSpeech";
import { tembakKonfeti } from "@/lib/konfeti";
import { sfx } from "@/lib/sfx";

const warnaKartu = ["bg-kuning", "bg-merah-muda", "bg-hijau"];
const tanpaLangganan = () => () => {};

export default function Beranda() {
  const router = useRouter();
  const { bicara } = useSpeech();
  const { jumlah, semuaSelesai } = useProgress();
  const izinSebelumnya = useSyncExternalStore(tanpaLangganan, izinSuaraTerbuka, () => false);
  const [ditekan, setDitekan] = useState(false);
  const [menuju, setMenuju] = useState<string | null>(null);
  const sudahPergi = useRef(false);
  const mulai = ditekan || izinSebelumnya;

  useEffect(() => {
    daftarTopik.forEach((t) => router.prefetch(t.rute));
  }, [router]);

  useEffect(() => {
    if (mulai && semuaSelesai) void tembakKonfeti();
  }, [mulai, semuaSelesai]);

  function pilihTopik(t: InfoTopik) {
    if (menuju) return;
    sfx.ketuk();
    setMenuju(t.id);
    sudahPergi.current = false;
    const pergi = () => {
      if (sudahPergi.current) return;
      sudahPergi.current = true;
      router.push(t.rute);
    };
    bicara(t.judul, { audio: t.audio, selesai: pergi });
    setTimeout(pergi, 3000);
  }

  if (!mulai) {
    return (
      <main className="flex h-dvh w-full flex-col items-center justify-center gap-8 overflow-hidden bg-langit p-4">
        <div aria-hidden className="melayang flex gap-3 text-7xl sm:text-8xl">
          {daftarTopik.map((t) => (
            <span key={t.id}>{t.ikon}</span>
          ))}
        </div>
        <TombolBesar
          warna="oranye"
          className="denyut px-14 py-6 text-4xl sm:text-5xl"
          onClick={() => {
            bukaIzinSuara();
            sfx.buka();
            sfx.ketuk();
            setDitekan(true);
          }}
        >
          {teksUi.ayoMulai}
        </TombolBesar>
      </main>
    );
  }

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-langit">
      <div className="flex items-center justify-end p-3">
        <TombolIkon
          ikon="🔊"
          label={teksUi.ulangi}
          warna="kuning"
          onClick={() => bicara(semuaSelesai ? teksUi.semuaSelesai : daftarTopik.map((t) => t.judul).join(". "))}
        />
      </div>

      {semuaSelesai && (
        <p className="muncul mx-4 mb-2 rounded-3xl bg-white px-4 py-2 text-center text-2xl font-bold text-ungu sm:text-3xl">
          🎉 {teksUi.semuaSelesai}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] landscape:flex-row">
        {daftarTopik.map((t, i) => {
          const dapat = jumlah(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => pilihTopik(t)}
              className={`tekan flex min-h-0 flex-1 items-center gap-4 rounded-[2rem] px-5 py-3 text-left landscape:flex-col landscape:justify-center landscape:text-center ${warnaKartu[i]} ${menuju === t.id ? "kilau scale-[1.02]" : ""}`}
            >
              <span aria-hidden className="text-6xl leading-none sm:text-7xl">
                {t.ikon}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-2xl leading-tight font-bold text-teks sm:text-3xl">{t.judul}</span>
                <DeretBintang dapat={dapat} total={t.jumlahBintang} ukuran="text-2xl sm:text-3xl" />
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
