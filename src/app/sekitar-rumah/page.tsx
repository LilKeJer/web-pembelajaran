import type { Metadata } from "next";
import { SekitarRumah } from "@/components/topik/SekitarRumah";
import { sekitarRumah } from "@/data/materi";

export const metadata: Metadata = { title: sekitarRumah.info.judul };

export default function Halaman() {
  return <SekitarRumah />;
}
