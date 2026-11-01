"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { Awan, Orang, Prisma, Tanah, yPusatPrisma } from "../common/bentuk";
import { Interaktif } from "../common/Interaktif";
import type { Vec3 } from "../common/KameraHalus";
import { Panggung } from "../common/Panggung";
import type { IdObjek, PropsAdeganSekitar } from "./tipe";

const KAMERA = { posisi: [0, 6.2, 13.5] as Vec3, lihat: [0, 0.9, 0.6] as Vec3 };
const KAMERA_AWAL: Vec3 = [-3.2, 1.5, -0.6];

export default function AdeganSekitar(p: PropsAdeganSekitar) {
  const gerak = !p.gerakDikurangi;
  const umum = (id: IdObjek) => ({
    id,
    onPilih: p.onPilih as (id: string) => void,
    sorot: p.sorot === id,
    petunjuk: p.petunjuk.includes(id),
    goyang: p.goyang?.id === id ? p.goyang.nonce : 0,
    aktif: p.aktif && p.adegan === 2,
    diam: p.gerakDikurangi,
  });

  return (
    <Panggung kamera={KAMERA.posisi} kameraAwal={KAMERA_AWAL} lihat={KAMERA.lihat} gerakDikurangi={p.gerakDikurangi}>
      <Tanah />
      <Jalan />
      <Awan position={[-5, 7, -8]} skala={1.2} />
      <Awan position={[5, 7.5, -9]} />

      {/* Rumah kita & rumah tetangga (properti) */}
      <RumahKecil position={[-3.3, 0, -3]} dinding="#ffe5a8" atap="#e8553e" />
      <RumahKecil position={[3.4, 0, -3.3]} dinding="#cde7ff" atap="#8e6cef" />

      {/* Tanaman & Bunga */}
      <Interaktif {...umum("pohon")} area={[3, 4.4, 2.6]} posisiArea={[0, 2.2, 0]} position={[0, 0, -3.4]}>
        <PohonBesar />
      </Interaktif>
      <Interaktif {...umum("tanamanPot")} area={[1.3, 1.6, 1.3]} posisiArea={[0, 0.7, 0]} position={[5.3, 0, -0.6]}>
        <TanamanPot />
      </Interaktif>
      <Interaktif {...umum("bungaPot")} area={[1.3, 1.6, 1.3]} posisiArea={[0, 0.7, 0]} position={[-0.9, 0, -0.9]}>
        <BungaPot />
      </Interaktif>
      <Interaktif {...umum("bungaTanah")} area={[3, 1.3, 1.5]} posisiArea={[0, 0.5, 0]} position={[-3.3, 0, -0.6]}>
        <BungaTanah />
      </Interaktif>

      {/* Hewan Kecil */}
      <Interaktif {...umum("semut")} area={[1.6, 1.8, 0.8]} posisiArea={[0, 1.2, 0.2]} position={[-1.7, 0, -1.5]}>
        <Semut gerak={gerak} />
      </Interaktif>
      <Bergerak jenis="kupu" gerak={gerak}>
        <Interaktif {...umum("kupuKupu")} area={[1.4, 1.2, 1.2]}>
          <KupuKupu gerak={gerak} />
        </Interaktif>
      </Bergerak>
      <Bergerak jenis="kucing" gerak={gerak}>
        <Interaktif {...umum("kucing")} area={[1.6, 1.2, 1.2]} posisiArea={[0, 0.45, 0]}>
          <Kucing gerak={gerak} />
        </Interaktif>
      </Bergerak>

      {/* Kendaraan */}
      <Bergerak jenis="mobil" gerak={gerak}>
        <Interaktif {...umum("mobil")} area={[3.2, 2, 1.8]} posisiArea={[0, 0.8, 0]}>
          <Mobil />
        </Interaktif>
      </Bergerak>
      <Bergerak jenis="motor" gerak={gerak}>
        <Interaktif {...umum("motor")} area={[2.2, 1.8, 1.2]} posisiArea={[0, 0.7, 0]}>
          <Motor />
        </Interaktif>
      </Bergerak>
      <Bergerak jenis="sepeda" gerak={gerak}>
        <Interaktif {...umum("sepeda")} area={[2, 1.8, 1.1]} posisiArea={[0, 0.7, 0]}>
          <Sepeda />
        </Interaktif>
      </Bergerak>

      {/* Tetangga */}
      <Interaktif {...umum("tetangga")} area={[1.3, 2.6, 1.2]} posisiArea={[0, 1.1, 0]} position={[2.1, 0, -0.9]}>
        <Orang skala={1.25} baju="#3bb273" celana="#5a4fcf" rambut="#222" lambai gerak={gerak} />
      </Interaktif>
    </Panggung>
  );
}

