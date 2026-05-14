import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Saudara Coffee - Premium Coffee Roastery",
  description:
    "Premium coffee roastery menghadirkan biji kopi pilihan terbaik Nusantara. Arabica, Robusta, dan Blend spesial dari petani kopi Indonesia.",
  keywords: "kopi premium, coffee bean, arabica, robusta, biji kopi, indonesia, roastery, saudara coffee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col bg-[#0A0A0A] text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
