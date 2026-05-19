import type { Metadata } from "next";
import "./globals.css";
import PublicLayoutShell from "@/components/PublicLayoutShell";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Revaktor - Premium Coffee Roastery",
  description:
    "Premium coffee roastery menghadirkan biji kopi pilihan terbaik Nusantara. Arabica, Robusta, dan Blend spesial dari petani kopi Indonesia.",
  keywords: "kopi premium, coffee bean, arabica, robusta, biji kopi, indonesia, roastery, revaktor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('coffee-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-surface text-text-primary transition-colors duration-300">
        <ThemeProvider>
          <PublicLayoutShell>{children}</PublicLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
