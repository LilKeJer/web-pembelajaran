/** Deteksi dukungan WebGL. `?2d=1` di URL memaksa versi 2D (untuk pengujian). */
export function adaWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("2d") === "1") return false;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}
