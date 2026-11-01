"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import { Color, Mesh, MeshStandardMaterial, type Group } from "three";
import type { Vec3 } from "./KameraHalus";

const KUNING = new Color("#ffd23f");

/**
 * Pembungkus objek 3D yang bisa disentuh.
 * - Area sentuh tak terlihat (`area`) yang lebih besar dari bendanya.
 * - `sorot`: menyala + kilau. `petunjuk`: berdenyut pelan (belum dijelajahi).
 * - `goyang`: ganti nilainya untuk memicu goyangan lembut (jawaban salah).
 */
export function Interaktif({
  id,
  onPilih,
  area,
  posisiArea = [0, 0, 0],
  sorot = false,
  petunjuk = false,
  goyang = 0,
  aktif = true,
  diam = false,
  position,
  rotation,
  children,
}: {
  id: string;
  onPilih: (id: string) => void;
  area: Vec3;
  posisiArea?: Vec3;
  sorot?: boolean;
  petunjuk?: boolean;
  goyang?: number;
  aktif?: boolean;
  diam?: boolean;
  position?: Vec3;
  rotation?: Vec3;
  children: ReactNode;
}) {
  const grup = useRef<Group>(null);
  const isi = useRef<Group>(null);

  const goyangMulai = useRef<number | null>(null);
  const nyala = useRef(0);


  useEffect(() => {
    if (goyang > 0) goyangMulai.current = -1;
  }, [goyang]);

  useFrame(({ clock }, delta) => {
    const g = isi.current;
    if (!g) return;
    const t = clock.elapsedTime;

    // Goyang lembut (salah)
    if (goyangMulai.current === -1) goyangMulai.current = t;
    if (goyangMulai.current !== null) {
      const d = t - goyangMulai.current;
      if (d > 0.7 || diam) {
        goyangMulai.current = null;
        g.rotation.z = 0;
      } else {
        g.rotation.z = Math.sin(d * 28) * 0.08 * (1 - d / 0.7);
      }
    }

    // Skala: denyut petunjuk / sorot
    let s = 1;
    if (sorot) s = 1.06;
    else if (petunjuk && !diam) s = 1 + Math.sin(t * 3) * 0.025;
    const k = 1 - Math.exp(-delta * 10);
    g.scale.x += (s - g.scale.x) * k;
    g.scale.y += (s - g.scale.y) * k;
    g.scale.z += (s - g.scale.z) * k;

    // Nyala (emissive)
    const target = sorot ? 0.55 : 0;
    const sebelum = nyala.current;
    nyala.current += (target - nyala.current) * k;
    if (sebelum > 0.001 || nyala.current > 0.001) {
      const n = nyala.current;
      g.traverse((o) => {
        if (o instanceof Mesh && o.material instanceof MeshStandardMaterial) {
          o.material.emissive.copy(KUNING);
          o.material.emissiveIntensity = n;
        }
      });
    }
  });

  const pilih = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (aktif) onPilih(id);
  };

  return (
    <group ref={grup} position={position} rotation={rotation}>
      {/* Skala & goyang berporos di tengah area sentuh */}
      <group position={posisiArea}>
        <group ref={isi}>
          <group position={[-posisiArea[0], -posisiArea[1], -posisiArea[2]]}>{children}</group>
        </group>
      </group>
      <mesh
        position={posisiArea}
        onClick={pilih}
        onPointerOver={() => aktif && (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <boxGeometry args={area} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {sorot && !diam && (
        <Sparkles
          position={posisiArea}
          scale={[area[0] * 1.1, area[1] * 1.1, area[2] * 1.1]}
          count={18}
          size={6}
          speed={0.6}
          color="#fff3a0"
        />
      )}
    </group>
  );
}
