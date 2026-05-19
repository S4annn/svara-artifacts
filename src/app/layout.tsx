import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RelicVerse: Museum Hidup Adventure",
  description: "Jelajahi museum 2D interaktif, bicara dengan artefak melalui AI, selesaikan quest, kumpulkan memory fragment, dan jadilah Relic Keeper.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#071510] text-[#F8F1E7]">
        {children}
      </body>
    </html>
  );
}
