import type { Metadata } from "next";
import { Rumahku } from "@/components/topik/Rumahku";
import { rumahku } from "@/data/materi";

export const metadata: Metadata = { title: rumahku.info.judul };

export default function Halaman() {
  return <Rumahku />;
}
