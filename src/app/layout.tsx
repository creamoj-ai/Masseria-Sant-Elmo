import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Essenze di Natura - Location Esclusiva Vesuvio",
  description: "Luogo esclusivo per matrimoni, cerimonie e corporate events nel Parco del Vesuvio",
  openGraph: {
    title: "Essenze di Natura - Location Esclusiva",
    description: "Matrimoni, cerimonie, e corporate events in una location unica nel Vesuvio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
