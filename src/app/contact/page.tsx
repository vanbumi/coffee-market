import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Kontak & FAQ - Sundara Coffee',
  description:
    'Hubungi Sundara Coffee, lihat pertanyaan yang sering diajukan (FAQ), atau tanya langsung ke AI tentang kopi dan pesanan Anda.',
  keywords: 'kontak kopi, faq kopi, tanya kopi, sundara coffee, customer service kopi',
  openGraph: {
    title: 'Kontak & FAQ - Sundara Coffee',
    description: 'Hubungi kami, lihat FAQ, atau tanya langsung ke AI tentang kopi Nusantara premium.',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
