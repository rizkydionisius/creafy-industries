import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper/ClientLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Creafy Industries | Vendor Konveksi & Manufaktur Terbaik",
    template: "%s | Creafy Industries",
  },
  description: "Konveksi & Manufaktur Apparel B2B terpercaya. Menghasilkan produk berkualitas tinggi dengan standar jahitan garment dan ketepatan waktu produksi.",
  keywords: ["konveksi", "manufaktur apparel", "vendor baju", "sablon", "bordir", "konveksi seragam", "bikin jaket", "kaos distro", "Creafy Industries"],
  authors: [{ name: "Creafy Industries" }],
  creator: "Creafy Industries",
  openGraph: {
    title: "Creafy Industries | Vendor Pilihan",
    description: "Vendor konveksi dan manufaktur apparel custom berkualitas tinggi.",
    url: "https://creafy-industries.vercel.app", // Sesuaikan dengan domain asli
    siteName: "Creafy Industries",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creafy Industries",
    description: "Vendor konveksi dan manufaktur apparel terpercaya.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable}`}
    >
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
