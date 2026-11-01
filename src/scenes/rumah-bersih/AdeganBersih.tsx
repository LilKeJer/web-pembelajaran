"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { MAINAN, SAMPAH, TARGET_GOSOK, TOTAL_KUMAN } from "@/game/aktivitas";
import { acakTetap } from "../common/bentuk";
import type { Vec3 } from "../common/KameraHalus";
import { Panggung } from "../common/Panggung";
import type { PropsAdeganBersih } from "./tipe";

const KAMERA_RUANG = { posisi: [0, 6, 10.5] as Vec3, lihat: [0, 0.9, 0] as Vec3 };
const KAMERA_CUCI = { posisi: [-2.8, 2.3, 1.0] as Vec3, lihat: [-2.8, 1.6, -2.3] as Vec3 };

const POS_TONG: Vec3 = [4, 0, -2];
const POS_KOTAK: Vec3 = [-3.8, 0, 1.6];
const POS_WASTAFEL: Vec3 = [-2.8, 0, -2.6];

const POS_SAMPAH: Record<string, Vec3> = {
  sampah1: [-1.6, 0, 1.6],
  sampah2: [1.1, 0, 2.6],
  sampah3: [2.6, 0, 0.3],
  sampah4: [-0.2, 0, -0.9],
};
const POS_MAINAN: Record<string, Vec3> = {
  mainan1: [0.9, 0, 1.1],
  mainan2: [-2.1, 0, 3],
  mainan3: [2.2, 0, 2.9],
  mainan4: [-1, 0, 0.2],
};
// Posisi mainan di dalam kotak
const DALAM_KOTAK: Record<string, Vec3> = {
  mainan1: [POS_KOTAK[0] - 0.35, 0.55, POS_KOTAK[2] - 0.2],
  mainan2: [POS_KOTAK[0] + 0.35, 0.55, POS_KOTAK[2] + 0.2],
  mainan3: [POS_KOTAK[0] + 0.3, 0.6, POS_KOTAK[2] - 0.25],
  mainan4: [POS_KOTAK[0] - 0.3, 0.6, POS_KOTAK[2] + 0.25],
};
const POS_KUMAN: Vec3[] = [
  [-3.6, 1.6, -2.6],
  [3.2, 0.5, -1.2],
  [0.2, 0.5, 2.1],
  [-2.6, 0.5, 0.9],
  [2.4, 2.3, -2.8],
  [1.1, 0.5, -1.8],
];

export default function AdeganBersih(p: PropsAdeganBersih) {
  const cuci = p.adegan === 2 && p.aktivitas === "cuciTangan";
  const kamera = cuci ? KAMERA_CUCI : KAMERA_RUANG;
  const gerak = !p.gerakDikurangi;

  return (
    <Panggung kamera={kamera.posisi} lihat={kamera.lihat} gerakDikurangi={p.gerakDikurangi} latar="#ffe9c7">
      <Ruangan bersinar={p.bersinar} />
      <TongSampah />
      <KotakMainan />
      <Wastafel />

      {SAMPAH.map((id, i) => (
        <BendaTerbang
          key={id}
          id={id}
          dari={POS_SAMPAH[id]}
          ke={[POS_TONG[0], 1.3, POS_TONG[2]]}
          sudah={!p.sampah.includes(id)}
          hilangSetelah
          bisaDisentuh={p.aktif && p.adegan === 2 && p.aktivitas === "buangSampah"}
          petunjuk={p.adegan === 2 && p.aktivitas === "buangSampah" && gerak}
          onPilih={p.onBuang}
          gerak={gerak}
        >
          {i % 2 === 0 ? <BungkusJajan warna={i === 0 ? "#ff6b9a" : "#3a86ff"} /> : <SisaKertas />}
        </BendaTerbang>
      ))}

      {MAINAN.map((id, i) => (
        <BendaTerbang
          key={id}
          id={id}
          dari={POS_MAINAN[id]}
          ke={DALAM_KOTAK[id]}
          sudah={!p.mainan.includes(id)}
          bisaDisentuh={p.aktif && p.adegan === 2 && p.aktivitas === "rapikanMainan"}
          petunjuk={p.adegan === 2 && p.aktivitas === "rapikanMainan" && gerak}
          onPilih={p.onRapikan}
          gerak={gerak}
        >
          {i % 2 === 0 ? <Bola warna={i === 0 ? "#e8553e" : "#ffd23f"} /> : <Balok warna={i === 1 ? "#3bb273" : "#8e6cef"} />}
        </BendaTerbang>
      ))}

      {POS_KUMAN.map((pos, i) => (
        <Kuman key={i} posisi={pos} ada={i < p.kuman} bergoyang={p.bergoyang && gerak} indeks={i} />
      ))}

      {cuci && <CuciTangan {...p} gerak={gerak} />}
      {p.bersinar && gerak && <Sparkles position={[0, 2, 0]} scale={[10, 4, 7]} count={60} size={8} speed={0.5} color="#fff3a0" />}
    </Panggung>
  );
}

