/**
 * Efek suara sintetis sederhana dengan Web Audio API (tanpa file audio).
 * AudioContext dibuat saat dipakai pertama kali (setelah ketukan).
 */

let ctx: AudioContext | null = null;

function ambilCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function nada(frek: number, mulai: number, durasi: number, tipe: OscillatorType = "sine", volume = 0.18) {
  const c = ambilCtx();
  if (!c) return;
  const t = c.currentTime + mulai;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = tipe;
  osc.frequency.setValueAtTime(frek, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + durasi + 0.05);
}

export const sfx = {
  /** Membuka AudioContext dari ketukan pertama. */
  buka() {
    ambilCtx();
  },
  ketuk() {
    nada(660, 0, 0.08, "triangle", 0.12);
  },
  benar() {
    [523, 659, 784, 1047].forEach((f, i) => nada(f, i * 0.09, 0.22, "triangle"));
  },
  salah() {
    nada(330, 0, 0.18, "sine", 0.1);
    nada(294, 0.15, 0.25, "sine", 0.1);
  },
  bintang() {
    [784, 988, 1175, 1568].forEach((f, i) => nada(f, i * 0.07, 0.3, "sine", 0.15));
  },
  wus() {
    const c = ambilCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.25);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  },
  gosok() {
    nada(500 + Math.random() * 200, 0, 0.06, "square", 0.04);
  },
};
