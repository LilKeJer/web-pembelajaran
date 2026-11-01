"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { rumahku, type IdBagianRumah, type IdRuangan } from "@/data/materi";
import type { PropsAdeganRumahku } from "@/scenes/rumahku/tipe";

/**
 * Versi 2D Topik 1 (tanpa WebGL). Logika game sama; hanya tampilan yang berbeda.
 * aria-label hanya memakai nama dari materi.
 */

const namaBagian = (id: IdBagianRumah) => rumahku.bagianRumah.items.find((b) => b.id === id)?.nama ?? "";
const namaRuangan = (id: IdRuangan) => rumahku.ruangan.items.find((r) => r.id === id)?.nama ?? "";

function tekanEnter(e: KeyboardEvent, f: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    f();
  }
}

function Bagian({
  id,
  p,
  children,
}: {
  id: IdBagianRumah;
  p: PropsAdeganRumahku;
  children: ReactNode;
}) {
  const sorot = p.sorot === id;
  const petunjuk = p.petunjuk.includes(id);
  const goyang = p.goyang?.id === id ? p.goyang.nonce : 0;
  const pilih = () => p.aktif && p.onPilih(id);
  return (
    <g
      key={`${id}-${goyang}`}
      role="button"
      tabIndex={0}
      aria-label={namaBagian(id)}
      onClick={pilih}
      onKeyDown={(e) => tekanEnter(e, pilih)}
      className={`cursor-pointer outline-none ${goyang ? "goyang" : ""} ${petunjuk && !p.gerakDikurangi ? "denyut" : ""}`}
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        filter: sorot ? "drop-shadow(0 0 10px #ffd23f) brightness(1.15)" : undefined,
      }}
    >
      {children}
    </g>
  );
}

/** Gambar rumah besar (SVG). Dipakai di layar pembuka topik dan versi 2D. */
export function GambarRumah({
  p,
  denganAnak = false,
  kelas = "h-[34vh] max-h-80 w-auto",
}: {
  p?: PropsAdeganRumahku;
  denganAnak?: boolean;
  kelas?: string;
}) {
  const bungkus = (id: IdBagianRumah, isi: ReactNode) => (p ? <Bagian id={id} p={p}>{isi}</Bagian> : isi);
  const pintuTerbuka = p?.pintuTerbuka ?? false;
  return (
    <svg viewBox="0 0 400 340" className={kelas} aria-hidden={p ? undefined : true}>
      {bungkus(
        "lantai",
        <g>
          <rect x="30" y="290" width="340" height="36" rx="6" fill="#c99a6b" />
          {[60, 130, 200, 270].map((x) => (
            <rect key={x} x={x} y="296" width="60" height="24" rx="3" fill="#ddb487" />
          ))}
        </g>,
      )}
      {bungkus("dinding", <rect x="75" y="150" width="250" height="140" fill="#ffe5a8" />)}
      {bungkus("atap", <polygon points="50,158 200,40 350,158" fill="#e8553e" />)}
      {bungkus(
        "pintu",
        <g>
          <rect x="105" y="196" width="64" height="94" rx="4" fill="#5a3e2b" />
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "left center",
              transform: pintuTerbuka ? "scaleX(0.25)" : "scaleX(1)",
              transition: "transform 400ms ease",
            }}
          >
            <rect x="105" y="196" width="64" height="94" rx="4" fill="#c0703a" />
            <circle cx="158" cy="246" r="5" fill="#ffd23f" />
          </g>
        </g>,
      )}
      {bungkus(
        "jendela",
        <g>
          <rect x="210" y="185" width="84" height="66" fill="#fff1c9" />
          {denganAnak && (
            <g>
              <ellipse cx="252" cy="250" rx="26" ry="14" fill="#ff6b9a" />
              <circle cx="252" cy="222" r="17" fill="#f2c49b" />
              <path d="M235 218 a17 17 0 0 1 34 0 z" fill="#3b2a20" />
              <circle cx="246" cy="224" r="2.4" fill="#2b2350" />
              <circle cx="258" cy="224" r="2.4" fill="#2b2350" />
              <path d="M246 231 q6 5 12 0" stroke="#c0392b" strokeWidth="2" fill="none" />
            </g>
          )}
          <rect x="210" y="185" width="84" height="66" fill="#9fdcff" fillOpacity="0.4" />
          <rect x="210" y="185" width="84" height="66" fill="none" stroke="#fff" strokeWidth="7" />
          <line x1="252" y1="185" x2="252" y2="251" stroke="#fff" strokeWidth="5" />
          <line x1="210" y1="218" x2="294" y2="218" stroke="#fff" strokeWidth="5" />
        </g>,
      )}
    </svg>
  );
}

function Adegan1_2D({ gerak }: { gerak: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes cerah { 0%,45% { opacity: 1; transform: scale(1);} 50%,95% { opacity: 0; transform: scale(.3);} 100% {opacity:1; transform: scale(1);} }
        @keyframes mendung { 0%,45% { opacity: 0;} 50%,95% { opacity: 1;} 100% {opacity:0;} }
        @keyframes tetes { from { transform: translateY(-20px);} to { transform: translateY(120px);} }
      `}</style>
      <div
        aria-hidden
        className="absolute top-20 left-[12%] text-7xl"
        style={gerak ? { animation: "cerah 10s infinite" } : undefined}
      >
        ☀️
      </div>
      {gerak && (
        <div aria-hidden className="absolute inset-x-0 top-16 h-40" style={{ animation: "mendung 10s infinite" }}>
          <div className="flex justify-center gap-6 text-7xl">
            <span>☁️</span>
            <span>☁️</span>
          </div>
          <div className="absolute inset-x-[15%] top-16 flex justify-between">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="block h-5 w-1 rounded bg-biru"
                style={{ animation: `tetes 0.8s linear ${i * 0.08}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}
      <GambarRumah denganAnak kelas="mt-16 h-[48%] w-auto" />
    </div>
  );
}

const WARNA_RUANGAN: Record<IdRuangan, { bg: string; ikon: string }> = {
  kamarTidur: { bg: "bg-[#bfd7ff]", ikon: "🛏️" },
  dapur: { bg: "bg-[#fff0b3]", ikon: "🍳" },
  kamarMandi: { bg: "bg-[#c4f1ea]", ikon: "🛁" },
};

export function Rumahku2D(p: PropsAdeganRumahku) {
  if (p.adegan === 1) return <Adegan1_2D gerak={!p.gerakDikurangi} />;

  if (p.adegan === 2) {
    return (
      <div className="flex h-full w-full items-center justify-center pt-20 pb-2">
        <GambarRumah p={p} kelas="h-full max-h-[70vh] w-auto max-w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-stretch justify-center gap-3 px-4 pt-24 pb-3 landscape:flex-row landscape:pt-22">
      {rumahku.ruangan.items.map((r) => {
        const w = WARNA_RUANGAN[r.id];
        const goyang = p.goyang?.id === r.id ? p.goyang.nonce : 0;
        return (
          <button
            key={`${r.id}-${goyang}`}
            type="button"
            aria-label={namaRuangan(r.id)}
            onClick={() => p.aktif && p.onPilih(r.id)}
            className={`tekan flex min-h-16 flex-1 items-center justify-center rounded-[2rem] border-8 ${w.bg} ${
              p.sorot === r.id ? "kilau border-kuning" : "border-white"
            } ${goyang ? "goyang" : ""} ${p.petunjuk.includes(r.id) && !p.gerakDikurangi ? "denyut" : ""}`}
          >
            <span aria-hidden className="text-6xl sm:text-7xl">
              {w.ikon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
