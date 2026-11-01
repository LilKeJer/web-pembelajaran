"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import { Object3D, type Group, type InstancedMesh } from "three";
import type { IdBagianRumah, IdRuangan } from "@/data/materi";
import { Awan, Prisma, Tanah, acakTetap, yPusatPrisma } from "../common/bentuk";
import { Interaktif } from "../common/Interaktif";
import type { Vec3 } from "../common/KameraHalus";
import { Panggung } from "../common/Panggung";
import type { PropsAdeganRumahku } from "./tipe";

// Ukuran rumah
const LEBAR = 5; // x
const DALAM = 4; // z
const TINGGI_DINDING = 3;
const Y_LANTAI = 0.3;
const Z_DEPAN = 1; // muka depan dinding
const Y_ATAS = Y_LANTAI + TINGGI_DINDING;

const KAMERA: Record<string, { posisi: Vec3; lihat: Vec3 }> = {
  adegan1: { posisi: [0, 4, 14], lihat: [0, 2.6, 0] },
  adegan2: { posisi: [0, 3.6, 12.5], lihat: [0, 2.2, 0] },
  adegan3: { posisi: [0, 4.2, 10.5], lihat: [0, 1.6, -0.3] },
};

const X_RUANGAN: Record<IdRuangan, number> = { kamarTidur: -3.2, dapur: 0, kamarMandi: 3.2 };

function kameraUntuk(p: PropsAdeganRumahku) {
  if (p.adegan === 3 && p.fokus) {
    const x = X_RUANGAN[p.fokus];
    return { posisi: [x, 3, 5.4] as Vec3, lihat: [x, 1.3, -0.6] as Vec3 };
  }
  return KAMERA[`adegan${p.adegan}`];
}

export default function AdeganRumahku(p: PropsAdeganRumahku) {
  const { posisi, lihat } = kameraUntuk(p);
  return (
    <Panggung kamera={posisi} lihat={lihat} gerakDikurangi={p.gerakDikurangi}>
      <Tanah />
      {p.adegan === 1 && <Adegan1 gerak={!p.gerakDikurangi} />}
      {p.adegan === 2 && <RumahBagian {...p} />}
      {p.adegan === 3 && <RumahRuangan {...p} />}
    </Panggung>
  );
}

// ---------------------------------------------------------------------------
// Rumah luar (dipakai adegan 1 & 2)
// ---------------------------------------------------------------------------

function Pintu({ terbuka, gerak }: { terbuka: boolean; gerak: boolean }) {
  const engsel = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!engsel.current) return;
    const tujuan = terbuka ? -1.35 : 0;
    const r = engsel.current.rotation;
    r.y = gerak ? r.y + (tujuan - r.y) * (1 - Math.exp(-delta * 5)) : tujuan;
  });
  return (
    <group>
      {/* lubang pintu gelap */}
      <mesh position={[-1.1, Y_LANTAI + 1.05, Z_DEPAN + 0.01]}>
        <planeGeometry args={[1.1, 2.1]} />
        <meshStandardMaterial color="#5a3e2b" />
      </mesh>
      {/* daun pintu berengsel di sisi kiri */}
      <group ref={engsel} position={[-1.65, Y_LANTAI + 1.05, Z_DEPAN + 0.06]}>
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[1.1, 2.1, 0.1]} />
          <meshStandardMaterial color="#c0703a" />
        </mesh>
        <mesh position={[0.95, 0, 0.08]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#ffd23f" />
        </mesh>
      </group>
    </group>
  );
}

