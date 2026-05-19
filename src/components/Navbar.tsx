'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function Navbar() {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useStoreSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
          : 'bg-surface/70 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/logo.PNG" alt={settings.storeName || 'Sundara Coffee'} className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gold tracking-wide">
                {settings.storeName || 'Sundara Coffee'}
              </span>
              <span className="text-[10px] text-text-secondary -mt-1 tracking-[0.2em] uppercase">
                {settings.slogan || 'Premium Roastery'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-text-secondary hover:text-gold transition-all duration-300 font-medium text-sm tracking-wide relative group"
            >
              Beranda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/catalog"
              className="text-text-secondary hover:text-gold transition-all duration-300 font-medium text-sm tracking-wide relative group"
            >
              Katalog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/contact"
              className="text-text-secondary hover:text-gold transition-all duration-300 font-medium text-sm tracking-wide relative group"
            >
              Kontak
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/cart"
              className="relative text-text-secondary hover:text-gold transition-all duration-300 font-medium text-sm tracking-wide flex items-center group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              Keranjang
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-3 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-gold hover:bg-surface-card rounded-lg transition-all duration-300 border border-border"
                aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            <Link
              href="/admin/login"
              className="px-5 py-2 border border-border text-text-secondary hover:text-gold hover:border-gold/50 rounded-lg transition-all duration-300 font-medium text-sm flex items-center group"
            >
              <svg className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </Link>
          </div>

          {/* Mobile menu button + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-gold hover:bg-surface-card rounded-lg transition-all duration-300 border border-border"
                aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 border border-border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border animate-fade-in-down">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/catalog"
              className="block px-4 py-3 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Katalog
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link
              href="/cart"
              className="block px-4 py-3 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 text-sm font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              Keranjang
              {itemCount > 0 && (
                <span className="ml-2 bg-gold text-black text-xs font-bold rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/login"
              className="block px-4 py-3 rounded-lg text-text-secondary hover:text-gold hover:bg-surface-card transition-all duration-300 text-sm font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
