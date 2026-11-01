"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Narasi suara dengan Web Speech API (id-ID).
 * Panggil `bicara()` langsung dari handler ketukan (HP memblokir suara tanpa interaksi).
 * Jika `audio` diberikan (rekaman guru, mp3), file itu yang diputar.
 */

let suaraIndonesia: SpeechSynthesisVoice | null = null;
let sudahCariSuara = false;

function cariSuara() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const semua = window.speechSynthesis.getVoices();
  if (semua.length === 0) return;
  sudahCariSuara = true;
  suaraIndonesia =
    semua.find((v) => v.lang === "id-ID") ??
    semua.find((v) => v.lang === "id_ID") ??
    semua.find((v) => v.lang.toLowerCase().startsWith("id")) ??
    null;
}

let audioAktif: HTMLAudioElement | null = null;

function hentikanSemua() {
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    /* abaikan */
  }
  if (audioAktif) {
    audioAktif.pause();
    audioAktif = null;
  }
}

let izinTerbuka = false;

/** Apakah izin suara sudah dibuka di sesi halaman ini (bertahan saat pindah rute). */
export function izinSuaraTerbuka() {
  return izinTerbuka;
}

/** Membuka izin suara: dipanggil dari ketukan pertama ("Ayo Mulai!"). */
export function bukaIzinSuara() {
  izinTerbuka = true;
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }
  } catch {
    /* abaikan */
  }
}

export function useSpeech() {
  const [sedangBicara, setSedangBicara] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!sudahCariSuara) cariSuara();
    const synth = window.speechSynthesis;
    synth.addEventListener("voiceschanged", cariSuara);
    return () => {
      synth.removeEventListener("voiceschanged", cariSuara);
    };
  }, []);

  useEffect(() => () => hentikanSemua(), []);

  const bicara = useCallback((teks: string, opsi?: { audio?: string; selesai?: () => void }) => {
    hentikanSemua();
    const id = ++idRef.current;
    const akhiri = () => {
      if (idRef.current !== id) return;
      setSedangBicara(false);
      opsi?.selesai?.();
    };
    setSedangBicara(true);

    if (opsi?.audio) {
      const a = new Audio(opsi.audio);
      audioAktif = a;
      a.onended = akhiri;
      a.onerror = akhiri;
      a.play().catch(akhiri);
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // Tanpa suara: tetap lanjut setelah jeda singkat. Teks selalu tampil di layar.
      setTimeout(akhiri, 600);
      return;
    }
    try {
      if (!sudahCariSuara) cariSuara();
      const u = new SpeechSynthesisUtterance(teks);
      u.lang = "id-ID";
      if (suaraIndonesia) u.voice = suaraIndonesia;
      u.rate = 0.9;
      u.pitch = 1.1;
      u.onend = akhiri;
      u.onerror = akhiri;
      window.speechSynthesis.speak(u);
    } catch {
      setTimeout(akhiri, 600);
    }
  }, []);

  const diam = useCallback(() => {
    idRef.current++;
    hentikanSemua();
    setSedangBicara(false);
  }, []);

  return { bicara, diam, sedangBicara };
}