function Jendela({ denganAnak = false }: { denganAnak?: boolean }) {
  const x = 1.2;
  const y = Y_LANTAI + 1.7;
  const z = Z_DEPAN;
  return (
    <group position={[x, y, z]}>
      {/* latar dalam rumah */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.3, 1.1]} />
        <meshStandardMaterial color="#fff1c9" />
      </mesh>
      {denganAnak && <AnakDiJendela />}
      {/* kaca transparan */}
      <mesh position={[0, 0, 0.32]}>
        <boxGeometry args={[1.3, 1.1, 0.04]} />
        <meshStandardMaterial color="#9fdcff" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      {/* bingkai */}
      {(
        [
          [0, 0.6, 1.5, 0.12],
          [0, -0.6, 1.5, 0.12],
          [-0.7, 0, 0.12, 1.3],
          [0.7, 0, 0.12, 1.3],
          [0, 0, 0.08, 1.1],
          [0, 0, 1.3, 0.08],
        ] as const
      ).map(([bx, by, w, h], i) => (
        <mesh key={i} position={[bx, by, 0.32]}>
          <boxGeometry args={[w, h, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

/** Figur anak (properti tanpa nama) yang terlindung di dalam rumah, terlihat dari jendela. */
function AnakDiJendela() {
  return (
    <group position={[0, -0.08, 0]}>
      <mesh position={[0, -0.38, 0]} scale={[1, 0.45, 0.6]}>
        <sphereGeometry args={[0.36, 16, 10]} />
        <meshStandardMaterial color="#ff6b9a" />
      </mesh>
      <mesh position={[0, 0.02, 0.02]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshStandardMaterial color="#f2c49b" />
      </mesh>
      <mesh position={[0, 0.1, 0]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3b2a20" />
      </mesh>
      <mesh position={[-0.08, 0.04, 0.24]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshBasicMaterial color="#2b2350" />
      </mesh>
      <mesh position={[0.08, 0.04, 0.24]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshBasicMaterial color="#2b2350" />
      </mesh>
      <mesh position={[0, -0.05, 0.245]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.013, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#c0392b" />
      </mesh>
    </group>
  );
}

function DindingRumah() {
  return (
    <mesh position={[0, Y_LANTAI + TINGGI_DINDING / 2, Z_DEPAN - DALAM / 2]}>
      <boxGeometry args={[LEBAR, TINGGI_DINDING, DALAM]} />
      <meshStandardMaterial color="#ffe5a8" />
    </mesh>
  );
}

function AtapRumah() {
  const lebar = DALAM + 0.9;
  const tinggi = 1.7;
  return (
    <Prisma
      panjang={LEBAR + 0.7}
      lebar={lebar}
      tinggi={tinggi}
      warna="#e8553e"
      position={[0, yPusatPrisma(Y_ATAS, lebar, tinggi), Z_DEPAN - DALAM / 2]}
    />
  );
}

function LantaiRumah() {
  // Lantai rumah + teras di depan, supaya lantai terlihat jelas.
  return (
    <group>
      <mesh position={[0, Y_LANTAI / 2, Z_DEPAN - DALAM / 2 + 1]}>
        <boxGeometry args={[LEBAR + 1.4, Y_LANTAI, DALAM + 2]} />
        <meshStandardMaterial color="#c99a6b" />
      </mesh>
      {/* motif ubin */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <mesh key={x} position={[x, Y_LANTAI + 0.005, Z_DEPAN + 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 1.8]} />
          <meshStandardMaterial color="#ddb487" />
        </mesh>
      ))}
    </group>
  );
}

function RumahBagian(p: PropsAdeganRumahku) {
  const umum = (id: IdBagianRumah) => ({
    id,
    onPilih: p.onPilih as (id: string) => void,
    sorot: p.sorot === id,
    petunjuk: p.petunjuk.includes(id),
    goyang: p.goyang?.id === id ? p.goyang.nonce : 0,
    aktif: p.aktif,
    diam: p.gerakDikurangi,
  });
  const zTengah = Z_DEPAN - DALAM / 2;
  return (
    <group>
      <Interaktif {...umum("lantai")} area={[LEBAR + 1.6, 0.7, 2.2]} posisiArea={[0, 0.2, Z_DEPAN + 1]}>
        <LantaiRumah />
      </Interaktif>
      <Interaktif
        {...umum("dinding")}
        area={[LEBAR + 0.2, TINGGI_DINDING, DALAM + 0.2]}
        posisiArea={[0, Y_LANTAI + TINGGI_DINDING / 2, zTengah]}
      >
        <DindingRumah />
      </Interaktif>
      <Interaktif
        {...umum("atap")}
        area={[LEBAR + 1, 2, DALAM + 1.2]}
        posisiArea={[0, Y_ATAS + 0.9, zTengah]}
      >
        <AtapRumah />
      </Interaktif>
      <Interaktif
        {...umum("pintu")}
        area={[1.5, 2.4, 0.9]}
        posisiArea={[-1.1, Y_LANTAI + 1.1, Z_DEPAN + 0.35]}
      >
        <Pintu terbuka={p.pintuTerbuka} gerak={!p.gerakDikurangi} />
      </Interaktif>
      <Interaktif
        {...umum("jendela")}
        area={[1.7, 1.5, 0.9]}
        posisiArea={[1.2, Y_LANTAI + 1.7, Z_DEPAN + 0.35]}
      >
        <Jendela />
      </Interaktif>
      <Pohon position={[-5.2, 0, -1]} />
      <Pohon position={[5.4, 0, -1.5]} skala={0.85} />
    </group>
  );
}

function Pohon({ position, skala = 1 }: { position: Vec3; skala?: number }) {
  return (
    <group position={position} scale={skala}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 1.8, 8]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[1.1, 12, 10]} />
        <meshStandardMaterial color="#3bb273" flatShading />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Adegan 1 — matahari lalu hujan, rumah melindungi anak
// ---------------------------------------------------------------------------

const JUMLAH_HUJAN = 140;
const SIKLUS = 10; // detik
const MULAI_HUJAN = 4.5;

// Data tetes hujan (dimutasi tiap frame, di luar state React).
const tetes = (() => {
  const r = acakTetap(7);
  return Array.from({ length: JUMLAH_HUJAN }, () => ({
    x: -8 + r() * 16,
    z: -4 + r() * 9,
    y: r() * 10,
    v: 7 + r() * 3,
  }));
})();
const dummy = new Object3D();

function Adegan1({ gerak }: { gerak: boolean }) {
  const matahari = useRef<Group>(null);
  const awan = useRef<Group>(null);
  const hujan = useRef<InstancedMesh>(null);

  useFrame(({ clock }, delta) => {
    const t = gerak ? clock.elapsedTime % SIKLUS : 2; // tanpa gerak: tampil cerah tetap
    const lagiHujan = t > MULAI_HUJAN;
    const k = 1 - Math.exp(-delta * 3);

    if (matahari.current) {
      const s = lagiHujan ? 0.001 : 1;
      matahari.current.scale.setScalar(matahari.current.scale.x + (s - matahari.current.scale.x) * k);
      matahari.current.rotation.z += delta * 0.4;
    }
    if (awan.current) {
      const s = lagiHujan ? 1 : 0.001;
      awan.current.scale.setScalar(awan.current.scale.x + (s - awan.current.scale.x) * k);
    }
    const m = hujan.current;
    if (!m) return;
    m.visible = lagiHujan;
    if (!lagiHujan) return;
    for (let i = 0; i < tetes.length; i++) {
      const d = tetes[i];
      d.y -= d.v * delta;
      const diAtasRumah = Math.abs(d.x) < LEBAR / 2 + 0.5 && d.z > Z_DEPAN - DALAM - 0.5 && d.z < Z_DEPAN + 0.5;
      const batas = diAtasRumah ? Y_ATAS + 0.6 : 0;
      if (d.y < batas) d.y = 9 + (i % 5) * 0.3;
      dummy.position.set(d.x, d.y, d.z);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <LantaiRumah />
      <DindingRumah />
      <AtapRumah />
      <Pintu terbuka={false} gerak={gerak} />
      <Jendela denganAnak />
      <Pohon position={[-5.2, 0, -1]} />
      <Pohon position={[5.4, 0, -1.5]} skala={0.85} />

      {/* Matahari */}
      <group ref={matahari} position={[-4.5, 7.6, -3]}>
        <mesh>
          <sphereGeometry args={[1.1, 20, 16]} />
          <meshBasicMaterial color="#ffd23f" />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]} position={[0, 0, -0.05]}>
            <boxGeometry args={[3.3, 0.18, 0.05]} />
            <meshBasicMaterial color="#ffb703" />
          </mesh>
        ))}
      </group>

      {/* Awan hujan */}
      <group ref={awan} position={[0, 8.6, -2]} scale={0.001}>
        <Awan position={[-2.5, 0, 0]} skala={1.3} warna="#c9d3df" />
        <Awan position={[2, 0.3, 0]} skala={1.5} warna="#b8c4d2" />
      </group>

      {/* Tetes hujan */}
      <instancedMesh ref={hujan} args={[undefined, undefined, JUMLAH_HUJAN]} visible={false}>
        <boxGeometry args={[0.04, 0.45, 0.04]} />
        <meshBasicMaterial color="#3a86ff" />
      </instancedMesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Adegan 3 — rumah potongan dengan 3 ruangan
// ---------------------------------------------------------------------------

const LEBAR_RUANG = 3.2;
const TINGGI_RUANG = 3;
const DALAM_RUANG = 4.2;

function RumahRuangan(p: PropsAdeganRumahku) {
  const lebarTotal = LEBAR_RUANG * 3;
  const umum = (id: IdRuangan) => ({
    id,
    onPilih: p.onPilih as (id: string) => void,
    sorot: p.sorot === id,
    petunjuk: p.petunjuk.includes(id),
    goyang: p.goyang?.id === id ? p.goyang.nonce : 0,
    aktif: p.aktif,
    diam: p.gerakDikurangi,
  });

  return (
    <group>
      {/* alas & atap (properti) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[lebarTotal + 0.4, 0.3, DALAM_RUANG + 0.4]} />
        <meshStandardMaterial color="#c99a6b" />
      </mesh>
      <Prisma
        panjang={lebarTotal + 0.8}
        lebar={DALAM_RUANG + 0.8}
        tinggi={1.6}
        warna="#e8553e"
        position={[0, yPusatPrisma(0.3 + TINGGI_RUANG + 0.15, DALAM_RUANG + 0.8, 1.6) , -0.6]}
      />
      <mesh position={[0, 0.3 + TINGGI_RUANG + 0.07, -0.6]}>
        <boxGeometry args={[lebarTotal + 0.4, 0.15, DALAM_RUANG - 0.8]} />
        <meshStandardMaterial color="#f4ead5" />
      </mesh>

      <Interaktif {...umum("kamarTidur")} position={[X_RUANGAN.kamarTidur, 0, 0]} area={[3, 3, 4]} posisiArea={[0, 1.8, 0]}>
        <Ruang dinding="#bfd7ff" lantai="#a3c4f3">
          <Kasur />
        </Ruang>
      </Interaktif>
      <Interaktif {...umum("dapur")} position={[X_RUANGAN.dapur, 0, 0]} area={[3, 3, 4]} posisiArea={[0, 1.8, 0]}>
        <Ruang dinding="#fff0b3" lantai="#f2d48f">
          <AlatMasak />
        </Ruang>
      </Interaktif>
      <Interaktif {...umum("kamarMandi")} position={[X_RUANGAN.kamarMandi, 0, 0]} area={[3, 3, 4]} posisiArea={[0, 1.8, 0]}>
        <Ruang dinding="#c4f1ea" lantai="#ffffff" ubin>
          <BakMandi />
        </Ruang>
      </Interaktif>

      {/* sekat antar ruangan */}
      {[-LEBAR_RUANG / 2, LEBAR_RUANG / 2].map((x) => (
        <mesh key={x} position={[x * 1, 0.3 + TINGGI_RUANG / 2, -0.4]}>
          <boxGeometry args={[0.15, TINGGI_RUANG, DALAM_RUANG - 0.4]} />
          <meshStandardMaterial color="#f4ead5" />
        </mesh>
      ))}
      {[-(lebarTotal / 2), lebarTotal / 2].map((x) => (
        <mesh key={x} position={[x, 0.3 + TINGGI_RUANG / 2, -0.4]}>
          <boxGeometry args={[0.2, TINGGI_RUANG, DALAM_RUANG - 0.4]} />
          <meshStandardMaterial color="#ffe5a8" />
        </mesh>
      ))}
    </group>
  );
}

function Ruang({
  dinding,
  lantai,
  ubin = false,
  children,
}: {
  dinding: string;
  lantai: string;
  ubin?: boolean;
  children: ReactNode;
}) {
  return (
    <group>
      {/* dinding belakang */}
      <mesh position={[0, 0.3 + TINGGI_RUANG / 2, -DALAM_RUANG / 2 + 0.1]}>
        <boxGeometry args={[LEBAR_RUANG, TINGGI_RUANG, 0.2]} />
        <meshStandardMaterial color={dinding} />
      </mesh>
      {/* lantai ruangan */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LEBAR_RUANG - 0.1, DALAM_RUANG]} />
        <meshStandardMaterial color={lantai} />
      </mesh>
      {ubin &&
        [-1, 0, 1].map((i) => (
          <mesh key={i} position={[i, 0.3 + 1.2, -DALAM_RUANG / 2 + 0.21]}>
            <planeGeometry args={[0.9, 2.2]} />
            <meshStandardMaterial color="#9fe3d6" />
          </mesh>
        ))}
      {children}
    </group>
  );
}

function Kasur() {
  return (
    <group position={[0, 0.3, -0.6]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 0.5, 2.6]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 0.65, 0.05]}>
        <boxGeometry args={[2.05, 0.25, 2.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.7, 0.45]}>
        <boxGeometry args={[2.06, 0.28, 1.5]} />
        <meshStandardMaterial color="#ff6b9a" />
      </mesh>
      <mesh position={[0, 0.9, -0.85]}>
        <boxGeometry args={[1.3, 0.25, 0.55]} />
        <meshStandardMaterial color="#fff8e7" />
      </mesh>
      <mesh position={[0, 1.05, -1.25]}>
        <boxGeometry args={[2.2, 1.0, 0.15]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
    </group>
  );
}

function AlatMasak() {
  return (
    <group position={[0, 0.3, -1.3]}>
      {/* meja kompor */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.6, 1, 1.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.5, 1.03, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* panci */}
      <mesh position={[-0.75, 1.25, 0]}>
        <cylinderGeometry args={[0.32, 0.28, 0.38, 14]} />
        <meshStandardMaterial color="#ff8c42" metalness={0.2} />
      </mesh>
      {/* wajan */}
      <mesh position={[-0.2, 1.12, 0.05]}>
        <cylinderGeometry args={[0.3, 0.2, 0.12, 14]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.3, 1.14, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* rak & piring */}
      <mesh position={[0.7, 2.1, -0.35]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#c0703a" />
      </mesh>
      {[0.35, 0.7, 1.05].map((x) => (
        <mesh key={x} position={[x, 2.33, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 14]} />
          <meshStandardMaterial color="#3a86ff" />
        </mesh>
      ))}
    </group>
  );
}

function BakMandi() {
  return (
    <group position={[0, 0.3, -0.9]}>
      {/* bak */}
      <mesh position={[0.2, 0.45, 0]}>
        <boxGeometry args={[2.2, 0.9, 1.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial color="#7cc8ff" />
      </mesh>
      {/* gayung (properti) */}
      <mesh position={[0.7, 0.98, 0.1]}>
        <cylinderGeometry args={[0.17, 0.14, 0.2, 12]} />
        <meshStandardMaterial color="#ffd23f" />
      </mesh>
      {/* pancuran */}
      <mesh position={[-1.1, 1.6, -0.6]}>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 8]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} />
      </mesh>
      <mesh position={[-0.9, 2.85, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} />
      </mesh>
      <mesh position={[-0.65, 2.75, -0.6]}>
        <cylinderGeometry args={[0.22, 0.12, 0.15, 12]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} />
      </mesh>
    </group>
  );
}