// ---------------------------------------------------------------------------

function Ruangan({ bersinar }: { bersinar: boolean }) {
  return (
    <group>
      {/* lantai */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial color={bersinar ? "#ffe1a6" : "#e6c79c"} />
      </mesh>
      {/* dinding belakang & kiri & kanan */}
      <mesh position={[0, 1.8, -3.1]}>
        <boxGeometry args={[10.4, 3.6, 0.2]} />
        <meshStandardMaterial color={bersinar ? "#d6f5ff" : "#b9dcea"} />
      </mesh>
      <mesh position={[-5.2, 1.8, 0.5]}>
        <boxGeometry args={[0.2, 3.6, 7.4]} />
        <meshStandardMaterial color={bersinar ? "#ffe0ef" : "#f2c6d8"} />
      </mesh>
      <mesh position={[5.2, 1.8, 0.5]}>
        <boxGeometry args={[0.2, 3.6, 7.4]} />
        <meshStandardMaterial color={bersinar ? "#ffe0ef" : "#f2c6d8"} />
      </mesh>
      {/* karpet (properti) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.01, 1.4]}>
        <circleGeometry args={[2, 24]} />
        <meshStandardMaterial color="#ffd6a5" />
      </mesh>
    </group>
  );
}

function TongSampah() {
  return (
    <group position={POS_TONG}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 1.1, 16, 1, true]} />
        <meshStandardMaterial color="#3bb273" side={2} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.06, 16]} />
        <meshStandardMaterial color="#2a8a57" />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.05, 8, 20]} />
        <meshStandardMaterial color="#2a8a57" />
      </mesh>
    </group>
  );
}

function KotakMainan() {
  const w = 1.6;
  const d = 1.2;
  const h = 0.8;
  return (
    <group position={POS_KOTAK}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[w, 0.06, d]} />
        <meshStandardMaterial color="#c0703a" />
      </mesh>
      {(
        [
          [0, h / 2, d / 2, w, 0.08],
          [0, h / 2, -d / 2, w, 0.08],
        ] as const
      ).map(([x, y, z, ww, dd], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[ww, h, dd]} />
          <meshStandardMaterial color="#ff8c42" />
        </mesh>
      ))}
      {[-w / 2, w / 2].map((x) => (
        <mesh key={x} position={[x, h / 2, 0]}>
          <boxGeometry args={[0.08, h, d]} />
          <meshStandardMaterial color="#ff8c42" />
        </mesh>
      ))}
    </group>
  );
}

function Wastafel() {
  return (
    <group position={POS_WASTAFEL}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.05, 0.1]}>
        <boxGeometry args={[1.6, 0.18, 0.9]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.15, 0.12]}>
        <boxGeometry args={[1.3, 0.04, 0.65]} />
        <meshStandardMaterial color="#cfe8f5" />
      </mesh>
      {/* keran */}
      <mesh position={[0, 1.6, -0.25]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.03, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} />
      </mesh>
      {/* cermin */}
      <mesh position={[0, 2.4, -0.38]}>
        <boxGeometry args={[1.2, 0.9, 0.04]} />
        <meshStandardMaterial color="#e8f7ff" roughness={0.1} />
      </mesh>
    </group>
  );
}

function BungkusJajan({ warna }: { warna: string }) {
  return (
    <group rotation={[0, 0.5, 0]}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.38]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      <mesh position={[0.36, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.16, 4]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      <mesh position={[-0.36, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.16, 4]} />
        <meshStandardMaterial color={warna} />
      </mesh>
    </group>
  );
}

function SisaKertas() {
  return (
    <mesh position={[0, 0.2, 0]}>
      <icosahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#f5f5f5" flatShading />
    </mesh>
  );
}

function Bola({ warna }: { warna: string }) {
  return (
    <mesh position={[0, 0.25, 0]}>
      <sphereGeometry args={[0.25, 16, 12]} />
      <meshStandardMaterial color={warna} />
    </mesh>
  );
}

function Balok({ warna }: { warna: string }) {
  return (
    <mesh position={[0, 0.18, 0]} rotation={[0, 0.4, 0]}>
      <boxGeometry args={[0.36, 0.36, 0.36]} />
      <meshStandardMaterial color={warna} />
    </mesh>
  );
}

/**
 * Benda yang bisa diketuk lalu melayang ke tujuan (tong sampah / kotak mainan).
 */
function BendaTerbang({
  id,
  dari,
  ke,
  sudah,
  hilangSetelah = false,
  bisaDisentuh,
  petunjuk,
  onPilih,
  gerak,
  children,
}: {
  id: string;
  dari: Vec3;
  ke: Vec3;
  sudah: boolean;
  hilangSetelah?: boolean;
  bisaDisentuh: boolean;
  petunjuk: boolean;
  onPilih: (id: string) => void;
  gerak: boolean;
  children: ReactNode;
}) {
  const grup = useRef<Group>(null);
  const t = useRef(0);
  const a = useRef(new Vector3(...dari));
  const b = useRef(new Vector3(...ke));

  useFrame(({ clock }, delta) => {
    const g = grup.current;
    if (!g) return;
    if (sudah) {
      t.current = gerak ? Math.min(1, t.current + delta / 0.7) : 1;
    } else {
      t.current = 0;
    }
    const u = t.current;
    g.position.lerpVectors(a.current, b.current, u);
    g.position.y += Math.sin(u * Math.PI) * 2; // lintasan melengkung
    if (u === 0 && petunjuk) g.position.y += Math.abs(Math.sin(clock.elapsedTime * 3 + dari[0])) * 0.12;
    const s = hilangSetelah ? (u >= 1 ? 0.001 : 1 - Math.max(0, u - 0.8) * 4) : 1;
    g.scale.setScalar(Math.max(0.001, s));
    g.rotation.y = u * Math.PI * 2;
    g.visible = !(hilangSetelah && u >= 1);
  });

  const pilih = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (bisaDisentuh && !sudah) onPilih(id);
  };

  return (
    <group ref={grup} position={dari}>
      {children}
      {/* area sentuh lebih besar dari bendanya */}
      <mesh position={[0, 0.3, 0]} onClick={pilih}>
        <boxGeometry args={[1.1, 0.9, 1.1]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

/** Kuman kartun lucu: bulatan berwarna dengan mata. */
function Kuman({ posisi, ada, bergoyang, indeks }: { posisi: Vec3; ada: boolean; bergoyang: boolean; indeks: number }) {
  const g = useRef<Group>(null);
  const warna = ["#7bd389", "#b28dff", "#ffb347", "#6ec6ff", "#ff7aa2", "#a3e048"][indeks % TOTAL_KUMAN];
  const duri = useMemo(() => {
    const r = acakTetap(indeks + 11);
    return Array.from({ length: 7 }, () => [r() * Math.PI * 2, r() * Math.PI] as const);
  }, [indeks]);
  useFrame(({ clock }, delta) => {
    if (!g.current) return;
    const t = clock.elapsedTime + indeks;
    const s = g.current.scale.x + ((ada ? 1 : 0.001) - g.current.scale.x) * (1 - Math.exp(-delta * 5));
    g.current.scale.setScalar(s);
    g.current.visible = s > 0.01;
    g.current.position.y = posisi[1] + (bergoyang ? Math.sin(t * 6) * 0.12 : Math.sin(t * 1.5) * 0.04);
    g.current.rotation.z = bergoyang ? Math.sin(t * 8) * 0.25 : 0;
  });
  return (
    <group ref={g} position={posisi}>
      <mesh>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      {duri.map(([th, ph], i) => (
        <mesh
          key={i}
          position={[0.34 * Math.sin(ph) * Math.cos(th), 0.34 * Math.cos(ph), 0.34 * Math.sin(ph) * Math.sin(th) - 0.05]}
        >
          <sphereGeometry args={[0.07, 6, 5]} />
          <meshStandardMaterial color={warna} />
        </mesh>
      ))}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.07, 0.28]}>
          <mesh>
            <sphereGeometry args={[0.08, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshBasicMaterial color="#2b2350" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.09, 0.3]}>
        <torusGeometry args={[0.06, 0.015, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#2b2350" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Cuci tangan
// ---------------------------------------------------------------------------

const POS_TANGAN: Vec3 = [POS_WASTAFEL[0], 1.45, POS_WASTAFEL[2] + 0.3];

function Tangan({ kiri, gosok }: { kiri: boolean; gosok: number }) {
  const g = useRef<Group>(null);
  const terakhir = useRef(gosok);
  const mulai = useRef(-10);
  useFrame(({ clock }) => {
    if (!g.current) return;
    if (gosok !== terakhir.current) {
      terakhir.current = gosok;
      mulai.current = clock.elapsedTime;
    }
    const d = clock.elapsedTime - mulai.current;
    const geser = d < 0.4 ? Math.sin(d * 30) * 0.06 * (kiri ? 1 : -1) : 0;
    g.current.position.x = (kiri ? -0.3 : 0.3) + geser;
  });
  const kulit = "#f2c49b";
  return (
    <group ref={g} position={[kiri ? -0.3 : 0.3, 0, 0]} rotation={[0.3, 0, kiri ? -0.35 : 0.35]}>
      <mesh scale={[1, 1.15, 0.45]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshStandardMaterial color={kulit} />
      </mesh>
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <mesh key={x} position={[x, 0.3 + (i === 1 || i === 2 ? 0.03 : 0), 0]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color={kulit} />
        </mesh>
      ))}
      <mesh position={[kiri ? 0.24 : -0.24, 0.05, 0.02]} rotation={[0, 0, kiri ? -0.9 : 0.9]}>
        <capsuleGeometry args={[0.055, 0.14, 4, 8]} />
        <meshStandardMaterial color={kulit} />
      </mesh>
    </group>
  );
}

function CuciTangan(p: PropsAdeganBersih & { gerak: boolean }) {
  const sabun = useRef<Mesh>(null);
  const air = useRef<Mesh>(null);
  const geser = useRef<{ x: number; jarak: number; tekan: boolean }>({ x: 0, jarak: 0, tekan: false });

  useFrame(({ clock }) => {
    if (sabun.current) {
      const denyut = p.cuci === "sabun" && p.gerak ? 1 + Math.sin(clock.elapsedTime * 4) * 0.08 : 1;
      sabun.current.scale.setScalar(denyut);
    }
    if (air.current) {
      air.current.visible = p.cuci === "bilas";
      air.current.scale.x = 1 + Math.sin(clock.elapsedTime * 20) * 0.08;
    }
  });

  const bisaSabun = p.aktif && p.cuci === "sabun";
  const bisaGosok = p.aktif && p.cuci === "gosok";

  const busa = p.cuci === "gosok" ? Math.min(TARGET_GOSOK, p.busa) : 0;
  const posBusa = useMemo(() => {
    const r = acakTetap(5);
    return Array.from(
      { length: TARGET_GOSOK * 3 },
      () => [r() * 0.9 - 0.45, r() * 0.7 - 0.2, r() * 0.25 + 0.05, 0.06 + r() * 0.07] as const,
    );
  }, []);

  return (
    <group>
      {/* Sabun di tepi wastafel */}
      <group position={[POS_WASTAFEL[0] + 0.62, 1.22, POS_WASTAFEL[2] + 0.35]}>
        <mesh ref={sabun}>
          <boxGeometry args={[0.3, 0.14, 0.2]} />
          <meshStandardMaterial color="#ff9ec4" />
        </mesh>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            if (bisaSabun) p.onSabun();
          }}
        >
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        {p.cuci === "sabun" && p.gerak && (
          <Sparkles scale={[0.5, 0.4, 0.4]} count={8} size={4} speed={0.6} color="#ffffff" />
        )}
      </group>

      {/* Dua tangan kartun */}
      <group position={POS_TANGAN}>
        <Tangan kiri gosok={p.busa} />
        <Tangan kiri={false} gosok={p.busa} />
        {posBusa.slice(0, busa * 3).map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 10, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.92} />
          </mesh>
        ))}
        {p.cuci === "kilau" && p.gerak && (
          <Sparkles position={[0, 0.15, 0.1]} scale={[1, 0.9, 0.5]} count={24} size={6} speed={0.8} color="#fff3a0" />
        )}
        {/* area gosok: ketuk berulang atau geser jari */}
        <mesh
          position={[0, 0.1, 0.25]}
          onClick={(e) => {
            e.stopPropagation();
            if (bisaGosok) p.onGosok();
          }}
          onPointerDown={(e) => {
            geser.current = { x: e.nativeEvent.clientX, jarak: 0, tekan: true };
          }}
          onPointerUp={() => {
            geser.current.tekan = false;
          }}
          onPointerLeave={() => {
            geser.current.tekan = false;
          }}
          onPointerMove={(e) => {
            const gs = geser.current;
            if (!gs.tekan || !bisaGosok) return;
            gs.jarak += Math.abs(e.nativeEvent.clientX - gs.x);
            gs.x = e.nativeEvent.clientX;
            if (gs.jarak > 70) {
              gs.jarak = 0;
              p.onGosok();
            }
          }}
        >
          <boxGeometry args={[1.5, 1.1, 0.4]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {/* Air membilas */}
      <mesh ref={air} position={[POS_WASTAFEL[0], 1.86, POS_WASTAFEL[2] + 0.2]} visible={false}>
        <cylinderGeometry args={[0.05, 0.09, 0.32, 10]} />
        <meshStandardMaterial color="#6ec6ff" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}
