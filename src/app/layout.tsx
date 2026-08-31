import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAG — Your Wardrobe, Tagged.",
  description: "A brutalist wardrobe inventory app. Tag every piece. Know what you own. Wear more of it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${ibmPlexMono.variable} ${spaceMono.variable} font-body antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
