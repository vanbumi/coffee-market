'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function Footer() {
  const { settings } = useStoreSettings();
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Terima kasih telah berlangganan newsletter kami!');
  };

  return (
    <footer className="bg-surface border-t border-border mt-20">
      {/* Gold accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/logo.PNG" alt={settings.storeName || 'Revaktor'} width={120} height={40} className="h-10 w-auto" />
              <div>
                <span className="font-bold text-xl text-gold tracking-wide">{settings.storeName || 'Revaktor'}</span>
                <p className="text-[10px] text-text-secondary -mt-1 tracking-[0.2em] uppercase">{settings.slogan || 'Premium Roastery'}</p>
              </div>
            </div>
            <p className="text-text-secondary mb-6 text-sm leading-relaxed">
              {settings.slogan || 'Premium coffee roastery yang menghadirkan biji kopi pilihan terbaik dari seluruh Nusantara. Dari petani kopi pilihan, langsung ke cangkir Anda.'}
            </p>
            <div className="space-y-3 text-text-secondary">
              <p className="flex items-center text-sm group">
                <svg className="h-4 w-4 mr-3 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {settings.address || 'Jl. Kopi Nikmat No. 123, Bandung'}
              </p>
              <p className="flex items-center text-sm group">
                <svg className="h-4 w-4 mr-3 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {settings.email || 'hello@revaktor.com'}
              </p>
              <p className="flex items-center text-sm group">
                <svg className="h-4 w-4 mr-3 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {settings.phone || '+62 812-3456-7890'}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gold mb-6 text-sm tracking-wider uppercase">Menu</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-text-secondary hover:text-gold transition-all duration-300 text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300 mr-0 group-hover:mr-2" />
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-text-secondary hover:text-gold transition-all duration-300 text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300 mr-0 group-hover:mr-2" />
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-gold transition-all duration-300 text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300 mr-0 group-hover:mr-2" />
                  Kontak & FAQ
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-text-secondary hover:text-gold transition-all duration-300 text-sm flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all duration-300 mr-0 group-hover:mr-2" />
                  Keranjang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gold mb-6 text-sm tracking-wider uppercase">Jam Operasional</h3>
            {settings.operatingHours ? (
              <ul className="space-y-3 text-text-secondary text-sm">
                {Object.entries(settings.operatingHours).map(([day, hours]) => {
                  const dayLabel =
                    day === 'senin' ? 'Senin' : day === 'selasa' ? 'Selasa' : day === 'rabu' ? 'Rabu' :
                    day === 'kamis' ? 'Kamis' : day === 'jumat' ? 'Jumat' : day === 'sabtu' ? 'Sabtu' : 'Minggu';
                  return (
                    <li key={day} className="flex justify-between">
                      <span>{dayLabel}</span>
                      <span className="text-text-primary">{hours.closed ? 'Tutup' : `${hours.open} - ${hours.close}`}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-3 text-text-secondary text-sm">
                <li className="flex justify-between"><span>Senin - Jumat</span><span className="text-text-primary">08:00 - 20:00</span></li>
                <li className="flex justify-between"><span>Sabtu</span><span className="text-text-primary">09:00 - 18:00</span></li>
                <li className="flex justify-between"><span>Minggu</span><span className="text-text-primary">10:00 - 16:00</span></li>
              </ul>
            )}
            <div className="mt-6">
              <h3 className="font-semibold text-gold mb-4 text-sm tracking-wider uppercase">Ikuti Kami</h3>
              <div className="flex space-x-3">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 group">
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 group">
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-text-secondary hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 group">
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gold mb-6 text-sm tracking-wider uppercase">Newsletter</h3>
            <p className="text-text-secondary text-sm mb-4">
              Dapatkan info promo dan produk terbaru langsung di email Anda.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Anda"
                  required
                  className="w-full px-4 py-3 bg-surface-card border border-border rounded-lg text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-all duration-300 text-sm tracking-wide"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} {settings.storeName || 'Revaktor'} by revaktor.com. All rights reserved.
          </p>
          <p className="text-text-secondary text-xs">
            Crafted with ☕ and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