// ---------------------------------------------------------------------------
// Gerakan (pelan; diam jika prefers-reduced-motion)
// ---------------------------------------------------------------------------

type JenisGerak = "mobil" | "motor" | "sepeda" | "kucing" | "kupu";

const LINTASAN: Record<JenisGerak, { z: number; y: number; jarak: number; laju: number; fase: number }> = {
  mobil: { z: 3.7, y: 0, jarak: 4.2, laju: 0.22, fase: 0 },
  motor: { z: 5.1, y: 0, jarak: 4.6, laju: 0.3, fase: 2.2 },
  sepeda: { z: 4.4, y: 0, jarak: 3.8, laju: 0.18, fase: 4.1 },
  kucing: { z: 1.9, y: 0, jarak: 3, laju: 0.25, fase: 1 },
  kupu: { z: -0.2, y: 1.7, jarak: 1.4, laju: 0.6, fase: 0 },
};

function Bergerak({ jenis, gerak, children }: { jenis: JenisGerak; gerak: boolean; children: ReactNode }) {
  const g = useRef<Group>(null);
  const L = LINTASAN[jenis];
  useFrame(({ clock }, delta) => {
    if (!g.current) return;
    const t = gerak ? clock.elapsedTime * L.laju + L.fase : L.fase;
    if (jenis === "kupu") {
      g.current.position.set(-3.3 + Math.sin(t) * L.jarak, L.y + Math.sin(t * 2) * 0.35, L.z + Math.sin(t * 2) * 0.5);
      g.current.rotation.y = Math.cos(t) > 0 ? 0.4 : -0.4;
      return;
    }
    const x = Math.sin(t) * L.jarak;
    const arah = Math.cos(t) >= 0 ? 0 : Math.PI; // menghadap arah gerak
    g.current.position.set(x, L.y, L.z);
    const r = g.current.rotation;
    r.y += (arah - r.y) * (gerak ? 1 - Math.exp(-delta * 4) : 1);
  });
  return <group ref={g}>{children}</group>;
}

// ---------------------------------------------------------------------------
// Properti & objek
// ---------------------------------------------------------------------------

function Jalan() {
  return (
    <group>
      {/* trotoar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <planeGeometry args={[40, 1.2]} />
        <meshStandardMaterial color="#d9d4cc" />
      </mesh>
      {/* jalan */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 4.5]}>
        <planeGeometry args={[40, 3.6]} />
        <meshStandardMaterial color="#6b6f7a" />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-19 + i * 3, 0.015, 4.5]}>
          <planeGeometry args={[1.4, 0.12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function RumahKecil({ position, dinding, atap }: { position: Vec3; dinding: string; atap: string }) {
  const W = 3.8;
  const D = 3;
  const H = 2.4;
  return (
    <group position={position}>
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={dinding} />
      </mesh>
      <Prisma panjang={W + 0.5} lebar={D + 0.6} tinggi={1.4} warna={atap} position={[0, yPusatPrisma(H, D + 0.6, 1.4), 0]} />
      <mesh position={[-0.7, 0.85, D / 2 + 0.01]}>
        <planeGeometry args={[0.9, 1.7]} />
        <meshStandardMaterial color="#c0703a" />
      </mesh>
      <mesh position={[0.9, 1.4, D / 2 + 0.01]}>
        <planeGeometry args={[1, 0.8]} />
        <meshStandardMaterial color="#9fdcff" />
      </mesh>
    </group>
  );
}

function PohonBesar() {
  return (
    <group>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 2.2, 10]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[1.45, 14, 12]} />
        <meshStandardMaterial color="#2fa863" flatShading />
      </mesh>
      <mesh position={[-0.8, 2.4, 0.4]}>
        <sphereGeometry args={[0.9, 12, 10]} />
        <meshStandardMaterial color="#3bb273" flatShading />
      </mesh>
      <mesh position={[0.85, 2.5, 0.3]}>
        <sphereGeometry args={[0.85, 12, 10]} />
        <meshStandardMaterial color="#45c27f" flatShading />
      </mesh>
    </group>
  );
}

