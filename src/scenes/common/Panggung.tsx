"use client";

import { Canvas } from "@react-three/fiber";
import { useSyncExternalStore, type ReactNode } from "react";
import { KameraHalus, type Vec3 } from "./KameraHalus";

function langgananVisibility(f: () => void) {
  document.addEventListener("visibilitychange", f);
  return () => document.removeEventListener("visibilitychange", f);
}
const tabTerlihat = () => document.visibilityState !== "hidden";

/**
 * Canvas bersama: dpr dibatasi, tanpa shadow map, render berhenti saat tab tersembunyi.
 * Kamera tetap (tanpa putar/zoom bebas), bergerak halus ke `kamera`/`lihat`.
 */
export function Panggung({
  kamera,
  kameraAwal,
  lihat,
  latar = "#bfe9ff",
  gerakDikurangi = false,
  children,
}: {
  kamera: Vec3;
  /** Posisi kamera saat pertama muncul (lalu bergerak halus ke `kamera`). */
  kameraAwal?: Vec3;
  lihat: Vec3;
  latar?: string;
  gerakDikurangi?: boolean;
  children: ReactNode;
}) {
  const terlihat = useSyncExternalStore(langgananVisibility, tabTerlihat, () => true);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={terlihat ? "always" : "never"}
      camera={{ position: kameraAwal ?? kamera, fov: 45, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "low-power", alpha: false }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={[latar]} />
      <hemisphereLight args={["#ffffff", "#9fd89f", 1.6]} />
      <directionalLight position={[6, 10, 8]} intensity={1.6} />
      <KameraHalus posisi={kamera} lihat={lihat} instan={gerakDikurangi} />
      {children}
    </Canvas>
  );
}
