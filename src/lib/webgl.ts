let hasil: boolean | null = null;

/** Deteksi dukungan WebGL (sekali saja). `?2d=1` di URL memaksa versi 2D (untuk pengujian). */
export function adaWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (hasil !== null) return hasil;
  try {
    if (new URLSearchParams(window.location.search).get("2d") === "1") {
      hasil = false;
    } else {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      hasil = !!gl;
    }
  } catch {
    hasil = false;
  }
  return hasil;
}