function Pot({ warna = "#d0693b" }: { warna?: string }) {
  return (
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.38, 0.28, 0.6, 14]} />
      <meshStandardMaterial color={warna} />
    </mesh>
  );
}

function TanamanPot() {
  return (
    <group>
      <Pot warna="#b35a2e" />
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.3) * 0.15, 0.85, Math.sin(i * 1.3) * 0.15]} rotation={[Math.cos(i * 1.3) * 0.5, 0, Math.sin(i * 1.3) * 0.5]}>
          <coneGeometry args={[0.16, 0.8, 6]} />
          <meshStandardMaterial color="#2fa863" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Bunga({ position, warna, tinggi = 0.6 }: { position: Vec3; warna: string; tinggi?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, tinggi / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, tinggi, 6]} />
        <meshStandardMaterial color="#2fa863" />
      </mesh>
      <group position={[0, tinggi, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[Math.cos((i * 2 * Math.PI) / 5) * 0.13, 0, Math.sin((i * 2 * Math.PI) / 5) * 0.13]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color={warna} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshStandardMaterial color="#ffd23f" />
        </mesh>
      </group>
    </group>
  );
}

function BungaPot() {
  return (
    <group>
      <Pot />
      <Bunga position={[0, 0.55, 0]} warna="#ff6b9a" tinggi={0.55} />
      <Bunga position={[-0.15, 0.55, 0.1]} warna="#8e6cef" tinggi={0.4} />
      <Bunga position={[0.17, 0.55, -0.05]} warna="#ff8c42" tinggi={0.45} />
    </group>
  );
}

function BungaTanah() {
  const warna = ["#ff6b9a", "#ffd23f", "#8e6cef", "#ff8c42", "#e8553e", "#3a86ff"];
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[2.8, 0.12, 1]} />
        <meshStandardMaterial color="#7a4e2d" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <Bunga
          key={i}
          position={[-1.15 + (i % 5) * 0.58 + (i > 4 ? 0.29 : 0), 0.1, i > 4 ? 0.22 : -0.18]}
          warna={warna[i % warna.length]}
          tinggi={0.45 + (i % 3) * 0.12}
        />
      ))}
    </group>
  );
}

function Semut({ gerak }: { gerak: boolean }) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = gerak ? clock.elapsedTime * 0.25 : 0.3;
    g.current.children.forEach((c, i) => {
      const u = (t + i * 0.2) % 1;
      c.position.set(Math.sin(u * 6) * 0.15, 0.3 + u * 1.8, 0.03);
    });
  });
  return (
    <group ref={g}>
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} rotation={[0, 0, 0]}>
          {[0, 0.09, 0.18].map((y, j) => (
            <mesh key={j} position={[0, y, 0]} scale={[1, j === 1 ? 0.8 : 1, 0.6]}>
              <sphereGeometry args={[j === 0 ? 0.06 : 0.05, 6, 5]} />
              <meshStandardMaterial color="#2b1d14" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function KupuKupu({ gerak }: { gerak: boolean }) {
  const kiri = useRef<Group>(null);
  const kanan = useRef<Group>(null);
  useFrame(({ clock }) => {
    const a = gerak ? Math.sin(clock.elapsedTime * 14) * 0.8 : 0.5;
    if (kiri.current) kiri.current.rotation.x = -a;
    if (kanan.current) kanan.current.rotation.x = a;
  });
  return (
    <group scale={1.3}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.04, 0.3, 4, 8]} />
        <meshStandardMaterial color="#2b2350" />
      </mesh>
      <group ref={kiri}>
        <mesh position={[0, 0, 0.26]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 12]} />
          <meshStandardMaterial color="#ff8c42" side={2} />
        </mesh>
      </group>
      <group ref={kanan}>
        <mesh position={[0, 0, -0.26]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 12]} />
          <meshStandardMaterial color="#ff6b9a" side={2} />
        </mesh>
      </group>
    </group>
  );
}

