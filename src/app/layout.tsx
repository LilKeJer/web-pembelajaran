import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import { teksUi } from "@/data/teks-ui";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: teksUi.namaAplikasi,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#bfe9ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fredoka.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
