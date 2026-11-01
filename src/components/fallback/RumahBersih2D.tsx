"use client";

import { MAINAN, SAMPAH, TARGET_GOSOK } from "@/game/aktivitas";
import type { PropsAdeganBersih } from "@/scenes/rumah-bersih/tipe";

/** Gambar pembuka Topik 2: anak membuang sampah (sesuai "Petunjuk gambar" guru). */
export function GambarBuangSampah() {
  return (
    <svg viewBox="0 0 400 320" className="h-[34vh] max-h-80 w-auto" aria-hidden>
      <ellipse cx="200" cy="300" rx="180" ry="14" fill="#8fd26b" />
      {/* tong sampah */}
      <path d="M270 170 h90 l-10 125 h-70 z" fill="#3bb273" />
      <rect x="262" y="158" width="106" height="16" rx="6" fill="#2a8a57" />
      <path d="M296 195 v80 M315 195 v80 M334 195 v80" stroke="#2a8a57" strokeWidth="6" strokeLinecap="round" />
      {/* sampah melayang */}
      <path d="M190 95 q50 -40 105 50" stroke="#8e6cef" strokeWidth="4" strokeDasharray="8 8" fill="none" />
      <circle cx="248" cy="88" r="16" fill="#f5f5f5" stroke="#cccccc" strokeWidth="3" />
      {/* anak */}
      <rect x="110" y="225" width="18" height="70" rx="8" fill="#2b2350" />
      <rect x="138" y="225" width="18" height="70" rx="8" fill="#2b2350" />
      <rect x="100" y="150" width="66" height="85" rx="26" fill="#3a86ff" />
      <path d="M160 165 l40 -55" stroke="#f2c49b" strokeWidth="16" strokeLinecap="round" />
      <path d="M106 170 l-20 45" stroke="#f2c49b" strokeWidth="16" strokeLinecap="round" />
      <circle cx="133" cy="118" r="34" fill="#f2c49b" />
      <path d="M99 112 a34 34 0 0 1 68 0 q-34 -16 -68 0z" fill="#3b2a20" />
      <circle cx="122" cy="120" r="4" fill="#2b2350" />
      <circle cx="146" cy="120" r="4" fill="#2b2350" />
      <path d="M122 134 q11 9 22 0" stroke="#c0392b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const IKON_SAMPAH: Record<string, string> = { sampah1: "🍬", sampah2: "📄", sampah3: "🍬", sampah4: "📄" };
const IKON_MAINAN: Record<string, string> = { mainan1: "⚽", mainan2: "🧱", mainan3: "🏀", mainan4: "🧱" };

function Kuman({ jumlah, bergoyang }: { jumlah: number; bergoyang: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-20 flex justify-center gap-2 text-4xl">
      {Array.from({ length: jumlah }, (_, i) => (
        <span key={i} className={bergoyang ? "goyang inline-block" : "melayang inline-block"} style={{ animationIterationCount: bergoyang ? "infinite" : undefined }}>
          🦠
        </span>
      ))}
    </div>
  );
}

function TombolBenda({ ikon, onClick, aktif, denyut }: { ikon: string; onClick: () => void; aktif: boolean; denyut: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!aktif}
      className={`tekan flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-5xl ${denyut ? "denyut" : ""}`}
    >
      <span aria-hidden>{ikon}</span>
    </button>
  );
}

/** Versi 2D Topik 2 (tanpa WebGL). Logika game sama. */
export function RumahBersih2D(p: PropsAdeganBersih) {
  const gerak = !p.gerakDikurangi;
  const latar = p.bersinar ? "bg-[#fff6d6]" : "bg-[#ffe9c7]";

  if (p.adegan === 1 || p.aktivitas === null) {
    return (
      <div className={`relative flex h-full w-full items-end justify-center gap-4 pb-6 text-6xl ${latar}`}>
        <Kuman jumlah={p.kuman} bergoyang={p.bergoyang && gerak} />
        {p.kuman === 0 && (
          <span aria-hidden className="melayang absolute top-28 text-8xl">
            ✨
          </span>
        )}
        <span aria-hidden className="flex flex-wrap justify-center gap-3">
          {SAMPAH.filter((s) => p.sampah.includes(s)).map((s) => (
            <span key={s}>{IKON_SAMPAH[s]}</span>
          ))}
          {MAINAN.filter((m) => p.mainan.includes(m)).map((m) => (
            <span key={m}>{IKON_MAINAN[m]}</span>
          ))}
        </span>
      </div>
    );
  }

  if (p.aktivitas === "cuciTangan") {
    const busa = p.cuci === "gosok" ? Math.min(TARGET_GOSOK, p.busa) : 0;
    return (
      <div className={`relative flex h-full w-full flex-col items-center justify-center gap-4 pt-20 ${latar}`}>
        <Kuman jumlah={p.kuman} bergoyang={false} />
        <button
          type="button"
          onClick={() => p.aktif && p.cuci === "gosok" && p.onGosok()}
          className={`relative flex h-40 w-56 items-center justify-center rounded-[2rem] bg-white/70 text-8xl ${p.cuci === "kilau" ? "kilau" : ""}`}
        >
          <span aria-hidden className={busa > 0 && gerak ? "goyang inline-block" : "inline-block"} key={busa}>
            👐
          </span>
          <span aria-hidden className="absolute inset-0 flex flex-wrap items-center justify-center text-3xl">
            {Array.from({ length: busa }, (_, i) => (
              <span key={i}>🫧</span>
            ))}
          </span>
          {p.cuci === "bilas" && (
            <span aria-hidden className="absolute -top-10 text-5xl">
              💧💧
            </span>
          )}
          {p.cuci === "kilau" && (
            <span aria-hidden className="absolute -top-8 text-5xl">
              ✨
            </span>
          )}
        </button>
        <TombolBenda ikon="🧼" onClick={() => p.aktif && p.onSabun()} aktif={p.aktif && p.cuci === "sabun"} denyut={p.cuci === "sabun" && gerak} />
      </div>
    );
  }

  const buang = p.aktivitas === "buangSampah";
  const daftar = buang ? p.sampah : p.mainan;
  const ikon = buang ? IKON_SAMPAH : IKON_MAINAN;
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-6 pt-24 pb-4 ${latar}`}>
      <Kuman jumlah={p.kuman} bergoyang={false} />
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {daftar.map((id) => (
          <TombolBenda
            key={id}
            ikon={ikon[id]}
            aktif={p.aktif}
            denyut={gerak}
            onClick={() => (buang ? p.onBuang(id) : p.onRapikan(id))}
          />
        ))}
      </div>
      <div aria-hidden className="text-8xl">
        {buang ? "🗑️" : "📦"}
      </div>
    </div>
  );
}
