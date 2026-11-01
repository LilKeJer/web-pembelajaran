import { gerakDikurangi } from "@/hooks/useReducedMotion";

/** Konfeti (canvas-confetti, dimuat saat dibutuhkan). Tidak tampil jika prefers-reduced-motion. */
export async function tembakKonfeti() {
  if (gerakDikurangi()) return;
  try {
    const { default: confetti } = await import("canvas-confetti");
    const warna = ["#ffd23f", "#ff8c42", "#3bb273", "#3a86ff", "#ff6b9a", "#8e6cef"];
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: warna, disableForReducedMotion: true });
    setTimeout(
      () => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: warna }),
      250,
    );
    setTimeout(
      () => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: warna }),
      400,
    );
  } catch {
    /* abaikan */
  }
}
