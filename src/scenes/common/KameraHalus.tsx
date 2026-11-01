"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

export type Vec3 = [number, number, number];

/** Rasio layar acuan. Pada layar lebih sempit (HP portrait), kamera mundur agar adegan tetap muat. */
const RASIO_ACUAN = 1.25;

/**
 * Kamera tetap yang bergerak halus menuju posisi & titik pandang target.
 * Tidak ada kontrol putar/zoom oleh pengguna.
 */
export function KameraHalus({ posisi, lihat, instan = false }: { posisi: Vec3; lihat: Vec3; instan?: boolean }) {
  const camera = useThree((s) => s.camera);
  const ukuran = useThree((s) => s.size);
  const lihatSekarang = useRef(new Vector3(...lihat));
  const tujuan = useRef(new Vector3());
  const tujuanLihat = useRef(new Vector3());

  useFrame((_, delta) => {
    const rasio = ukuran.width / Math.max(1, ukuran.height);
    const faktor = rasio < RASIO_ACUAN ? Math.min(2.2, Math.pow(RASIO_ACUAN / rasio, 0.8)) : 1;

    tujuanLihat.current.set(...lihat);
    tujuan.current.set(...posisi).sub(tujuanLihat.current).multiplyScalar(faktor);
    // Layar sempit: kamera sedikit lebih tinggi supaya adegan mengisi tinggi layar.
    if (faktor > 1) tujuan.current.y += (faktor - 1) * tujuan.current.length() * 0.22;
    tujuan.current.add(tujuanLihat.current);

    if (instan) {
      camera.position.copy(tujuan.current);
      lihatSekarang.current.copy(tujuanLihat.current);
    } else {
      const t = 1 - Math.exp(-delta * 2.5);
      camera.position.lerp(tujuan.current, t);
      lihatSekarang.current.lerp(tujuanLihat.current, t);
    }
    camera.lookAt(lihatSekarang.current);
  });

  return null;
}
