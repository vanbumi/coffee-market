import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Saudara Coffee - Jual Beli Biji Kopi Premium Nusantara",
  description:
    "Marketplace biji kopi premium dari seluruh Nusantara. Temukan kopi Arabica, Robusta, dan Blend terbaik dari petani kopi pilihan Indonesia.",
  keywords: "kopi, coffee bean, arabica, robusta, biji kopi, indonesia, nusantara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