function Kucing({ gerak }: { gerak: boolean }) {
  const ekor = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ekor.current) ekor.current.rotation.z = 0.6 + (gerak ? Math.sin(clock.elapsedTime * 4) * 0.3 : 0);
  });
  const bulu = "#ff9f43";
  return (
    <group>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.2, 0.55, 6, 10]} />
        <meshStandardMaterial color={bulu} />
      </mesh>
      {[
        [-0.25, 0.12],
        [0.25, 0.12],
        [-0.25, -0.12],
        [0.25, -0.12],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
          <meshStandardMaterial color={bulu} />
        </mesh>
      ))}
      <group position={[0.48, 0.62, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 14, 12]} />
          <meshStandardMaterial color={bulu} />
        </mesh>
        {[-0.1, 0.1].map((z) => (
          <mesh key={z} position={[0, 0.2, z]}>
            <coneGeometry args={[0.07, 0.15, 4]} />
            <meshStandardMaterial color={bulu} />
          </mesh>
        ))}
        {[-0.08, 0.08].map((z) => (
          <mesh key={z} position={[0.19, 0.04, z]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshBasicMaterial color="#2b2350" />
          </mesh>
        ))}
        <mesh position={[0.21, -0.04, 0]}>
          <sphereGeometry args={[0.03, 8, 6]} />
          <meshBasicMaterial color="#ff6b9a" />
        </mesh>
      </group>
      <group ref={ekor} position={[-0.45, 0.45, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.45, 6]} />
          <meshStandardMaterial color={bulu} />
        </mesh>
      </group>
    </group>
  );
}

function Roda({ position, r = 0.3 }: { position: Vec3; r?: number }) {
  return (
    <mesh position={position}>
      <torusGeometry args={[r, r * 0.3, 8, 16]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

function Mobil() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.6, 0.6, 1.3]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      <mesh position={[-0.15, 1.15, 0]}>
        <boxGeometry args={[1.4, 0.55, 1.2]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      {/* kaca */}
      <mesh position={[-0.15, 1.15, 0.61]}>
        <planeGeometry args={[1.2, 0.4]} />
        <meshStandardMaterial color="#bfe9ff" />
      </mesh>
      <mesh position={[-0.15, 1.15, -0.61]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 0.4]} />
        <meshStandardMaterial color="#bfe9ff" />
      </mesh>
      <mesh position={[1.31, 0.65, 0.4]}>
        <boxGeometry args={[0.04, 0.15, 0.25]} />
        <meshBasicMaterial color="#fff3a0" />
      </mesh>
      <mesh position={[1.31, 0.65, -0.4]}>
        <boxGeometry args={[0.04, 0.15, 0.25]} />
        <meshBasicMaterial color="#fff3a0" />
      </mesh>
      {[
        [-0.85, 0.66],
        [0.85, 0.66],
        [-0.85, -0.66],
        [0.85, -0.66],
      ].map(([x, z], i) => (
        <Roda key={i} position={[x, 0.32, z]} />
      ))}
    </group>
  );
}

function Motor() {
  return (
    <group>
      <Roda position={[-0.6, 0.32, 0]} />
      <Roda position={[0.6, 0.32, 0]} />
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1, 0.35, 0.35]} />
        <meshStandardMaterial color="#3a86ff" />
      </mesh>
      <mesh position={[-0.2, 0.9, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.55, 0.95, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0.68, 1.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.6, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Orang position={[-0.15, 0.55, 0]} rotation={[0, Math.PI / 2, 0]} skala={0.7} baju="#ff8c42" gerak={false} />
    </group>
  );
}

function Sepeda() {
  return (
    <group>
      <Roda position={[-0.55, 0.35, 0]} r={0.32} />
      <Roda position={[0.55, 0.35, 0]} r={0.32} />
      {(
        [
          [0, 0.55, 0, 1.0, 0, 0, Math.PI / 2],
          [-0.25, 0.55, 0, 0.55, 0, 0, 0.6],
          [0.4, 0.6, 0, 0.55, 0, 0, -0.35],
        ] as const
      ).map(([x, y, z, len, rx, ry, rz], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[rx, ry, rz]}>
          <cylinderGeometry args={[0.035, 0.035, len, 6]} />
          <meshStandardMaterial color="#3bb273" />
        </mesh>
      ))}
      <Orang position={[-0.1, 0.35, 0]} rotation={[0, Math.PI / 2, 0]} skala={0.65} baju="#ffd23f" gerak={false} />
    </group>
  );
}
