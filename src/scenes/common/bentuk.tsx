"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { Vec3 } from "./KameraHalus";

/** Angka acak tetap (deterministik) supaya posisi properti stabil di setiap render. */
export function acakTetap(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Prisma segitiga (atap pelana) memanjang di sumbu X, puncak ke atas. */
export function Prisma({
  panjang,
  lebar,
  tinggi,
  warna,
  position,
}: {
  panjang: number;
  lebar: number;
  tinggi: number;
  warna: string;
  position?: Vec3;
}) {
  // Jari-jari agar lebar alas = lebar. Tinggi diatur lewat skala.
  const r = lebar / Math.sqrt(3);
  const skalaTinggi = tinggi / (1.5 * r);
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} scale={[skalaTinggi, 1, 1]}>
      <cylinderGeometry args={[r, r, panjang, 3, 1, false, Math.PI / 2]} />
      <meshStandardMaterial color={warna} flatShading />
    </mesh>
  );
}

/** Titik pusat prisma agar alasnya tepat di `yAlas`. */
export function yPusatPrisma(yAlas: number, lebar: number, tinggi: number) {
  const r = lebar / Math.sqrt(3);
  const skalaTinggi = tinggi / (1.5 * r);
  return yAlas + 0.5 * r * skalaTinggi;
}

/**
 * Figur orang sederhana (properti visual, tanpa nama).
 * `lambai`: tangan kanan melambai.
 */
export function Orang({
  position,
  rotation,
  skala = 1,
  baju = "#3a86ff",
  celana = "#2b2350",
  rambut = "#3b2a20",
  kulit = "#f2c49b",
  lambai = false,
  gerak = true,
}: {
  position?: Vec3;
  rotation?: Vec3;
  skala?: number;
  baju?: string;
  celana?: string;
  rambut?: string;
  kulit?: string;
  lambai?: boolean;
  gerak?: boolean;
}) {
  const tangan = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!tangan.current) return;
    tangan.current.rotation.z = lambai && gerak ? 2.4 + Math.sin(clock.elapsedTime * 6) * 0.35 : lambai ? 2.4 : 0.15;
  });
  return (
    <group position={position} rotation={rotation} scale={skala}>
      {/* kaki */}
      <mesh position={[-0.12, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color={celana} />
      </mesh>
      <mesh position={[0.12, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color={celana} />
      </mesh>
      {/* badan */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.6, 10]} />
        <meshStandardMaterial color={baju} />
      </mesh>
      {/* lengan kiri */}
      <group position={[-0.28, 1.08, 0]} rotation={[0, 0, -0.15]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 8]} />
          <meshStandardMaterial color={kulit} />
        </mesh>
      </group>
      {/* lengan kanan */}
      <group ref={tangan} position={[0.28, 1.08, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 8]} />
          <meshStandardMaterial color={kulit} />
        </mesh>
      </group>
      {/* kepala */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshStandardMaterial color={kulit} />
      </mesh>
      {/* rambut */}
      <mesh position={[0, 1.5, -0.03]} scale={[1, 0.7, 1]}>
        <sphereGeometry args={[0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={rambut} />
      </mesh>
      {/* mata */}
      <mesh position={[-0.09, 1.42, 0.24]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshBasicMaterial color="#2b2350" />
      </mesh>
      <mesh position={[0.09, 1.42, 0.24]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshBasicMaterial color="#2b2350" />
      </mesh>
      {/* senyum */}
      <mesh position={[0, 1.32, 0.245]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.07, 0.015, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#c0392b" />
      </mesh>
    </group>
  );
}

/** Tanah hijau luas. */
export function Tanah({ warna = "#8fd26b", ukuran = 80, y = 0 }: { warna?: string; ukuran?: number; y?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[ukuran, ukuran]} />
      <meshStandardMaterial color={warna} />
    </mesh>
  );
}

/** Awan (properti visual). */
export function Awan({ position, skala = 1, warna = "#ffffff" }: { position: Vec3; skala?: number; warna?: string }) {
  return (
    <group position={position} scale={skala}>
      {(
        [
          [0, 0, 0, 0.9],
          [0.9, -0.1, 0, 0.7],
          [-0.9, -0.15, 0, 0.65],
          [0.4, 0.45, 0, 0.6],
        ] as const
      ).map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 12, 10]} />
          <meshStandardMaterial color={warna} />
        </mesh>
      ))}
    </group>
  );
}
