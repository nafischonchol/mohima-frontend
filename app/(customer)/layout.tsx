import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohima Premium Beauty | Curated K-Beauty & Luxury Skincare",
  description: "Experience the glow with Mohima's premium collection of authentic Korean beauty and luxury skincare. Curated routines for glass skin, hydration, and radiant health.",
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} min-h-screen flex flex-col bg-[#FAF9F6] text-[#121212] antialiased`}>
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
