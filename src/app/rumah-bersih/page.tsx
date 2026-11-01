import type { Metadata } from "next";
import { RumahBersih } from "@/components/topik/RumahBersih";
import { rumahBersih } from "@/data/materi";

export const metadata: Metadata = { title: rumahBersih.info.judul };

export default function Halaman() {
  return <RumahBersih />;
}
